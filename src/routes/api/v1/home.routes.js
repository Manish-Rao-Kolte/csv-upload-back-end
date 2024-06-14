import { Router } from "express";
import {
    renderHome,
    storeCsvFiles,
} from "../../../controllers/home.controller.js";
import { upload } from "../../../middlewares/multer.middleware.js";

const homeRouter = Router();

//routes declaration
homeRouter.get("/", renderHome);
// homeRouter.post("/upload", upload.single("file"), storeCsvFiles);

//can upload multiple files using multer in storage.
homeRouter.route("/upload").post(upload.array("files"), storeCsvFiles);

export default homeRouter;
