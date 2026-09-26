/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "rgb(var(--c-navy-50) / <alpha-value>)",
          100: "rgb(var(--c-navy-100) / <alpha-value>)",
          200: "rgb(var(--c-navy-200) / <alpha-value>)",
          300: "rgb(var(--c-navy-300) / <alpha-value>)",
          400: "rgb(var(--c-navy-400) / <alpha-value>)",
          500: "rgb(var(--c-navy-500) / <alpha-value>)",
          600: "rgb(var(--c-navy-600) / <alpha-value>)",
          700: "rgb(var(--c-navy-700) / <alpha-value>)",
          800: "rgb(var(--c-navy-800) / <alpha-value>)",
          900: "rgb(var(--c-navy-900) / <alpha-value>)",
          950: "rgb(var(--c-navy-950) / <alpha-value>)",
        },
        gold: {
          50: "rgb(var(--c-gold-50) / <alpha-value>)",
          100: "rgb(var(--c-gold-100) / <alpha-value>)",
          200: "rgb(var(--c-gold-200) / <alpha-value>)",
          300: "rgb(var(--c-gold-300) / <alpha-value>)",
          400: "rgb(var(--c-gold-400) / <alpha-value>)",
          500: "rgb(var(--c-gold-500) / <alpha-value>)",
          600: "rgb(var(--c-gold-600) / <alpha-value>)",
          700: "rgb(var(--c-gold-700) / <alpha-value>)",
          800: "rgb(var(--c-gold-800) / <alpha-value>)",
          900: "rgb(var(--c-gold-900) / <alpha-value>)",
        },
        sand: {
          50: "rgb(var(--c-sand-50) / <alpha-value>)",
          100: "rgb(var(--c-sand-100) / <alpha-value>)",
          200: "rgb(var(--c-sand-200) / <alpha-value>)",
        },
        slate2: {
          page: "rgb(var(--c-slate2-page) / <alpha-value>)",
          soft: "rgb(var(--c-slate2-soft) / <alpha-value>)",
          sunk: "rgb(var(--c-slate2-sunk) / <alpha-value>)",
          line: "rgb(var(--c-slate2-line) / <alpha-value>)",
          line2: "rgb(var(--c-slate2-line2) / <alpha-value>)",
          mut: "rgb(var(--c-slate2-mut) / <alpha-value>)",
          dim: "rgb(var(--c-slate2-dim) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Inter"', "system-ui", "sans-serif"],
        // The A2 direction is editorial: an expressive serif carries the
        // headings, and its italic is part of the voice, not decoration.
        display: ['"Libre Baskerville"', "Georgia", '"Times New Roman"', "serif"],
        serif: ['"Libre Baskerville"', "Georgia", '"Times New Roman"', "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,36,0.05), 0 6px 18px rgba(11,18,36,0.06)",
        lift: "0 10px 34px rgba(11,18,36,0.13)",
        pop: "0 24px 60px rgba(11,18,36,0.18)",
        gold: "0 8px 24px -10px rgba(200,149,44,0.55)",
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      maxWidth: {
        app: "30rem", // ~480px mobile-first shell
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-drift": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%,-3%,0) scale(1.08)" },
        },
        "ring-draw": {
          "0%": { strokeDashoffset: "var(--ring-circumference)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "glow-drift": "glow-drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
