# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. This project showcases a clean and professional design using Tailwind CSS and Radix UI components.

## Features

- **Modern Stack**: Built with React 19, TypeScript, and Vite for fast development and optimal performance
- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Dark Mode Support**: Theme switching capability with next-themes
- **UI Components**: Comprehensive set of accessible UI components powered by Radix UI
- **Animations**: Smooth animations using Framer Motion and Tailwind CSS animations
- **Form Handling**: Form validation and management with React Hook Form and Zod
- **Type-Safe**: Full TypeScript support for enhanced developer experience

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Routing**: Wouter
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aoyn1xw/aoyn1xw.github.io.git
cd aoyn1xw.github.io
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5000`

### Build

Build the project for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:
```bash
npm run check
```

## Project Structure

```
.
├── client/                 # Client-side code
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── layout/   # Layout components (Navbar, etc.)
│   │   │   ├── sections/ # Page sections (Hero, Projects, About, Contact)
│   │   │   └── ui/       # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configurations
│   │   ├── pages/        # Page components
│   │   └── main.tsx      # Application entry point
│   └── index.html        # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## Deployment

This project is configured to automatically deploy to GitHub Pages whenever changes are pushed to the main branch.

### GitHub Actions Workflow

The deployment is handled by a GitHub Actions workflow that:
1. Builds the project
2. Deploys the built files to GitHub Pages

To enable GitHub Pages deployment:
1. Go to your repository Settings
2. Navigate to Pages
3. Under "Build and deployment", select "GitHub Actions" as the source

The site will be available at `https://aoyn1xw.github.io/`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- UI components from [Radix UI](https://www.radix-ui.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)
