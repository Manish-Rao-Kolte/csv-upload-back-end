import { Router } from "express";
import {
    removeCsvFile,
    renderCsvFilePage,
} from "../../../controllers/file.controller.js";

const fileRouter = Router();

//routes declaration
fileRouter.get("/view/:id/:pageNumber", renderCsvFilePage);
fileRouter.get("/remove/:id", removeCsvFile);

export default fileRouter;
