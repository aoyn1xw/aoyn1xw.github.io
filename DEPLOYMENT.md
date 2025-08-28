# Deployment Guide

This document provides instructions for deploying your portfolio website to GitHub Pages.

## Building for Production

To build the project for production, run:

```bash
npm run build
```

This will create a `dist` folder with all the optimized static files.

## Deploying to GitHub Pages

### Method 1: Using GitHub Actions (Recommended)

1. Push your code to your GitHub repository (make sure it's named `username.github.io` for a user site)

2. Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master  # or main, depending on your default branch name

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: dist  # The folder the action should deploy
```

3. Push this workflow file to your repository, and GitHub Actions will automatically build and deploy your site.

### Method 2: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Install the `gh-pages` package if you haven't already:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add a deploy script to your `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

4. Deploy your site:
   ```bash
   npm run deploy
   ```

## Custom Domain (Optional)

If you want to use a custom domain:

1. Create a `CNAME` file in the `public` folder with your domain:
   ```
   yourdomainname.com
   ```

2. Configure your domain's DNS settings to point to GitHub Pages.

## Troubleshooting

- If your site is not displaying correctly, make sure your `vite.config.ts` file has the correct base path:
  ```typescript
  export default defineConfig({
    base: '/',  // Change to '/repository-name/' if not using a custom domain
    // ... other config
  });
  ```

- Check the GitHub Pages section in your repository's Settings to ensure it's configured correctly.
