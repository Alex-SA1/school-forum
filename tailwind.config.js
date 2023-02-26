/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        socialBg:'#D5C6B6',
        socialBlue: '#017075',
        cardColor: '#e89292',
        textColor: 'white',
        inputColor: '#017075',
        commentColor: '#017075',
        dropdownMenuColor: '#017075',
        buttonHoverColor: '#2F58CD',
        postColor: '#017075',
        likeColor: '#017075',
      },
    },
  },
  plugins: [],
}