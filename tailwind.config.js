/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
      },
      borderRadius: {
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        'primary-foreground': "var(--color-primary-foreground)",
        secondary: "var(--color-secondary)",
        'secondary-foreground': "var(--color-secondary-foreground)",
        muted: "var(--color-muted)",
        'muted-foreground': "var(--color-muted-foreground)",
        accent: "var(--color-accent)",
        'accent-foreground': "var(--color-accent-foreground)",
        destructive: "var(--color-destructive)",
        'destructive-foreground': "var(--color-destructive-foreground)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
      },
    },
  },
  plugins: [],
}