import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
      cloud_name: "dbbido0zq",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
      try {
            if (!filePath) {
                  return null;
            }
            const uploadedInstance = await cloudinary.uploader.upload(
                  filePath,
                  {
                        resource_type: "raw",
                  }
            );
            return uploadedInstance;
      } catch (error) {
            fs.unlinkSync(filePath); //removes temporary files stored via multer.
            return null;
      }
};

export { uploadOnCloudinary };
