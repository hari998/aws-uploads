const express = require("express");
const router = express.Router();
const UploadController = require("../services/UploadController");
const UploadController_v3 = require("../services/UploadController_v3");

router.get("/", function (req, res) {
  res.json({ message: "hello from server" });
});

router.get("/health", function (req, res) {
  res.json({ message: "everything is fine" });
});

router.put("/file/upload/express-fileupload-s3-v2-upload-via-saving-buffer-in-temp", UploadController.express_fileupload_s3_v2_upload_via_saving_buffer_in_temp);  //working

router.put("/file/upload/busboy-s3-v2-upload-using-stream", UploadController.busboy_s3_v2_upload_using_stream); //not working, it doesnt upload to s3

router.put("/file/upload/s3-v3/example", UploadController_v3.s3_v3_uploadExample);
router.put("/file/list-bucket/s3-v3/example", UploadController_v3.s3_v3_listBucketExample);

router.put(
  "/file/upload/binary-using-stream-save-in-disk",
  UploadController.binary_using_stream_save_in_disk
);
router.put("/file/copy-file-on-disk-using-stream", UploadController.copy_file_on_disk_using_stream);

module.exports = router;
