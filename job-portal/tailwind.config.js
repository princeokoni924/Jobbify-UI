/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'orange_deep':"#E37434"
      }
    },
  },
  plugins: [
     require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

