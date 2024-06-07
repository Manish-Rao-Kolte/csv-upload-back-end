/** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/views/*.ejs"],
   theme: {
      extend: {},
   },
   plugins: [require("@tailwindcss/forms")],
};
