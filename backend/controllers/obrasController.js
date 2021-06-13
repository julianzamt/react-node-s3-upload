const obraModel = require("../models/obraModel");
const { uploadFile, getFileStream, deleteFile } = require("../utils/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

module.exports = {
  getAll: async function (req, res, next) {
    try {
      const obras = await obraModel.find();
      res.status(200).json(obras);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t access to DB." });
    }
  },
  getById: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: "id can´t be undefined" });
    }
    try {
      const obra = await obraModel.findById(req.params.id);
      res.status(200).json(obra);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t access to DB." });
    }
  },
  getImageByKey: (req, res) => {
    if (req.params.key === "undefined") {
      return res.status(500).send({ error: true, message: "image id is undefined" });
    }
    try {
      const key = req.params.key;
      const readStream = getFileStream(key);
      readStream.pipe(res);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t access to s3." });
    }
  },
  create: async function (req, res, next) {
    const cover = req.files["cover"] ? req.files["cover"][0] : null;
    const images = req.files["images"];

    //upload images to s3, then erase from server
    try {
      if (cover) {
        await uploadFile(cover);
        await unlinkFile(cover.path);
      }
      if (images) {
        for (let image of images) {
          await uploadFile(image);
          await unlinkFile(image.path);
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t upload to s3." });
    }

    // If success, insert mongo record
    let coverArrayForMongo,
      imagesArrayForMongo = [];

    if (cover) {
      coverArrayForMongo = [
        {
          path: cover.filename,
          originalName: cover.originalname,
        },
      ];
    }
    if (images) {
      imagesArrayForMongo = images.map(image => {
        return {
          path: image.filename,
          originalName: image.originalname,
        };
      });
    }

    const document = new obraModel({
      title: req.body.title,
      subtitle: req.body.subtitle,
      year: req.body.year,
      text: req.body.text,
      cover: coverArrayForMongo,
      images: imagesArrayForMongo,
    });

    try {
      const newObra = await document.save();
      res.status(200).json(newObra);
    } catch (e) {
      console.log(e);
      try {
        if (cover) {
          await deleteFile(cover.filename);
        }
        if (images) {
          for (image of images) {
            await deleteFile(image.filename);
          }
        }
      } catch (e) {
        console.log(e);
        return res.status(500).send({ error: true, message: "Couldn´t delete files from s3 - Record not saved on Mongo." });
      }
      return res.status(500).send({ error: true, message: "Couldn´t save record in DB." });
    }
  },
  updateCover: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: "document id is undefined" });
    } else if (req.file === undefined) {
      return res.status(400).send({ error: true, message: "Cover not defined." });
    }
    const documentId = req.params.id;
    const cover = req.file;
    let documentToBeUpdated = "";
    try {
      documentToBeUpdated = await obraModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t access to DB." });
    }
    //Save new cover to S3 - Delete from server
    try {
      await uploadFile(cover);
      await unlinkFile(cover.path);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t upload to s3." });
    }
    // If success, update mongo document
    documentToBeUpdated.cover = {
      path: cover.filename,
      originalName: cover.originalname,
    };

    try {
      await obraModel.updateOne({ _id: documentId }, documentToBeUpdated);
      let updatedObra = await obraModel.findById({ _id: documentId });
      return res.status(200).json(updatedObra);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t update document in DB." });
    }
  },
  updateText: async function (req, res, next) {
    console.log(req);
    if (req.params.id === "undefined") {
      console.log("params");
      return res.status(400).send({ error: true, message: "Document id is undefined" });
    } else if (!req.body) {
      console.log("body");
      return res.status(400).send({ error: true, message: "req.body is undefined" });
    }
    const documentId = req.params.id;
    let dataToBeUpdated = "";
    try {
      dataToBeUpdated = await obraModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t access to DB." });
    }

    dataToBeUpdated.title = req.body.title;
    dataToBeUpdated.subtitle = req.body.subtitle;
    dataToBeUpdated.year = req.body.year;
    dataToBeUpdated.text = req.body.text;

    try {
      await obraModel.updateOne({ _id: documentId }, dataToBeUpdated);
      let updatedObra = await obraModel.findById({ _id: documentId });
      return res.status(200).json(updatedObra);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t update record in DB." });
    }
  },
  updateImages: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: "document id is undefined" });
    } else if (req.files === undefined) {
      return res.status(400).send({ error: true, message: "Images not defined." });
    }
    const images = req.files["images"];
    const documentId = req.params.id;
    let documentToBeUpdated = "";
    try {
      documentToBeUpdated = await obraModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t access to DB." });
    }
    //Save new images to S3
    try {
      for (let image of images) {
        await uploadFile(image);
        await unlinkFile(image.path);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t upload to s3." });
    }
    // If success, insert mongo record
    for (let image of images) {
      const imageForMongo = {
        path: image.filename,
        originalName: image.originalname,
      };
      documentToBeUpdated.images.push(imageForMongo);
    }
    try {
      await obraModel.updateOne({ _id: documentId }, documentToBeUpdated);
      let updatedObra = await obraModel.findById({ _id: documentId });
      return res.status(200).json(updatedObra);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t update record in DB." });
    }
  },
  update: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: "document id is undefined" });
    }
    const cover = req.files["cover"] ? req.files["cover"][0] : null;
    const images = req.files["images"];
    const id = req.params.id;
    let dataToBeUpdated = "";
    try {
      dataToBeUpdated = await obraModel.findById({ _id: id });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t access to DB." });
    }

    //Save new images to S3
    try {
      if (cover) {
        await uploadFile(cover);
        await unlinkFile(cover.path);
      }
      if (images) {
        for (let image of images) {
          await uploadFile(image);
          await unlinkFile(image.path);
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t upload to s3." });
    }

    // If success, insert mongo record
    if (cover) {
      const coverForMongo = {
        path: cover.filename,
        originalName: cover.originalname,
      };
      dataToBeUpdated.cover.unshift(coverForMongo);
    }
    if (images) {
      for (let image of images) {
        const imageForMongo = {
          path: image.filename,
          originalName: image.originalname,
        };
        dataToBeUpdated.images.push(imageForMongo);
      }
    }

    dataToBeUpdated.title = req.body.title;
    dataToBeUpdated.subtitle = req.body.subtitle;
    dataToBeUpdated.year = req.body.year;
    dataToBeUpdated.text = req.body.text;

    try {
      await obraModel.updateOne({ _id: req.params.id }, dataToBeUpdated);
      let updatedObra = await obraModel.findById({ _id: id });
      return res.status(200).json(updatedObra);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t update record in DB." });
    }
  },
  deleteById: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: "Document id can´t be undefined" });
    }
    const id = req.params.id;
    try {
      const record = await obraModel.findById({ _id: id });
      if (record.cover.length) await deleteFile(record.cover[0].path);
      if (record.images.length) {
        record.images.forEach(image => deleteFile(image.path));
      }
      const deleteStatus = await obraModel.deleteOne({ _id: id });
      res.status(200).json(deleteStatus);
    } catch (e) {
      console.log(e);
      e.status = 400;
      res.json(e);
    }
  },
  deleteImageByKey: async function (req, res, next) {
    if (
      req.params.id === "undefined" ||
      req.query.section === "undefined" ||
      req.query.documentId === "undefined" ||
      req.query.imageId === "undefined"
    ) {
      return res.status(400).send({ error: true, message: "Bad request" });
    }
    const key = req.params.key;
    const section = req.query.section;
    const documentId = req.query.documentId;
    const imageId = req.query.imageId;
    const coverFlag = req.query.coverFlag;
    let document = {};
    try {
      await deleteFile(key);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t delete record from s3." });
    }
    try {
      if (section === "obras") {
        document = await obraModel.findById({ _id: documentId });
      }
      if (coverFlag === "true") {
        await document.cover.id(imageId).remove();
      } else {
        await document.images.id(imageId).remove();
      }
      const updatedDocument = await document.save();
      res.status(200).json(updatedDocument);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: "Couldn´t update document in DB." });
    }
  },
};
