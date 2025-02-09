const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

const errorHandler = require("./src/middlewares/error.middleware.js");
const router = require("./src/routes/cache.route.js");

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(express.static('public'));
app.use(helmet());
app.use(cors());
app.use(express.static('public'));
app.get("/",(_, res) => {
    res.sendFile(path.join(__dirname, "../../public", "index.html"));
  })
app.use("/api/v1/cache", router);
app.use(errorHandler);

module.exports=app;