/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'herobg': "url('/assets/herobg.png')",
        
       
      },
      colors: {
        'white':"#fff",
        'blackish':"#081028",
        'blackish2':"#0b1739",
        'lightgray':'#aab9ca',
        'gray1':'#e4f0ff'
      },
    },
  },
  plugins: [],
};
