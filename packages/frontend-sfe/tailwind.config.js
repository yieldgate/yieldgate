/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
// @ts-check

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
        primary: colors.sky,
        secondary: colors.amber,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
