const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  mode: 'jit',
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      primary: '#2565EC',
      background: '#1B1A1F',
      secondary: '#27292B',
      border: '#404040',
      lightText: '#AEB0B4',
      ...colors,
    },
    extend: {},
  },
  plugins: [],
};
