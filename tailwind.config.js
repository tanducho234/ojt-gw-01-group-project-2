export const content = [
  "./src/components/**/*.jsx", // Ensure this is correct for your project
  "./src/pages/**/*.jsx",
  "./src/pages/products/*.jsx",
];
export const theme = {
  extend: {
    mode: "jit",
    colors: {
      transparent: "transparent",
      current: "currentColor",
      green: "#38a169",
      red: "#e53e3e",
      yellow: "#ecc94b",
      orange: "#f6ad55",
      blue: "#3182ce",
      purple: "#805ad5",
      pink: "#d53f8c",
      white: "#ffffff",
      black: "#000000",
      brown: "#8b4513",
      gray: "#718096",
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
};
export const plugins = [];
