import { Router } from "express";
import { renderHome } from "../controllers/home.controller.js";

const homeRouter = Router();

homeRouter.get("/", renderHome);

export default homeRouter;
