const obraModel = require("../models/obraModel");
const { uploadFile, getFileStream } = require("../utils/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

module.exports = {
  getAll: async function (req, res, next) {
    try {
      const obras = await obraModel.find();
      res.status(200).json(obras);
    } catch (e) {
      e.status = 400;
      console.log(e.message);
    }
  },
  getById: (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
  },
  create: function (req, res, next) {
    console.log(req.files);
    console.log(req.body);
    const images = req.files["images"];
    const cover = req.files["cover"][0];
    console.log(images.length + "-File length");
    console.log(cover);
    console.log(req.body);
    let response = "";

    // for (let file of files) {
    //   try {
    //     // upload to s3
    //     response = await uploadFile(file);

    //     const images = new obraModel({
    //       path: file.filename,
    //       originalName: file.originalName,
    //       category: file.body.category,
    //       isCover: file.body.isCover,
    //     });
    //     response = await document.save();
    //     // Erase from server
    //     await unlinkFile(file.path);
    //   } catch (e) {
    //     e.status = 400;
    //     res.send(e);
    //     console.log(e.message + " (Error en image/ post create)");
    //   }
    // }
    res.json("succesfully uploaded");
  },
  getImagesNames: async function () {
    try {
      const imagesNames = await imageModel.find().select("originalName");
      res.status(200).json(imagesNames);
    } catch (e) {
      e.status = 400;
      console.log(e.message);
    }
  },
  update: function () {},
  delete: function () {},
};
