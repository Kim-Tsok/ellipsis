/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand teal
        teal: {
          400: '#4FA1AF', // brand
          500: '#4FA1AF',
          600: '#3F828C', // dark shade (filled-button hover)
          300: '#8FC9D1', // light tint (hover/active backgrounds)
        },
        ink: '#1A1A1A', // near-black text
        paper: '#FFFFFF', // main background
        mist: '#F5F5F5', // card/panel background, one step off paper
        line: '#E0E0E0', // hairline borders
      },
      fontFamily: {
        // Instrument Serif
        instrument: ['Instrument Serif', 'serif'],
        // Crimson Text
        crimson: ['Crimson Text', 'serif'],
        // Space Grotesk (adopted as the sans-serif for UI chrome)
        space: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
