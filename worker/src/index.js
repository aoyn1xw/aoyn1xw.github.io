// =============================================================================
// COMMISSION REQUEST WORKER
//
// Forwards validated commission form submissions to a private Telegram chat.
// Secrets (set via `wrangler secret put`):
//   - TELEGRAM_BOT_TOKEN
//   - TELEGRAM_CHAT_ID
// =============================================================================

const ALLOWED_METHODS = 'POST, OPTIONS';
const MAX_BODY_BYTES = 16 * 1024;
const MIN_DESCRIPTION_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 3000;
const MAX_DEADLINE_LENGTH = 100;
const MAX_REFERENCE_LINKS = 5;
const USERNAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

const REQUIRED_STRING_FIELDS = ['telegram_username', 'project_description'];
const OPTIONAL_STRING_FIELDS = ['preferred_deadline'];

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const memoryRateLimits = new Map();

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function parseAllowedOrigins(env) {
    const raw = typeof env.ALLOWED_ORIGINS === 'string' ? env.ALLOWED_ORIGINS : '';
    return raw
        .split(',')
        .map(origin => origin.trim())
        .filter(origin => origin !== '');
}

function resolveOrigin(request, env) {
    const origin = request.headers.get('Origin');
    if (!origin) {
        return { allowed: true, origin: null };
    }
    if (parseAllowedOrigins(env).includes(origin)) {
        return { allowed: true, origin };
    }
    return { allowed: false, origin };
}

function corsHeaders(origin) {
    const headers = { 'Vary': 'Origin' };
    if (origin) {
        headers['Access-Control-Allow-Origin'] = origin;
    }
    return headers;
}

function jsonResponse(body, status, origin) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            ...corsHeaders(origin)
        }
    });
}

function errorResponse(code, status, origin) {
    return jsonResponse({ ok: false, error: code }, status, origin);
}

function handlePreflight(request, env) {
    const { allowed, origin } = resolveOrigin(request, env);
    if (!allowed) {
        return new Response(null, { status: 403 });
    }
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
            'Vary': 'Origin'
        }
    });
}

function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidReferenceLink(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function validateSubmission(payload) {
    if (!isPlainObject(payload)) {
        return { ok: false, reason: 'payload_not_object' };
    }

    const allowedKeys = new Set([
        ...REQUIRED_STRING_FIELDS,
        ...OPTIONAL_STRING_FIELDS,
        'reference_links',
        'accepted_terms',
        'understands_request',
        'website'
    ]);
    for (const key of Object.keys(payload)) {
        if (!allowedKeys.has(key)) {
            return { ok: false, reason: 'unexpected_field' };
        }
    }

    if (typeof payload.website === 'string' && payload.website.trim() !== '') {
        return { ok: false, reason: 'spam_detected' };
    }

    for (const field of REQUIRED_STRING_FIELDS) {
        if (typeof payload[field] !== 'string') {
            return { ok: false, reason: 'missing_field' };
        }
    }
    for (const field of OPTIONAL_STRING_FIELDS) {
        if (payload[field] !== undefined && typeof payload[field] !== 'string') {
            return { ok: false, reason: 'invalid_field_type' };
        }
    }

    const username = payload.telegram_username.trim().replace(/^@+/, '');
    if (!USERNAME_PATTERN.test(username)) {
        return { ok: false, reason: 'invalid_telegram_username' };
    }

    const description = payload.project_description.trim();
    if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
        return { ok: false, reason: 'invalid_description_length' };
    }

    let deadline = '';
    if (payload.preferred_deadline !== undefined) {
        deadline = payload.preferred_deadline.trim();
        if (deadline.length > MAX_DEADLINE_LENGTH) {
            return { ok: false, reason: 'invalid_deadline_length' };
        }
    }

    let referenceLinks = [];
    if (payload.reference_links !== undefined && payload.reference_links !== null) {
        if (!Array.isArray(payload.reference_links)) {
            return { ok: false, reason: 'invalid_reference_links' };
        }
        if (payload.reference_links.length > MAX_REFERENCE_LINKS) {
            return { ok: false, reason: 'too_many_reference_links' };
        }
        for (const link of payload.reference_links) {
            if (typeof link !== 'string' || !isValidReferenceLink(link.trim())) {
                return { ok: false, reason: 'invalid_reference_link' };
            }
            referenceLinks.push(link.trim());
        }
    }

    if (payload.accepted_terms !== true || payload.understands_request !== true) {
        return { ok: false, reason: 'acknowledgements_missing' };
    }

    return {
        ok: true,
        value: {
            username: '@' + username,
            description,
            deadline,
            referenceLinks
        }
    };
}

function formatBerlinTimestamp() {
    try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Berlin',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${formatter.format(new Date())} (Europe/Berlin)`;
    } catch {
        return new Date().toISOString();
    }
}

export function buildTelegramMessage(submission) {
    const lines = [];
    lines.push('🆕 New commission request');
    lines.push('');
    lines.push(`Telegram: ${escapeHtml(submission.username)}`);
    lines.push('Description:');
    lines.push(escapeHtml(submission.description));

    if (submission.deadline !== '') {
        lines.push('');
        lines.push(`Preferred deadline: ${escapeHtml(submission.deadline)}`);
    }

    if (submission.referenceLinks.length > 0) {
        lines.push('');
        lines.push('Reference links:');
        for (const link of submission.referenceLinks) {
            lines.push(`- ${escapeHtml(link)}`);
        }
    }

    lines.push('');
    lines.push('Terms read: Yes');
    lines.push('Request is not acceptance acknowledged: Yes');
    lines.push(`Submitted: ${escapeHtml(formatBerlinTimestamp())}`);

    return lines.join('\n');
}

async function deliverToTelegram(env, message) {
    const response = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        }
    );

    if (!response.ok) {
        console.error(`Telegram delivery failed with status ${response.status}`);
        throw new Error('telegram_delivery_failed');
    }

    const result = await response.json().catch(() => null);
    if (!result || result.ok !== true) {
        console.error('Telegram delivery rejected the notification');
        throw new Error('telegram_delivery_rejected');
    }
}

async function checkRateLimit(request, env) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (env.RATE_LIMITER && typeof env.RATE_LIMITER.limit === 'function') {
        const result = await env.RATE_LIMITER.limit({ key: ip });
        return result.success !== false;
    }

    const now = Date.now();
    const entry = memoryRateLimits.get(ip);

    if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
        memoryRateLimits.set(ip, { windowStart: now, count: 1 });
        return true;
    }

    entry.count += 1;
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    for (const [key, value] of memoryRateLimits) {
        if (now - value.windowStart >= RATE_LIMIT_WINDOW_MS) {
            memoryRateLimits.delete(key);
        }
    }

    return true;
}

export default {
    async fetch(request, env) {
        const { allowed, origin } = resolveOrigin(request, env);

        if (request.method === 'OPTIONS') {
            return handlePreflight(request, env);
        }

        if (!allowed) {
            return errorResponse('forbidden_origin', 403, null);
        }

        if (request.method !== 'POST') {
            return errorResponse('method_not_allowed', 405, origin);
        }

        if (
            !env.TELEGRAM_BOT_TOKEN ||
            !env.TELEGRAM_CHAT_ID ||
            typeof env.TELEGRAM_BOT_TOKEN !== 'string' ||
            typeof env.TELEGRAM_CHAT_ID !== 'string'
        ) {
            console.error('Worker is missing required Telegram configuration');
            return errorResponse('internal_error', 500, origin);
        }

        let withinLimit = true;
        try {
            withinLimit = await checkRateLimit(request, env);
        } catch {
            console.error('Rate limiter unavailable, rejecting request');
            return errorResponse('service_unavailable', 503, origin);
        }
        if (!withinLimit) {
            return errorResponse('rate_limited', 429, origin);
        }

        const declaredLength = Number(request.headers.get('Content-Length'));
        if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
            return errorResponse('payload_too_large', 413, origin);
        }

        let rawBody;
        try {
            rawBody = await request.text();
        } catch {
            return errorResponse('invalid_request', 400, origin);
        }

        if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
            return errorResponse('payload_too_large', 413, origin);
        }

        let payload;
        try {
            payload = JSON.parse(rawBody);
        } catch {
            return errorResponse('invalid_request', 400, origin);
        }

        const validation = validateSubmission(payload);
        if (!validation.ok) {
            return errorResponse('invalid_request', 400, origin);
        }

        try {
            await deliverToTelegram(env, buildTelegramMessage(validation.value));
        } catch {
            return errorResponse('delivery_failed', 502, origin);
        }

        return jsonResponse({ ok: true }, 200, origin);
    }
};
