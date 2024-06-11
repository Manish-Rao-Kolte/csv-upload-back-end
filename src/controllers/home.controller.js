import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { File } from "../models/file.model.js";
import fs from "fs";

const renderHome = asyncHandler(async (req, res) => {
    //fetch csv files list from databse.
    //show data in list on home page
    const filesList = await File.find().select("-updatedAt -createdAt");
    if (!filesList) {
        console.log("Unable to fetch data from database!");
        return new Error("Unable to fetch data from database!");
    }
    return res.status(200).render("home", {
        filesList,
        title: "Home",
    });
});

const storeCsvFiles = asyncHandler(async (req, res) => {
    //get data from client
    //check for data validation
    if (!req.files) {
        console.log("Error in getting stored data!");
    }
    for await (let data of req.files) {
        const { originalname, mimetype, filename, path } = data;
        if (!path || !originalname) {
            throw new Error("No file path or Name exist!");
        }
        if (mimetype !== "text/csv") {
            //deleting file from temp to clear storage and to protect code.
            fs.unlinkSync(path);
            throw new Error("Submit, required file type!");
        }
        //upload data on cloudinary to use third party service and to make code base scalable to be able to store large data like videos etc.
        const instance = await uploadOnCloudinary(path);
        if (!instance || instance?.name === "Error") {
            fs.unlinkSync(path); //deleting file from temp to clear storage and to protect code.
            console.log(`Error: ${instance.message}`);
            return res.status(400).redirect("back");
        }
        const fileObject = {
            originalname,
            mimetype,
            filename,
            url: instance.url,
            public_id: instance.public_id,
        };
        const file = await File.create(fileObject);
        if (!file) {
            throw new Error("Error while putting data in DB!");
        }
        fs.unlinkSync(path);
    }
    // req.files?.map(async (data) => {

    // });
    return res.status(200).redirect("back");
});

export { renderHome, storeCsvFiles };
