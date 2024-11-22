import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.jsx",
    "./src/pages/**/*.jsx",
    "./src/**/*.{html,js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        "scroll-up": "scrollUp 16s linear infinite",
        "scroll-down": "scrollDown 16s linear infinite",
      },
      keyframes: {
        scrollUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        scrollDown: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        fontFamily: {
          roboto: ["Roboto", "sans-serif"],
          poppins: ["Poppins", "sans-serif"],
        },
      },
    },
  },
  plugins: [forms],
};
