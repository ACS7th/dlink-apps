// tailwind.config.js

const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            focus: "#f1cdd1",
            primary: {
              50:  "#fcecef",
              100: "#f8d8df",
              200: "#ecb1bf",
              300: "#df8a9f",
              400: "#d3647f",
              500: "#c83d5f",
              600: "#a63052",
              700: "#7f243f",
              800: "#59182c",
              900: "#2e0c17",
              // 메인(Default) 색상
              DEFAULT: "#900020",
              // 주 텍스트/아이콘에 사용할 전경색
              foreground: "#ffffff",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50:  "#fcecef",
              100: "#f8d8df",
              200: "#ecb1bf",
              300: "#df8a9f",
              400: "#d3647f",
              500: "#c83d5f",
              600: "#a63052",
              700: "#7f243f",
              800: "#59182c",
              900: "#2e0c17",
              DEFAULT: "#900020",
              foreground: "#ffffff",
            },
            background: "#202020",
          },
        },
      },
    }),
  ],
};
