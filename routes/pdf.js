const express = require("express");
const router = express.Router();
const pdf = require("html-pdf");
var fs = require("fs");
const uniqid = require("uniqid");
require("dotenv").config();

router.post("/", async (req, res, next) => {
  const { body, headers } = req;
  const { html, options } = body;
  let file_name = `${uniqid()}.pdf`,
    existe = "";

  const dirname = process.env.NODE_PRODUCTION === "true" ? "/srv/app" : ".";
  await pdf
    .create(html, options)
    .toFile(`${dirname}/public/storage/pdf/${file_name}`, (err, stream) => {
      try {
        existe = fs.existsSync(`./public/storage/pdf/${file_name}`);
        res.send({
          status: true,
          exists: existe,
          message: "PDF Rutas Contenedor",
          base: `./public/storage/pdf/${file_name}`,
          data: `${process.env.API}/storage/pdf/${file_name}`,
          download: `${process.env.API}/download?public/storage/pdf/${file_name}`,
        });
      } catch (error) {
        res.send({
          status: false,
          message: "PDF Rutas Null",
          data: null,
        });
      }
    });
});
module.exports = router;
