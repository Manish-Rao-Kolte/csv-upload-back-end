import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";
import csv from "csv-parser";
import fs from "fs";
import { removeFromCloudinary } from "../utils/cloudinary.js";

const renderCsvFilePage = asyncHandler(async (req, res) => {
    //fetch which file to show
    //fetch csv file from cloudinary url
    //parse data using csv parser
    //show data on tableview page
    const { id, pageNumber } = req.params;
    if (!Number(pageNumber)) {
        return res.status(404).render("404_page", { url: req.originalUrl });
    }
    if (!id) {
        console.log("File id is required!");
        return;
    }
    const file = await File.findById(id).select("-updatedAt -createdAt");
    if (!file) {
        return new Error("Not able to find the file you requested!");
    }
    const response = await fetch(file.url, {
        headers: {
            "Content-Type": "application/csv",
        },
    });
    const data = await response.text();
    const filePath = `public/temp/downloads/data.csv`;
    fs.writeFile(filePath, data, function (err) {
        if (err) {
            return console.log("Error", err);
        }
        const fileData = [];
        const fileHeader = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("headers", (headers) => {
                headers.map((head) => {
                    fileHeader.push(head);
                });
            })
            .on("data", (data) => {
                fileData.push(data);
            })
            .on("end", () => {
                fs.unlinkSync(filePath);
                const { slicedData, startIndex, maxRowsPerPage } =
                    getTableDataToShow(fileData, pageNumber);
                const startRowNumber = startIndex + 1;
                const endRowNumber = startRowNumber + (slicedData.length - 1);
                const totalRows = fileData.length;
                const pageCount = Math.ceil(fileData.length / maxRowsPerPage);
                const limit = pageNumber + 20;
                if (
                    Number(pageNumber) < 1 ||
                    Number(pageNumber) > Number(pageCount)
                ) {
                    return res
                        .status(404)
                        .render("404_page", { url: req.originalUrl });
                }
                return res.status(200).render("view_file", {
                    fileHeader,
                    fileData: slicedData,
                    pageNumber: Number(pageNumber) || 1,
                    startRowNumber,
                    endRowNumber,
                    totalRows,
                    pageCount: Number(pageCount),
                    limit,
                    id,
                    title: "File",
                });
            });
    });
    //   return res.status(200).render("pagination", { title: "Page" });
});

const removeCsvFile = asyncHandler(async (req, res) => {
    //fetxh with file to delete from client
    //fetch data from db
    //get cloudinary url to remove from data
    //remove file from cloudinary and DB
    const { id } = req.params;
    if (!id) {
        return new Error("File id is required to remove!");
    }
    const file = await File.findByIdAndDelete(id);
    if (!file) {
        return new Error(
            "File does not exist or Error in removing the file from DB!"
        );
    }
    const result = await removeFromCloudinary(file.public_id);
    if (result !== "ok") {
        return new Error("Failed to remove file from Cloudinary!");
    }
    return res.status(200).redirect("back");
});

const getTableDataToShow = (fileData = [], pageNumber = 1) => {
    const maxRowsPerPage = 100;
    const startIndex = (pageNumber - 1) * maxRowsPerPage;
    const endIndex = startIndex + maxRowsPerPage;
    const slicedData = fileData.slice(startIndex, endIndex);
    return { slicedData, startIndex, maxRowsPerPage };
};

export { renderCsvFilePage, removeCsvFile };
