import { Router } from "express";
import {
      renderHome,
      storeCsvFiles,
} from "../../../controllers/home.controller.js";
import { upload } from "../../../middlewares/multer.middleware.js";

const homeRouter = Router();

homeRouter.get("/", renderHome);
// homeRouter.post("/upload", upload.single("file"), storeCsvFiles);
homeRouter.route("/upload").post(upload.array("files"), storeCsvFiles);

export default homeRouter;
