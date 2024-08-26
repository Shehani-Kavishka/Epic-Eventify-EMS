module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        white: { A700: "#ffffff" },
        deep_purple: { 800: "#562494" },
        blue_gray: { 100: "#d9d9d9", 200: "#a0aec0" },
        amber: { 500: "#f6bd0f" },
        gray: { 50: "#f9fafb", 100: "#f7f7f7", 200: "#f4f1ee", 500: "#9f9292", "200_01": "#f3f0ee" },
        black: { 900: "#010101", "900_01": "#0c0c0b", "900_02": "#000000" },
        purple: { 900: "#401971" },
      },
      boxShadow: { xs: "0px 1px  2px 0px #0000000f" },
      fontFamily: { inter: "Inter", poppins: "Poppins" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
