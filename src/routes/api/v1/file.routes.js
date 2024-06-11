import { Router } from "express";
import { renderCsvFilePage } from "../../../controllers/file.controller.js";

const fileRouter = Router();

fileRouter.get("/view/:id/:pageNumber", renderCsvFilePage);

export default fileRouter;
