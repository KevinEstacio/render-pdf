const express = require("express");
const router = express.Router();
const pdf = require("html-pdf");
var fs = require("fs");
const uniqid = require("uniqid");
require("dotenv").config();

router.post("/", async (req, res, next) => {
  const { body, headers } = req;
  const { html, options } = body;
  let file_name = `${uniqid()}.pdf`, existe = "";
  const file_path = `./public/storage/pdf/${file_name}`;

  pdf.create(html, options).toFile(file_path, (err, stream) => {

      try {
        existe = fs.existsSync(`./public/storage/pdf/${file_name}`);
        res.send({
          status: true,
          exists: existe,
          message: "PDF Rutas Contenedor",
          base: `./public/storage/pdf/${file_name}`,
          data: `https://render-pdf-we6j.onrender.com/storage/pdf/${file_name}`,
          download: `https://render-pdf-we6j.onrender.com/download?public/storage/pdf/${file_name}`,
        });
      } catch (error) {
        res.send({
          status: false,
          message: "PDF Rutas Null",
          data: null,
          error: error
        });
      }
    });
});
module.exports = router;
