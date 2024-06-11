import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
      {
            originalname: {
                  type: String,
                  required: true,
            },
            mimetype: {
                  type: String,
            },
            filename: {
                  type: String,
            },
            url: {
                  type: String,
                  required: true,
            },
      },
      { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);
