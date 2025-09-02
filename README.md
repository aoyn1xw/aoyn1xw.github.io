 # aoyn1xw.github.io

A simple personal "About Me" static site built with HTML, CSS and vanilla JavaScript.

Live site: https://ayon1xw.me/

## What this repo contains
- `index.html` — main page markup
- `style.css` — site styles (visuals, animations, and timing tokens)
- `script.js` — client-side logic (small UI interactions, GitHub API fallbacks)
- `assets/` — logos and images used by the site

## Quick preview (local)
Open the `index.html` file in your browser, or run a minimal HTTP server for a closer to-production preview:

PowerShell / Terminal:
```
python -m http.server 8000
# then open http://localhost:8000
```

## Key development notes
- Animation/timing tokens live in `style.css` under `:root` (variables named `--t-fast`, `--t-medium`, `--t-slow` and `--ease`). Tweak these to change hover/transition speeds globally.
- GitHub username used for API calls is set in `script.js` via the `GITHUB_USERNAME` constant. Update it if you change accounts.
- Progress bars and other UI pieces use small JS helpers in `script.js` — caching is implemented using localStorage with a 5 minute TTL.

## Performance tips
- Avoid animating layout properties; `style.css` was updated to prefer `transform`/`opacity` transitions.
- If you need to further improve low-end device performance, consider reducing `backdrop-filter`, box-shadows, or disabling background animations in `style.css`.

## Deploying to GitHub Pages
1. Push this repo to a GitHub repository named `aoyn1xw.github.io` (already named correctly).
2. Pages will automatically serve from the `main` branch at `https://<username>.github.io`.

## License
This project is licensed under GPLv3.

---
If you want, I can add a `prefers-reduced-motion` media rule, tune the timing tokens, or add a small dev script to spin up the preview server — tell me which and I’ll update the repo.


![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)

