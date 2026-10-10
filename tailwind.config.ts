import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["DM Sans", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["DM Serif Display", "Georgia", "Times New Roman", "serif"],
        mono:    ["DM Mono", "Fira Code", "Menlo", "Monaco", "monospace"],
      },
      colors: {
        ivory: {
          DEFAULT: "#FAF6ED",
          dk:      "#EFE6D2",
          deep:    "#E7DCC0",
        },
        gold: {
          DEFAULT: "#C9A44A",
          dk:      "#A07E2E",
          lt:      "#E2C37C",
          pale:    "#F7EDD2",
        },
        navy: {
          DEFAULT: "#0F2040",
          md:      "#1E3358",
          lt:      "#5B6B8C",
        },
        coral: { DEFAULT: "#e8714a", lt: "#f4a98a", pale: "#fce8e0" },
        // shadcn HSL vars
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card:        { DEFAULT: "hsl(var(--card))",    foreground: "hsl(var(--card-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary:     { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))",   foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))",  foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
      },
      borderRadius: {
        sm:    "calc(var(--radius) - 4px)",
        md:    "calc(var(--radius) - 2px)",
        lg:    "var(--radius)",
        xl:    "0.875rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        sm:   "0 1px 4px rgba(15,32,64,.05), 0 2px 8px rgba(15,32,64,.04)",
        md:   "0 4px 16px rgba(15,32,64,.08), 0 8px 24px rgba(15,32,64,.05)",
        lg:   "0 8px 32px rgba(15,32,64,.10), 0 16px 48px rgba(15,32,64,.06)",
        glow: "0 0 0 3px rgba(201,164,74,.18), 0 4px 16px rgba(201,164,74,.22)",
      },
      keyframes: {
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        ticker:    { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        fadeUp:    { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        floatBlob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(20px,-15px) scale(1.04)" },
          "66%":     { transform: "translate(-10px,12px) scale(.97)" },
        },
        pulseLine: { "0%,100%": { opacity: ".4" }, "50%": { opacity: "1" } },
        orbitSlow: {
          from: { transform: "rotate(0deg) translateX(var(--orbit-r)) rotate(0deg)" },
          to:   { transform: "rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg)" },
        },
      },
      animation: {
        shimmer:   "shimmer 2.4s linear infinite",
        ticker:    "ticker 24s linear infinite",
        fadeUp:    "fadeUp .5s ease both",
        floatBlob: "floatBlob 14s ease-in-out infinite",
        pulseLine: "pulseLine 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
