import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import worker, { buildTelegramMessage, validateSubmission } from '../src/index.js';

const ALLOWED_ORIGIN = 'https://aoyn1xw.github.io';

function makeEnv(overrides = {}) {
    return {
        TELEGRAM_BOT_TOKEN: '123456789:TEST-PLACEHOLDER-TOKEN',
        TELEGRAM_CHAT_ID: '999999999',
        ALLOWED_ORIGINS: `${ALLOWED_ORIGIN},http://localhost:3000`,
        ...overrides
    };
}

function validPayload(overrides = {}) {
    return {
        telegram_username: 'client_user',
        project_description:
            'I need a small landing page for my hobby project with a contact form and three content sections.',
        preferred_deadline: '',
        reference_links: [],
        accepted_terms: true,
        understands_request: true,
        website: '',
        ...overrides
    };
}

let telegramCalls = [];

function mockTelegram(handler) {
    telegramCalls = [];
    globalThis.fetch = async (url, init) => {
        telegramCalls.push({ url: String(url), init });
        if (handler) {
            return handler(url, init);
        }
        return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), {
            status: 200
        });
    };
}

function makeRequest(payload, { origin = ALLOWED_ORIGIN, method = 'POST', ip = randomUUID(), rawBody } = {}) {
    const headers = new Headers({
        'Content-Type': 'application/json'
    });
    if (origin !== null) {
        headers.set('Origin', origin);
    }
    headers.set('CF-Connecting-IP', ip);

    const hasBody = method !== 'GET' && method !== 'HEAD';
    return new Request('https://portfolio-commissions.example.workers.dev/', {
        method,
        headers,
        body: hasBody ? (rawBody !== undefined ? rawBody : JSON.stringify(payload)) : undefined
    });
}

test('accepts a valid submission and sends exactly one Telegram notification', async () => {
    mockTelegram();
    const response = await worker.fetch(makeRequest(validPayload()), makeEnv());
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(telegramCalls.length, 1);
    assert.match(telegramCalls[0].url, /^https:\/\/api\.telegram\.org\/bot123456789:TEST-PLACEHOLDER-TOKEN\/sendMessage$/);

    const sentBody = JSON.parse(telegramCalls[0].init.body);
    assert.equal(sentBody.chat_id, '999999999');
    assert.equal(sentBody.parse_mode, 'HTML');
    assert.match(sentBody.text, /Telegram: @client_user/);
    assert.match(sentBody.text, /New commission request/);
    assert.match(sentBody.text, /Terms read: Yes/);
});

test('rejects disallowed origins with 403', async () => {
    mockTelegram();
    const response = await worker.fetch(
        makeRequest(validPayload(), { origin: 'https://evil.example' }),
        makeEnv()
    );
    assert.equal(response.status, 403);
    assert.equal(telegramCalls.length, 0);
});

test('rejects non-POST methods with 405', async () => {
    mockTelegram();
    for (const method of ['GET', 'PUT', 'DELETE']) {
        const response = await worker.fetch(
            makeRequest(validPayload(), { method, origin: null }),
            makeEnv()
        );
        assert.equal(response.status, 405);
    }
});

test('answers CORS preflight with allowed origin', async () => {
    const response = await worker.fetch(
        makeRequest(null, { method: 'OPTIONS' }),
        makeEnv()
    );
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), ALLOWED_ORIGIN);
    assert.match(response.headers.get('Access-Control-Allow-Methods'), /POST/);
});

test('rejects oversized payloads with 413', async () => {
    mockTelegram();
    const huge = validPayload({
        project_description: 'a'.repeat(17000)
    });
    const response = await worker.fetch(makeRequest(huge), makeEnv());
    assert.equal(response.status, 413);
    assert.equal(telegramCalls.length, 0);
});

test('rejects malformed JSON with 400', async () => {
    mockTelegram();
    const response = await worker.fetch(makeRequest(null, { rawBody: '{not json' }), makeEnv());
    assert.equal(response.status, 400);
});

test('rejects short descriptions', async () => {
    mockTelegram();
    const payload = validPayload({ project_description: 'too short' });
    const response = await worker.fetch(makeRequest(payload), makeEnv());
    assert.equal(response.status, 400);
});

test('rejects invalid telegram usernames', async () => {
    mockTelegram();
    const cases = ['@', 'abc', '1startdigit', 'has space', 'x'.repeat(40)];
    for (const username of cases) {
        const response = await worker.fetch(
            makeRequest(validPayload({ telegram_username: username })),
            makeEnv()
        );
        assert.equal(response.status, 400, `expected rejection for ${username}`);
    }
});

test('rejects more than five reference links and non-http schemes', async () => {
    mockTelegram();
    const sixLinks = [
        'https://a.example',
        'https://b.example',
        'https://c.example',
        'https://d.example',
        'https://e.example',
        'https://f.example'
    ];
    let response = await worker.fetch(
        makeRequest(validPayload({ reference_links: sixLinks })),
        makeEnv()
    );
    assert.equal(response.status, 400);

    response = await worker.fetch(
        makeRequest(validPayload({ reference_links: ['ftp://files.example'] })),
        makeEnv()
    );
    assert.equal(response.status, 400);
});

test('rejects filled honeypot fields', async () => {
    mockTelegram();
    const response = await worker.fetch(
        makeRequest(validPayload({ website: 'http://spam.example' })),
        makeEnv()
    );
    assert.equal(response.status, 400);
    assert.equal(telegramCalls.length, 0);
});

test('rejects unknown or missing fields and unchecked acknowledgements', async () => {
    mockTelegram();

    let response = await worker.fetch(
        makeRequest(validPayload({ email: 'someone@example.com' })),
        makeEnv()
    );
    assert.equal(response.status, 400);

    response = await worker.fetch(
        makeRequest(validPayload({ accepted_terms: false })),
        makeEnv()
    );
    assert.equal(response.status, 400);

    const { understands_request, ...missingAck } = validPayload();
    response = await worker.fetch(makeRequest(missingAck), makeEnv());
    assert.equal(response.status, 400);

    response = await worker.fetch(makeRequest([validPayload()]), makeEnv());
    assert.equal(response.status, 400);
});

test('returns 502 when Telegram delivery fails', async () => {
    mockTelegram(() => new Response(JSON.stringify({ ok: false }), { status: 500 }));
    const response = await worker.fetch(makeRequest(validPayload()), makeEnv());
    assert.equal(response.status, 502);
});

test('includes optional fields only when provided', () => {
    const minimal = buildTelegramMessage(
        validateSubmission(validPayload()).value
    );
    assert.ok(!minimal.includes('Preferred deadline'));
    assert.ok(!minimal.includes('Reference links'));

    const full = buildTelegramMessage(
        validateSubmission(
            validPayload({
                preferred_deadline: 'within two weeks',
                reference_links: ['https://example.com/ref']
            })
        ).value
    );
    assert.match(full, /Preferred deadline: within two weeks/);
    assert.match(full, /Reference links:\n- https:\/\/example\.com\/ref/);
});

test('escapes HTML in user-provided content', () => {
    const message = buildTelegramMessage(
        validateSubmission(
            validPayload({
                telegram_username: 'safe_name',
                project_description:
                    'Please build a thing <script>alert("x")</script> & thank you.'
            })
        ).value
    );
    assert.ok(!message.includes('<script>'));
    assert.ok(message.includes('&lt;script&gt;'));
    assert.ok(message.includes('&amp;'));
});

test('formats the submission timestamp in Europe/Berlin', () => {
    const message = buildTelegramMessage(validateSubmission(validPayload()).value);
    assert.match(message, /Submitted: .+ \(Europe\/Berlin\)/);
});

test('rate limits repeated submissions from the same IP without a binding', async () => {
    mockTelegram();
    const env = makeEnv();
    const ip = '203.0.113.77';

    let lastResponse;
    for (let i = 0; i < 6; i++) {
        lastResponse = await worker.fetch(makeRequest(validPayload(), { ip }), env);
        if (i < 5) {
            assert.equal(lastResponse.status, 200);
        }
    }
    assert.equal(lastResponse.status, 429);
});

test('fails closed when the configured rate limiter is unavailable', async () => {
    mockTelegram();
    const response = await worker.fetch(
        makeRequest(validPayload()),
        makeEnv({
            RATE_LIMITER: {
                async limit() {
                    throw new Error('rate limiter unavailable');
                }
            }
        })
    );

    assert.equal(response.status, 503);
    assert.equal(telegramCalls.length, 0);
});
