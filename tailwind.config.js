/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep navy — primary brand
        navy: {
          50: "#eef2f9",
          100: "#d5deee",
          200: "#aabddc",
          300: "#7793c4",
          400: "#4d6aa6",
          500: "#33508c",
          600: "#274071",
          700: "#1e3160",
          800: "#152447",
          900: "#0e1a34",
          950: "#0a1428",
        },
        // Gold accent
        gold: {
          50: "#fbf7ec",
          100: "#f5eccf",
          200: "#ecd79c",
          300: "#e2c069",
          400: "#d9ad45",
          500: "#c8952c",
          600: "#a97622",
          700: "#87591f",
          800: "#704820",
          900: "#603d20",
        },
        // Cool neutral ground. Replaced the old warm beige when the site moved
        // to the Sales Portal layout: gold reads brighter and more modern
        // against a cool grey-blue page than against sand.
        sand: {
          50: "#F7F9FD",
          100: "#F1F4FA",
          200: "#E3E8F2",
        },
        // Page furniture — surfaces, hairlines and muted text.
        slate2: {
          page: "#F4F6FB",
          soft: "#FAFBFE",
          sunk: "#EDF1F8",
          line: "#E3E8F2",
          line2: "#CCD5E6",
          mut: "#55648A",
          dim: "#91A0BE",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Manrope"', "system-ui", "sans-serif"],
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
