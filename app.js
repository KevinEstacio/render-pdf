const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { createServer } = require("http");
const fs = require("fs");

const indexRouter = require("./routes/index");
const pdfRouter = require("./routes/pdf");
const downloadRouter = require("./routes/download");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31536000 }));

app.use("/", indexRouter);
app.use("/html-pdf", pdfRouter);
app.use("/download", downloadRouter);

const httpServer = createServer(app);
httpServer.setTimeout(7 * 60 * 1000);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server ready at http://127.0.0.1:${process.env.PORT}`);
});

module.exports = app;
