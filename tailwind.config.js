/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.jsx", // Ensure this is correct for your project
    "./src/pages/**/*.jsx",
    "./src/pages/products/*.jsx",
  ],
  theme: {
    extend: {
      animation: {
        'scroll-up': 'scrollUp 16s linear infinite',
        'scroll-down': 'scrollDown 16s linear infinite',
      },
      keyframes: {
        scrollUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      spacing: {
        1: "8px",
        2: "12px",
        3: "16px",
        4: "24px",
        5: "32px",
        6: "48px",
        7: "68px",
        8: "90px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
