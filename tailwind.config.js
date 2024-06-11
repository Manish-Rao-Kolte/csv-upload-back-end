/** @type {import('tailwindcss').Config} */
export default {
      content: ["./src/views/*.ejs"],
      theme: {
            extend: {
                  boxShadow: {
                        c: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        d: "rgba(99, 102, 241, 0.54) 0px 3px 8px, rgba(99, 102, 241, 0.44) 0px 3px 6px",
                  },
                  fontFamily: {
                        poppins: ["Poppins"],
                  },
            },
      },
      plugins: [require("@tailwindcss/forms")],
};
