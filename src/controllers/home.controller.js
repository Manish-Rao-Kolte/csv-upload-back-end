import { asyncHandler } from "../utils/asyncHandler.js";

const renderHome = asyncHandler(async (req, res) => {
   return res.status(200).render("home");
});

export { renderHome };
