/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // shadcn/ui の primary カラーを青系に例変更
        primary: {
          DEFAULT: "#1e90ff",
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
