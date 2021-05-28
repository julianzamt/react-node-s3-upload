const mongoose = require("../bin/mongodb");
const errorMessages = require("../utils/errorMessagges");

const imageSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    unique: true,
  },
  originalName: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
  },
  category: { type: mongoose.Schema.ObjectId, ref: "categories" },
  isCover: { type: Boolean, default: false },
});

module.exports = mongoose.model("imageModel", imageSchema);
