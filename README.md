# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features real-time integration with the GitHub API to showcase repositories, languages, and profile information.

## ✨ Features

- **Dynamic GitHub Integration**: Automatically pulls profile picture, repositories, and language statistics
- **Modern Design**: Clean, professional aesthetic with smooth animations
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme detection and manual toggle
- **Performance Optimized**: Built with Vite for fast development and production builds
- **Type Safe**: Full TypeScript implementation
- **Accessible**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **API Integration**: GitHub REST API
- **Build Tool**: Vite
- **UI Components**: Custom components + shadcn/ui

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aoyn1xw/portfolio-website.git
   cd portfolio-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── Hero.tsx         # Hero section with GitHub profile
│   ├── About.tsx        # About section with language stats
│   ├── Projects.tsx     # Projects from GitHub repos
│   ├── Contact.tsx      # Contact information
│   └── Navigation.tsx   # Navigation component
├── hooks/               # Custom React hooks
│   └── useGitHub.ts     # GitHub API integration hooks
├── services/            # API services
│   └── github.ts        # GitHub API service
├── styles/              # Global styles
│   └── globals.css      # Tailwind + custom CSS
└── App.tsx              # Main application component
```

## 🔧 Configuration

### GitHub API

The portfolio automatically fetches data from GitHub using the public API. To customize:

1. Update the username in `/services/github.ts`:
   ```typescript
   const GITHUB_USERNAME = 'your-username';
   ```

2. The app will automatically display:
   - Profile picture and bio
   - Repository list with languages and stats
   - Language statistics based on repositories

### Customization

- **Colors**: Update CSS variables in `/styles/globals.css`
- **Fonts**: Modify font imports and variables in `/styles/globals.css`
- **Content**: Edit component files to customize sections
- **Social Links**: Update links in `/components/Hero.tsx` and `/components/Contact.tsx`

## 🌐 Deployment

### GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

### Netlify

1. Build command: `npm run build`
2. Publish directory: `build`
3. (Optional) Add a `netlify.toml` (already included) to lock config.
4. If styles ever appear missing after config changes, trigger a Clear cache and deploy in Netlify UI.

### Vercel

Use `npm run build` (Vite will create `build/`) and set output directory to `build`.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- Email: hello@ayon1xw.me
- GitHub: [@aoyn1xw](https://github.com/aoyn1xw)
- Instagram: [@ayon1xw](https://instagram.com/ayon1xw)

---

Built with ❤️ by [aoyn1xw](https://github.com/aoyn1xw)