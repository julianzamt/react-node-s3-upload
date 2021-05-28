const mongoose = require("../bin/mongodb");
const errorMessages = require("../utils/errorMessagges");

const pageTextSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.ObjectId, ref: "categories" },
  title: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    maxlength: [50, errorMessages.GENERAL.maxlength],
    unique: true,
  },
  subtitle: { type: String, maxlength: [280, errorMessages.GENERAL.maxlength] },
  text: { type: String, maxlength: [50, errorMessages.GENERAL.maxlength] },
  year: Number,
});

module.exports = mongoose.model("pageText", pageTextModel);
