import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/mongoose.config.js";

const port = process.env.PORT || 5000;

connectDB()
   .then(() => {
      app.on("error", (err) => {
         console.log("error", err);
      });
      app.listen(port, () => {
         console.log(`server is running on port : ${port}`);
      });
   })
   .catch((err) => {
      console.log(`Mongo DB connection failure: ${err}`);
   });
