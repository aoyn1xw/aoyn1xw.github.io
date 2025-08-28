# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features real-time integration with the GitHub API to showcase repositories, languages, and profile information.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect it's a Vite project
4. Deploy with default settings

### Netlify
1. Push your code to GitHub
2. Connect your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Motion** for animations
- **Vite** for build tooling
- **GitHub API** for dynamic content

## 🔧 Configuration

Update the GitHub username in `/services/github.ts`:
```typescript
const GITHUB_USERNAME = 'your-username';
```

## 📁 Project Structure

```
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API services
├── styles/             # Global styles
├── main.tsx            # Application entry point
└── App.tsx             # Main app component
```

## 🌐 Features

- Dynamic GitHub API integration
- Responsive design
- Dark/light mode
- Smooth animations
- SEO optimized
- Performance optimized

Built with ❤️ by aoyn1xw