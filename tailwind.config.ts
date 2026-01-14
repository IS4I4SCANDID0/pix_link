/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      screens: {
        'xs': '384px',
        '3xl': '1925px',
        '4xl': '2560px',
      },
    },
  },
}
