/* eslint-disable */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Anonymous Pro', ...defaultTheme.fontFamily.mono],
        body: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: '480px',
      },
      colors: {
        gray: colors.neutral,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
