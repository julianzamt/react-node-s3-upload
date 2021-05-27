const mongoose = require("../bin/mongodb");

const imageSchema = new mongoose.Schema({
  path: String,
  originalName: String,
});

module.exports = mongoose.model("imageModel", imageSchema);
