/** @type {import('tailwindcss').Config} */
export default {
      content: ["./src/views/*.ejs"],
      theme: {
            extend: {
                  boxShadow: {
                        c: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  },
                  fontFamily: {
                        poppins: ["Poppins"],
                  },
            },
      },
      plugins: [require("@tailwindcss/forms")],
};
