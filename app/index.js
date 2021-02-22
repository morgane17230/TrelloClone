const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const router = require("./router");
const bodySanitizer = require("./middlewares/sanitizeBody");

const app = express();
const multer = require("multer");
const bodyParser = multer();

app.use(express.static('public'));
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(bodyParser.none());
app.use(bodySanitizer);

app.use(router);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
