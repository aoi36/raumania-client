/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

module.exports = {
    darkMode: ['class'],
    content: {
    files:[
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ], 
    extract
  },
  theme: {
    screens,
    fontSize,
    extend: {
      
      fontFamily: {
        'cormorant': ['var(--font-cormorant-garamond)'],
        'dancing': ['var(--font-dancing-script)'],
        sans: ['var(--font-cormorant-garamond)'],
        mono: ['var(--font-dancing-script)'],
      },
      colors: {
        "brand-blue": "#4876ff",
        "brand-lime": "#d9f154",
        "brand-navy": "#2e3192",
        "brand-orange": "#ff7347",
        "brand-pink": "#f7d0e9",
        "brand-purple": "#692e54",
        "brand-gray": "#fffdf9",
      },
      keyframes: {
        squiggle: {
          "0%": { filter: 'url("#squiggle-0")' },
          "25%": { filter: 'url("#squiggle-1")' },
          "50%": { filter: 'url("#squiggle-2")' },
          "75%": { filter: 'url("#squiggle-3")' },
          "100%": { filter: 'url("#squiggle-4")' },
        },
      },
      animation: {
        squiggle: "squiggle .5s infinite",
      },
    },
  },
  plugins: [
    fluid,
      require("tailwindcss-animate")
],
}