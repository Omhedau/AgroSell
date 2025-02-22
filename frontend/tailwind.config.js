/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./componets/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        "rubik": ['Rubik-Regular',"sans-serif"],
        "rubik-bold": ['Rubik-Bold',"sans-serif"],
        "rubik-medium": ['Rubik-Medium',"sans-serif"],
        "rubik-light": ['Rubik-Light',"sans-serif"],
        "rubik-semi-bold": ['Rubik-SemiBold',"sans-serif"],
        "rubik-extrabold": ['Rubik-ExtraBold',"sans-serif"],


      },
      colors:{
        "primary":{
          100: '#F7F7F7',
          200: '#E8F8E8',
          300: '#84EC84',
          400: '#32C338',
          500: '#2C7F30',
        },
        accent :{
          100: '#FBFBFD'
        },
        black :{
          DEFAULT: '#000000',
          100 :'#8C8E98',
          200 :'#666878',
          300 :'#191d31',
        },
        danger : '#F75555'

      },
     

    },
  },
  plugins: [],
}