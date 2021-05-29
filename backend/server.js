const express = require("express");
const cors = require("cors");

const obrasRouter = require("./routes/obras");

const app = express();

app.use(cors());

app.use("/obras", obrasRouter);

app.listen(5000, () => console.log("listening on port 5000"));
