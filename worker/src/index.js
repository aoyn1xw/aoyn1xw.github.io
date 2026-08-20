const allowedFields = new Set(['name', 'contactMethod', 'contact', 'projectType', 'summary', 'requirements', 'existingUrl', 'budget', 'deadlineType', 'deadlineDate', 'references', 'companyWebsite']);
const contactMethods = new Set(['Email', 'Telegram', 'Discord']);
const projectTypes = new Set(['Small website or landing page', 'Bug fix or focused code edit', 'Script or automation', 'Bot feature', 'UI cleanup', 'README or GitHub setup', 'Other small request']);
const budgets = new Set(['Under €50', '€50–€100', '€100–€250', '€250+', 'Not sure yet']);

function cors(origin, allowedOrigin) {
  const allowed = origin === allowedOrigin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
  return allowed ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' } : null;
}
function text(value, max) { return typeof value === 'string' ? value.trim().slice(0, max + 1) : ''; }
function httpsUrl(value) { if (!value) return true; try { return new URL(value).protocol === 'https:'; } catch { return false; } }
function valid(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !allowedFields.has(key))) return false;
  const d = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, text(value, 3000)]));
  if (!d.name || d.name.length > 80 || !contactMethods.has(d.contactMethod) || !d.contact || d.contact.length > 254) return false;
  if (d.contactMethod === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact)) return false;
  if (!projectTypes.has(d.projectType) || d.summary.length < 30 || d.summary.length > 1500 || d.requirements.length < 20 || d.requirements.length > 3000) return false;
  if (d.existingUrl.length > 500 || !httpsUrl(d.existingUrl) || !budgets.has(d.budget) || d.references.length > 1500) return false;
  if (!['No fixed deadline', 'I have a deadline'].includes(d.deadlineType)) return false;
  if (d.deadlineType === 'I have a deadline' && (!/^\d{4}-\d{2}-\d{2}$/.test(d.deadlineDate) || d.deadlineDate <= new Date().toISOString().slice(0, 10))) return false;
  return d;
}
function telegramMessage(d, id) {
  return [`New commission request: ${id}`, '', `Name: ${d.name}`, `Contact method: ${d.contactMethod}`, `Contact: ${d.contact}`, `Project type: ${d.projectType}`, `Budget: ${d.budget}`, `Deadline: ${d.deadlineType === 'I have a deadline' ? d.deadlineDate : d.deadlineType}`, '', 'Summary:', d.summary, '', 'Must-have features:', d.requirements, '', `Existing project: ${d.existingUrl || 'None'}`, '', 'References:', d.references || 'None'].join('\n');
}
export default { async fetch(request, env) {
  const origin = request.headers.get('Origin'); const headers = cors(origin, env.ALLOWED_ORIGIN);
  if (!headers) return new Response('Forbidden', { status: 403 });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return Response.json({ ok: false }, { status: 405, headers });
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return Response.json({ ok: false }, { status: 415, headers });
  if (env.RATE_LIMITER && !(await env.RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' })).success) return Response.json({ ok: false }, { status: 429, headers });
  let body; try { body = await request.json(); } catch { return Response.json({ ok: false }, { status: 400, headers }); }
  const data = valid(body); if (!data) return Response.json({ ok: false }, { status: 400, headers });
  if (data.companyWebsite) return Response.json({ ok: true, requestId: `REQ-${crypto.randomUUID().slice(0, 8).toUpperCase()}` }, { headers });
  const requestId = `REQ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const telegram = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: telegramMessage(data, requestId) }) });
  if (!telegram.ok) return Response.json({ ok: false }, { status: 502, headers });
  return Response.json({ ok: true, requestId }, { headers });
}};
