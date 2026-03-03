export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeEffect: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        marquee: "marquee 12s linear infinite",
        fade: "fadeEffect 0.3s ease-in-out",
      },
    },
  },

  plugins: [require("tailwind-scrollbar-hide")],
};