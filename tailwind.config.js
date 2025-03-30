/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

module.exports = {
  content: {files:[
    './src/**/*.{js,ts,jsx,tsx,mdx}',

  ], extract
 
},
  theme: {
    screens,
    fontSize,
    extend: {
      colors: {
        "brand-blue": "#4876ff",
        "brand-lime": "#d9f154",
        "brand-navy": "#2e3192",
        "brand-orange": "#ff7347",
        "brand-pink": "#f7d0e9",
        "brand-purple": "#692e54",
        "brand-gray": "#fffdf9",
      },
    },
  },
  plugins: [
 
    fluid
  ],
}