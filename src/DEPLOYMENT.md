# Deployment Checklist

## Before Deploying

### 1. Clean up duplicate files
```bash
# Remove duplicate src directory if it exists
rm -rf src/

# Ensure main files are in root:
# - App.tsx
# - main.tsx
# - index.html
```

### 2. Install dependencies
```bash
npm install
```

### 3. Test locally
```bash
# Development mode
npm run dev

# Production build test
npm run build
npm run preview
```

### 4. Fix common issues

#### TypeScript errors:
```bash
npm run type-check
```

#### Linting errors:
```bash
npm run lint
```

#### Build errors:
- Check that all imports are correct
- Ensure no missing dependencies
- Verify file paths match actual structure

### 5. Environment Setup

#### For Vercel:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

#### For Netlify:
- Build Command: `npm run build`  
- Publish Directory: `dist`
- Node Version: 18.x

#### For GitHub Pages:
```bash
npm run build
npx gh-pages -d dist
```

## Common Deployment Errors

### 1. Import/Module Errors
- Check all import paths are correct
- Ensure components exist where imported
- Verify case sensitivity in file names

### 2. Build Failures
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure all dependencies are installed

### 3. Styling Issues
- Verify Tailwind CSS is properly configured
- Check PostCSS configuration
- Ensure global CSS is imported in main.tsx

### 4. GitHub API Issues
- API calls work fine in development
- No API keys needed for public repos
- Consider rate limiting in production

## File Structure Check

Your project should look like this:
```
portfolio-website/
├── components/
├── hooks/
├── services/
├── styles/
├── App.tsx          # Main app component
├── main.tsx         # Entry point  
├── index.html       # HTML template
├── package.json     # Dependencies
├── vite.config.ts   # Build config
├── tailwind.config.js
└── tsconfig.json
```

## Quick Fixes

### Clear build cache:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Reset git if needed:
```bash
git add .
git commit -m "Fix deployment configuration"
git push origin main
```