import { asyncHandler } from "../utils/asyncHandler.js";

const renderHome = asyncHandler(async (req, res) => {
      return res.status(200).render("home");
});

const storeCsvFiles = asyncHandler(async (req, res) => {
      //get data from client
      //check for data validation

      return res.status(200).send("uploaded");
});

export { renderHome, storeCsvFiles };
