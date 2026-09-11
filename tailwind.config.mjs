import typography from '@tailwindcss/typography';
// import animate from 'tailwindcss-animate';

const config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    // Lägg till fler sökvägar här om det behövs
  ],
  prefix: '', // Lägg till ett prefix här om du vill, t.ex. 'tw-'
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Här kan du utöka Tailwinds tema med egna värden
      // Exempel:
      // colors: {
      //   'brand-blue': '#007bff',
      // },
      // fontFamily: {
      //   heading: ['var(--font-heading)', 'sans-serif'],
      // },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Du kan lägga till fler keyframes här om du behöver
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Lägg till fler animationer här
      },
    },
  },
  plugins: [
    // animate, // För tailwindcss-animate
    typography, // För @tailwindcss/typography
    // Lägg till fler plugins här om det behövs
  ],
};

export default config;
