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
  const file_path = `https://render-pdf-we6j.onrender.com/public/storage/pdf/${file_name}`;

  console.log(file_path)
  pdf.create(html, options).toFile(file_path, (err, stream) => {

    if (err) {
      console.error("Error al crear el archivo PDF:", err);
      return res.status(500).send({
        status: false,
        message: "Error al crear el archivo PDF",
        error: err
      });
    }
      try {
        existe = fs.existsSync(`./public/storage/pdf/${file_name}`);
        fs.readdir( './public/storage/pdf/',(error,archivos) =>{
          console.log(archivos)
        } )
        res.send({
          status: true,
          exists: existe,
          message: "PDF Rutas Contenedor",
          base: `./public/storage/pdf/${file_name}`,
          data: `${process.env.NODE_PRODUCTION === "true" ? process.env.API_PRODUCCION : process.env.API}/storage/pdf/${file_name}`,
          download: `${process.env.NODE_PRODUCTION === "true" ? process.env.API_PRODUCCION : process.env.API}/download?public/storage/pdf/${file_name}`,
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
