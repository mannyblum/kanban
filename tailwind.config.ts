module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  variants: {
    extend: {
      pointerEvents: ["hover", "focus"],
    },
  },
};
