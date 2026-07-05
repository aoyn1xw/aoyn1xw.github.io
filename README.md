# Portfolio — Erdi / ayon1xw

A dark, cinematic, minimal portfolio site showcasing projects and experiments.

## Overview

This is a static single-page portfolio built for GitHub Pages. It features:
- Dark, high-contrast design with cyan accent
- Live GitHub API integration for project data
- Responsive layout (mobile + desktop)
- Smooth animations and transitions
- Premium typography and spacing

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox
- **Vanilla JavaScript** — GitHub API integration, no frameworks
- **Vite** — Build tool for development and production
- **GitHub Actions** — Automated deployment to GitHub Pages

## Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment workflow
├── assets/
│   ├── cursor/
│   │   └── cursor.png       # Custom cursor image
│   ├── fonts/
│   │   └── ndot-57-aligned.ttf  # Custom display font
│   └── video/
│       └── background.mp4   # Hero background video
├── index.html               # Main page structure
├── styles.css               # All styling and design system
├── script.js                # GitHub API logic and interactions
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Features

### Hero Section
- Full-screen cinematic video background
- Large name/handle display with custom typography
- Short intro
- Call-to-action buttons
- Custom cursor throughout the site

### Featured Projects
- Pulls live data from GitHub REST API
- Displays: stars, forks, issues, contributors
- Editorial-style cards with hover effects
- Fallback data if API fails

### About / What I Build
- Brief overview of work areas
- Clean, personal copy

### Current Focus
- Shows current projects or areas of exploration
- Simple card layout

### Contact / Links
- GitHub, Twitter, and other links
- Minimal, accessible design

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server includes hot module replacement for instant updates.

## Deployment

This site automatically deploys to **GitHub Pages** via GitHub Actions.

### Automatic Deployment (Recommended)

1. **First-time setup:**
   - Go to your repository settings on GitHub
   - Navigate to **Settings → Pages**
   - Under "Build and deployment", set **Source** to "GitHub Actions"

2. **Deploy:**
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Site will be live at `https://aoyn1xw.github.io`

3. **Monitor deployment:**
   - Check the **Actions** tab in your GitHub repo
   - You'll see the deployment workflow running
   - Once complete, your site is live

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the site
npm run build

# The dist/ folder contains your production site
# You can deploy this folder to any static host
```

### Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- Can also be manually triggered from GitHub Actions tab
- Builds the site with Vite
- Deploys to GitHub Pages
- Takes ~1-2 minutes to complete

## API Rate Limits

The GitHub API allows 60 requests/hour for unauthenticated users. If the rate limit is hit, the site falls back to hardcoded data so it always renders.

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
--accent: #00d9ff;
--bg-primary: #0a0a0a;
```

### Featured Projects
Edit the array in `script.js`:
```javascript
const FEATURED_REPOS = [
    'aoyn1xw/swift-devcontainer',
    'aoyn1xw/ipa-signer',
    'aoyn1xw/Untis-watcher'
];
```

### Copy
All text is in `index.html` — edit directly.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT — use this however you want.

---

Built by Erdi with Claude Code.
