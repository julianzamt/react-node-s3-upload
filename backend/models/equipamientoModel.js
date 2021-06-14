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

const EquipamientoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    maxlength: [50, errorMessages.GENERAL.maxlength],
    unique: true,
  },
  subtitle: { type: String, maxlength: [650, errorMessages.GENERAL.maxlength] },
  text: { type: String, maxlength: [50, errorMessages.GENERAL.maxlength] },
  year: { type: Number, required: [true, errorMessages.GENERAL.required] },
  cover: [ImageSchema],
  images: [ImageSchema],
});

const Equipamiento = mongoose.model("Equipamiento", EquipamientoSchema);

module.exports = Equipamiento;
