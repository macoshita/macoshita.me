const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{tsx,css}", "./components/**/*.{tsx,css}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    colors: {
      lime: colors.lime,
      warmGray: colors.warmGray,
      emerald: colors.emerald,
      primary: "var(--color-primary)",
      "primary-variant": "var(--color-primary-variant)",
      secondary: "var(--color-secondary)",
      "secondary-variant": "var(--color-secondary-variant)",
      background: "var(--color-background)",
      surface: "var(--color-surface)",
      "on-primary": "var(--color-on-primary)",
      "on-secondary": "var(--color-on-secondary)",
      "on-background": "var(--color-on-background)",
      "on-surface": "var(--color-on-surface)",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
