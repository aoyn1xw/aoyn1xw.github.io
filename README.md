# Erdi / ayon1xw

This is my website.

If you want the actual thing, just open it here:

https://aoyn1xw.github.io

## What is this?

Mostly a small portfolio / link hub for my projects, experiments, and whatever I am working on.

Nothing too deep. I just wanted one place that shows who I am, what I build, and where to find my stuff.

## What it uses

- HTML
- CSS
- JavaScript
- Vite
- GitHub Pages
- GitHub API for the project cards

## Notes

This site is still changing whenever I feel like improving it.

Right now the goal is simple: make it look like me, show my projects, and not overcomplicate it.
## Commission request endpoint

The commission form posts JSON to the Cloudflare Worker in `worker/`. Update the public Worker URL in `commission-config.js` after deployment.

1. Run `cd worker && npm install`.
2. Set secrets with `npx wrangler secret put TELEGRAM_BOT_TOKEN` and `npx wrangler secret put TELEGRAM_CHAT_ID`.
3. Keep `ALLOWED_ORIGIN` set to the production portfolio origin in `worker/wrangler.toml`.
4. Configure a Cloudflare Rate Limiting binding named `RATE_LIMITER` for production, then run `npm run deploy`.

The endpoint validates an exact field allowlist, suppresses honeypot submissions, forwards plain text to Telegram, and returns only an opaque request reference. Never put Telegram credentials in frontend files or commit them.
