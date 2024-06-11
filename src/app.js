import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(express.static("public"));

//routes import
import homeRouter from "./routes/api/v1/home.routes.js";
import fileRouter from "./routes/api/v1/file.routes.js";

//routes declaration
// app.use("/", (req, res) => {
//       return res.redirect("/api/v1/");
// });
app.use("/api/v1/", homeRouter);
app.use("/api/v1/file/", fileRouter);
app.use("*", (req, res) => {
    const url = req.baseUrl;
    return res.status(404).render("404_page", { url });
});

export { app };
