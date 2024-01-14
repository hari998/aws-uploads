const express = require("express");
const app = express();
const router = require("./routes/router");
// const busboy = require("busboy");
const fileUpload = require("express-fileupload");

let fileuploadOpt = {
  // limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: "./tmp/",
};

app.use(fileUpload(fileuploadOpt));

app.use("/", function (req, res, next) {
  console.log("hello mw");
  next();
});

app.use("/", router);

const PORT = process.env.PORT || 8010;

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});

/**
 * im able to attach and it works immediately but when detach , we have to restart our application code,
 * after detaching machine still ablt to upload
 */
