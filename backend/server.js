const express = require("express");
const cors = require("cors");

const obrasRouter = require("./routes/obras");
const proyectosRouter = require("./routes/proyectos");
const equipamientosRouter = require("./routes/equipamientos");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/obras", obrasRouter);
app.use("/proyectos", proyectosRouter);
app.use("/equipamientos", equipamientosRouter);

app.listen(5000, () => console.log("listening on port 5000"));
