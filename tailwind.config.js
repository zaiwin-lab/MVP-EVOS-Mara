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
        // Warm neutral / beige
        sand: {
          50: "#faf8f4",
          100: "#f3eee4",
          200: "#e7ddca",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Manrope"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,20,40,0.04), 0 8px 24px -12px rgba(10,20,40,0.18)",
        lift: "0 12px 40px -12px rgba(10,20,40,0.28)",
        gold: "0 8px 24px -10px rgba(200,149,44,0.55)",
      },
      borderRadius: {
        xl: "0.9rem",
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
        "ring-draw": {
          "0%": { strokeDashoffset: "var(--ring-circumference)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
