const mongoose = require("../bin/mongodb");
const errorMessages = require("../utils/errorMessages");

const ImageSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    unique: true,
  },
  originalName: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
  },
});

const ObraSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    maxlength: [50, errorMessages.GENERAL.maxlength],
    unique: true,
  },
  subtitle: { type: String, maxlength: [280, errorMessages.GENERAL.maxlength] },
  text: { type: String, maxlength: [50, errorMessages.GENERAL.maxlength] },
  year: { type: Number, required: [true, errorMessages.GENERAL.required] },
  coverImage: [ImageSchema],
  images: [ImageSchema],
});

const Obra = mongoose.model("obra", ObraSchema);

module.exports = Obra;
