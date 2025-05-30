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
        'herobg': "url('/assets/herobg.jpg')",
        'cardbg': "url('/assets/card.png')",
        'offer2': "url('/assets/offer2.png')",
        'offer3': "url('/assets/offer3.jpg')",
        'package': "url('/assets/package.png')",
        'pricingbg': "url('/assets/pricingbg.png')",
        'contactbg': "url('/assets/contactbg.png')",
        'dealbg': "url('/assets/dealbg.png')",
        'deal1bg': "url('/assets/deal1.png')",
       
      },
     
      colors: {
        'white':"#fff",
        'blackish':"#101010"
      
      },
    },
  },
  plugins: [],
};
