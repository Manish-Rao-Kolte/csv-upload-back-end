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
import homeRouter from "./routes/home.routes.js";

//routes declaration

app.use("/", homeRouter);

export { app };
