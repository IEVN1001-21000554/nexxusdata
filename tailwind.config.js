/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#1D4ED8',
          600: '#1E40AF',
        },
        green: {
          500: '#10B981',
          600: '#047857',
        },
      },
    },
  },
  
  plugins: [],
}

