# Commission Worker

Cloudflare Worker that receives commission form submissions from
`aoyn1xw.github.io` and forwards them as a notification to a private Telegram
chat. Nothing is stored: no database, no logs of submissions.

## Setup

### 1. Create the Telegram bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram.
2. Send `/newbot`, follow the prompts.
3. Copy the bot token (looks like `123456789:AA...`). Keep it private.

### 2. Get your chat ID

1. Start a chat with your new bot (send it any message).
2. Open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser.
3. Find `"chat":{"id":123456789,...}` in the response. That number is your chat ID.

For a private chat the ID is your own user ID, so only you receive submissions.

### 3. Configure secrets

Never put these values in `wrangler.toml`, `.dev.vars` in Git, or any file that
gets committed.

```bash
cd worker
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

For local development:

```bash
cp .dev.vars.example .dev.vars
# then edit .dev.vars with your real token and chat ID
```

`.dev.vars` is git-ignored.

### 4. Deploy

```bash
npx wrangler deploy
```

Wrangler prints the deployed URL, e.g.
`https://portfolio-commissions.<your-subdomain>.workers.dev`.

### 5. Point the website at the worker

Edit `config.js` in the repository root and replace
`YOUR_SUBDOMAIN` with your real workers.dev subdomain:

```js
export const COMMISSION_ENDPOINT = 'https://portfolio-commissions.YOUR_SUBDOMAIN.workers.dev/';
```

The production origin `https://aoyn1xw.github.io` is already allowed via
`ALLOWED_ORIGINS` in `wrangler.toml`. Local dev origins (`localhost:3000`,
`127.0.0.1:3000`) are included too; adjust that list if needed and redeploy.

## Local development

```bash
npx wrangler dev
npm run dev   # from the repository root, in a second terminal
```

Requests from `http://localhost:3000` are allowed by default.

## Rate limiting

Two modes:

1. **Fallback (default):** a small per-isolate limiter in the worker itself
   (~5 requests per IP per minute). Best effort only — Cloudflare may run many
   isolates, so it is not a hard guarantee.
2. **Recommended:** Cloudflare's rate limiting binding. Uncomment the
   `[[unsafe.bindings]]` block in `wrangler.toml` and redeploy. If the binding
   requires enabling for your account, do it in the Cloudflare dashboard under
   **Workers & Pages → your worker → Settings → Bindings** (or account-level
   Rate limiting). No database is used in either mode.

No CAPTCHA is used in v1. An invisible honeypot field plus rate limiting cover
basic bot traffic.

## Tests

```bash
npm test
```

Runs the Node test suite in `worker/test/` with mocked Telegram responses, so
no real credentials are needed.

## Security notes

- Secrets live only in Wrangler secrets (or `.dev.vars`, which is git-ignored).
- User content is HTML-escaped before being sent to Telegram.
- CORS is restricted to `ALLOWED_ORIGINS`; everything else gets a 403.
- Only `POST` (plus CORS preflight) is accepted; bodies over 16 KB are rejected.
- All fields are re-validated server-side; frontend validation is never trusted.
- Error responses are generic codes — no internal details are leaked.
