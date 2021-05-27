const express = require("express");
const cors = require("cors");

const imagesRouter = require("./routes/images");

const app = express();

app.use(cors());

app.use("/images", imagesRouter);

app.listen(5000, () => console.log("listening on port 5000"));
