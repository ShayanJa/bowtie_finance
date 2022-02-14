const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontWeight: ['hover', 'focus'],
      fontFamily: {
        display: ["Poppins", "Poppins"],
        body: ["Poppins", "Poppins"],
      },
    },
  },
  variants: {},
  plugins: []
};
