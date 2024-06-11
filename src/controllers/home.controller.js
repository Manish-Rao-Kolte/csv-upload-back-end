import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { File } from "../models/file.model.js";
import csv from "csv-parser";
import fs from "fs";

const renderHome = asyncHandler(async (req, res) => {
    //fetch csv files list from databse.
    //show data in list on home page
    const filesList = await File.find().select("-updatedAt -createdAt");
    if (!filesList) {
        console.log("Unable to fetch data from database!");
        return new Error("Unable to fetch data from database!");
    }
    return res.status(200).render("home", { filesList, title: "Home" });
});

const storeCsvFiles = asyncHandler(async (req, res) => {
    //get data from client
    //check for data validation
    if (!req.files) {
        console.log("Error in getting stored data!");
    }
    req.files?.map(async (data) => {
        const { originalname, mimetype, filename, path } = data;
        if (!path || !originalname) {
            console.log("No file path or Name exist!");
            return;
        }
        if (mimetype !== "text/csv") {
            console.log("Submit required file type!");
            //deleting file from temp to clear storage and to protect code.
            fs.unlinkSync(path);
            return;
        }
        //upload data on cloudinary to use third party service and to make code base scalable to be able to store large data like videos etc.
        const instance = await uploadOnCloudinary(path);
        if (!instance) {
            console.log("Error in uploading file on cloudinary!");
            fs.unlinkSync(path); //deleting file from temp to clear storage and to protect code.
            return;
        }
        const fileObject = {
            originalname,
            mimetype,
            filename,
            url: instance.url,
        };
        const file = await File.create(fileObject);
        fs.unlinkSync(path);
        if (!file) {
            console.log("Error while putting data in DB!");
            return;
        }
        return res.status(200).redirect("back");
    });
});

export { renderHome, storeCsvFiles };
