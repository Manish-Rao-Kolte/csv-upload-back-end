import mongoose from "mongoose";

const dbName = "csv-upload";
const connectDB = async () => {
   try {
      const connectionInstance = await mongoose.connect(
         `${process.env.MONGODB_URI}?dbName=${dbName}`
      );
      console.log(`Host : ${connectionInstance.connection.host}`);
      return connectionInstance;
   } catch (error) {
      console.log("DB connection failure: ", error);
      process.exit(1);
   }
};

export { connectDB };
