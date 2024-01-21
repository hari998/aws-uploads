const express = require("express");
const router = express.Router();
const UploadController = require("../services/UploadController");
const UploadController_v3 = require("../services/UploadController_v3");
const os = require("os");

router.get("/", async function (req, res) {
  res.json({ message: "hello from server" });
});

router.get("/health", async function (req, res) {
  const versionNumber = os.release();
  const operatingSystem = os.platform();
  const uptime = os.uptime();
  const arch = os.arch();
  const cpu = os.cpus();
  let BytesToMb = 1024 * 1024;
  const freemem = os.freemem() / BytesToMb;
  const totalmem = os.totalmem() / BytesToMb;
  const hostname = os.hostname();
  res.json({
    versionNumber,
    operatingSystem,
    uptime,
    arch,
    freemem,
    totalmem,
    hostname,
    cpu,
    message: "everything is fine",
  });
});

router.get("/test/fetch", async function (req, res) {
  try {
    let config = {
      url: "https://jsonplaceholder.typicode.com/todos/1",
      method: "GET",
      body: {},
    };
    let resp = await postData(config);
    res.status(200).json({ message: resp ?? "everything is fine" });
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: error?.message, error: error, stack: error.stack });
  }
});

async function postData(config) {
  let { url, method, data } = config;
  // Default options are marked with *
  const response = await fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    // headers: {
    //   "Content-Type": "application/json",
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

router.put(
  "/file/upload/express-fileupload-s3-v2-upload-via-saving-buffer-in-temp",
  UploadController.express_fileupload_s3_v2_upload_via_saving_buffer_in_temp
); //working

router.put(
  "/file/upload/busboy-s3-v2-upload-using-stream",
  UploadController.busboy_s3_v2_upload_using_stream
); //not working, it doesnt upload to s3

router.put(
  "/file/upload/s3-v3/example",
  UploadController_v3.s3_v3_uploadExample
);
router.put(
  "/file/list-bucket/s3-v3/example",
  UploadController_v3.s3_v3_listBucketExample
);

router.put(
  "/file/upload/binary-using-stream-save-in-disk",
  UploadController.binary_using_stream_save_in_disk
);
router.put(
  "/file/copy-file-on-disk-using-stream",
  UploadController.copy_file_on_disk_using_stream
);

module.exports = router;
