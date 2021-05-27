const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/image-upload-s3",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (error) {
    if (error) {
      console.log("no se conectó a MongoDb");
      throw error;
    } else {
      console.log("conectado a MongoDb!!!");
    }
  }
);

module.exports = mongoose;
