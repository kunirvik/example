
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

    theme: {

       
        extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 12s linear infinite',
      },
    },
    },
    plugins: [],

    theme: {
  extend: {
    animation: {
      fade: "fadeEffect 0.3s ease-in-out",
    },
    keyframes: {
      fadeEffect: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
    },
  },
},
  };

  