const imageModel = require("../models/imageModel");
const { uploadFile, getFileStream } = require("../utils/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

module.exports = {
  getAll: async function (req, res, next) {
    try {
      const images = await imageModel.find();
      res.status(200).json(images);
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
  create: async function (req, res, next) {
    const files = req.files;
    console.log(files.length + "-File length");
    let response = "";

    for (let file of files) {
      try {
        // upload to s3
        response = await uploadFile(file);
        // save in Mongo
        const document = new imageModel({
          path: file.filename,
          originalName: file.originalName,
        });
        response = await document.save();
        // Erase from server
        await unlinkFile(file.path);
      } catch (e) {
        e.status = 400;
        res.send(e);
        console.log(e.message + " (Error en image/ post create)");
      }
    }
    res.json("succesfully uploaded");
  },
  update: function () {},
  delete: function () {},
};
