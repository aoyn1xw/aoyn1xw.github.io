# Deployment Guide

## Prerequisites

✅ GitHub repository: `aoyn1xw/aoyn1xw.github.io`  
✅ Node.js and npm installed locally  
✅ Git configured and authenticated

---

## GitHub Pages Setup (One-time)

### Step 1: Enable GitHub Actions for Pages

1. Go to your repository on GitHub: `https://github.com/aoyn1xw/aoyn1xw.github.io`
2. Click **Settings** (top right)
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**:
   - **Source**: Select **"GitHub Actions"** from the dropdown
   - (NOT "Deploy from a branch" — that's the old method)
5. Save

That's it! GitHub Pages is now configured to deploy via Actions.

---

## Deploying Your Site

### Automatic Deployment (Recommended)

Every time you push to the `main` branch, GitHub Actions will automatically:
1. Install dependencies
2. Build the site with Vite
3. Deploy to GitHub Pages

**To deploy:**
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

**Monitor the deployment:**
1. Go to the **Actions** tab on GitHub
2. You'll see a workflow run called "Deploy to GitHub Pages"
3. Click on it to see progress
4. Once complete (green checkmark), your site is live!

**Live URL:**  
`https://aoyn1xw.github.io`

---

## Manual Workflow Trigger

You can also manually trigger a deployment without pushing code:

1. Go to **Actions** tab on GitHub
2. Click "Deploy to GitHub Pages" in the left sidebar
3. Click "Run workflow" → "Run workflow"

This is useful for redeploying without making code changes.

---

## Local Testing Before Deploy

Always test locally before pushing:

```bash
# Start dev server
npm run dev

# Open http://localhost:3000 and test thoroughly

# Build for production
npm run build

# Preview the production build
npm run preview
```

If `npm run build` succeeds without errors, the GitHub Actions deployment will succeed too.

---

## Troubleshooting

### Build fails on GitHub Actions

1. Check the **Actions** tab for error logs
2. Common issues:
   - Missing dependencies → Make sure `package.json` is committed
   - Asset path errors → All paths should be relative (no absolute paths)
   - Large files → GitHub has a 100MB file limit

### Site not updating after push

1. Check **Actions** tab — is the workflow running?
2. Wait 1-2 minutes for the deployment to complete
3. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)
4. Clear browser cache if needed

### 404 Error on GitHub Pages

1. Make sure GitHub Pages is set to deploy from "GitHub Actions" (not a branch)
2. Check the workflow completed successfully
3. Verify the live URL is correct: `https://aoyn1xw.github.io`

### Video/Assets not loading

1. Check browser console for errors
2. Verify assets exist in the repo
3. Make sure paths in HTML/CSS are relative (e.g., `assets/video/background.mp4`)
4. Check that `.gitignore` is not excluding the assets folder

---

## Workflow File Location

The deployment configuration is in:
```
.github/workflows/deploy.yml
```

**Key settings:**
- **Trigger**: Pushes to `main` branch
- **Node version**: 20
- **Build command**: `npm run build`
- **Deploy source**: `./dist` folder

---

## Asset Optimization Tips

Current asset sizes:
- `background.mp4`: 6.3MB
- `cursor.png`: 174KB
- `ndot-57-aligned.ttf`: 70KB

**To optimize further:**
1. Compress the video (use HandBrake, FFmpeg, or online tools)
2. Convert cursor to a smaller format if needed
3. Use font subsetting to reduce font file size

---

## Deployment Checklist

Before pushing to production:

- [ ] Test locally with `npm run dev`
- [ ] Build succeeds with `npm run build`
- [ ] Preview production build with `npm run preview`
- [ ] All assets load correctly
- [ ] Video autoplays and loops
- [ ] Custom cursor appears
- [ ] Custom font loads
- [ ] GitHub API data loads (or fallback works)
- [ ] Responsive on mobile and desktop
- [ ] Links work (GitHub, Twitter, etc.)
- [ ] No console errors

---

## First Deployment Steps

**Ready to deploy for the first time?**

```bash
# 1. Commit all changes
git add .
git commit -m "feat: initial portfolio deployment with video background and custom assets"

# 2. Push to GitHub
git push origin main

# 3. Enable GitHub Pages (see Step 1 above)

# 4. Wait 1-2 minutes

# 5. Visit https://aoyn1xw.github.io
```

---

## Support

If you encounter issues:
1. Check GitHub Actions logs for error details
2. Review this guide's troubleshooting section
3. Verify all prerequisites are met
4. Make sure your repo is public (or you have GitHub Pages enabled for private repos)

---

Built by Erdi with Claude Code.
