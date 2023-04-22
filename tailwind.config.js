const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-poppins)', ...fontFamily.sans] },
      boxShadow: {
        'alt-lg': 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px',
      },
    },
  },
  plugins: [],
};
