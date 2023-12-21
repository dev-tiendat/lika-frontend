/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: "#74B9FF",
      secondary: "#feca57",
      textSecond: "#8395A7",
      blackOne: "#1e272e",
      white: "#ffffff",
      admin: "#6a89cc",
      teacher: "#b8e994",
      student: "#fad390",
      levelEasy: "#ff7979",
      levelMedium: "#00d2d3",
      levelHard: "#8395a7",
      error: "#FF3333"
    },
    backgroundImage: {
      'login-bg': "url(./src/assets/images/login_bg.svg)"
    }
  },
  plugins: [],
};
