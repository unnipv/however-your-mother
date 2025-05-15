/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vintage color palette
        sepia: {
          50: '#FCF9F1',
          100: '#F8F1DE',
          200: '#F1E3BE',
          300: '#E9D59E',
          400: '#E2C77E',
          500: '#DBB95E',
          600: '#D4AB3E',
          700: '#BE932A',
          800: '#987624',
          900: '#72591D',
        },
        vintage: {
          red: '#C94141',
          green: '#4E6E5D',
          blue: '#4A6FA5',
          yellow: '#E4B363',
          brown: '#8C5E58',
          teal: '#5B8C85',
        },
        paper: '#F7F2E9',
        ink: '#2C2C2C',
      },
      fontFamily: {
        'vintage': ['Georgia', 'Times New Roman', 'serif'],
        'typewriter': ['Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        'vintage': '2px 2px 0px rgba(0, 0, 0, 0.1)',
        'vintage-lg': '4px 4px 0px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'noise': "url('/images/noise.png')",
        'old-paper': "url('/images/old-paper.png')",
      },
    },
  },
  plugins: [],
} 