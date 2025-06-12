module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.{js,css}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a202c",
        secondary: "#2d3748",
        accent: "#ed8936",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-up-100": "fade-in-up 0.6s ease-out 0.1s forwards",
        "fade-in-up-200": "fade-in-up 0.6s ease-out 0.2s forwards",
        "fade-in-up-300": "fade-in-up 0.6s ease-out 0.3s forwards",
        "fade-in-up-400": "fade-in-up 0.6s ease-out 0.4s forwards",
        "fade-in-right": "fade-in-right 0.6s ease-out forwards",
        "fade-in-left": "fade-in-left 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
