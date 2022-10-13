/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "origins-black": "rgb(1, 12, 24);",
        "origins-blue": "rgb(0, 109, 206);",
        "origins-light-orange": "rgb(255, 136, 0);",
        "origins-med-orange": "rgb(255, 66, 17);",
        "origins-dark-orange": "rgb(247, 59, 26);",
        "origins-darker-orange": "rgb(232, 14, 40);",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
};
