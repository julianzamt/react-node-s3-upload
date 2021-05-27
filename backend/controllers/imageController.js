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
    const file = req.file;
    const description = req.body.description;
    const originalName = file.originalname;
    console.log(file);
    try {
      // upload to s3
      let response = await uploadFile(file);
      // save in Mongo
      const document = new imageModel({
        path: file.filename,
        originalName: originalName,
        description: description,
      });
      response = await document.save();
      // Erase from server
      await unlinkFile(file.path);
      // Respond to client with Path to s3 bucket
      res.json("succesfully uploaded");
    } catch (e) {
      e.status = 400;
      res.send(e);
      console.log(e.message + " (Error en image/ post create)");
    }
  },
  update: function () {},
  delete: function () {},
};
