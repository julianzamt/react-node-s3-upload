const mongoose = require("../bin/mongodb");

const imageSchema = new mongoose.Schema({
  path: String,
  originalName: String,
  description: String,
});

module.exports = mongoose.model("imageModel", imageSchema);
