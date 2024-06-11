import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";
import csv from "csv-parser";
import fs from "fs";

const renderCsvFilePage = asyncHandler(async (req, res) => {
    //fetch which file to show
    //fetch csv file from cloudinary
    //parse data using csv parser
    //show data on tableview page
    const { id, pageNumber } = req.params;
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
    const filePath = `./public/temp/downloads/${file.originalname}`;
    fs.writeFile(filePath, data, function (err) {
        if (err) {
            return console.log(err);
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
            .on("data", (data) => fileData.push(data))
            .on("end", () => {
                fs.unlinkSync(filePath);
                const { slicedData, startIndex, maxRowsPerPage } =
                    getTableDataToShow(fileData, pageNumber);
                const startRowNumber = startIndex + 1;
                const endRowNumber = startRowNumber + (slicedData.length - 1);
                const totalRows = fileData.length;
                const pageCount = Math.ceil(fileData.length / maxRowsPerPage);
                if (
                    pageNumber > pageCount ||
                    pageNumber < pageCount ||
                    !Number(pageNumber)
                ) {
                    const url = req.originalUrl;
                    return res.status(404).render("404_page", { url });
                }
                return res.status(200).render("view_file", {
                    fileHeader,
                    fileData: slicedData,
                    pageNumber,
                    startRowNumber,
                    endRowNumber,
                    totalRows,
                    pageCount,
                    id,
                    title: "File",
                });
            });
    });
    //   return res.status(200).render("pagination", { title: "Page" });
});

const getTableDataToShow = (fileData = [], pageNumber = 1) => {
    const maxRowsPerPage = 30;
    const startIndex = (pageNumber - 1) * maxRowsPerPage;
    const endIndex = startIndex + maxRowsPerPage;
    const slicedData = fileData.slice(startIndex, endIndex);
    return { slicedData, startIndex, maxRowsPerPage };
};

export { renderCsvFilePage };
