const AWS = require("aws-sdk");
const region = "ap-south-1";
AWS.config.update(region);
let myBucket = "flyden-uploads";
const accessKeyId = "AKIAWMUVNFXIPRHGN2GW";
const secretAccessKey = "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";

const busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const stream = require("stream");

const s3 = new AWS.S3({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  signatureVersion: "v4",
});

module.exports = {
  express_fileupload_s3_v2_upload_via_saving_buffer_in_temp: async (
    req,
    res
  ) => {
    try {
      console.log("file upload body----", {
        body: req.body,
        reqfiles: req.files,
      });

      let fileType = req.body?.fileType ?? ".png";
      const file = Date.now() + `.${fileType}`;
      let bucketName = req.body?.bucketName ?? "images";

      let params = {
        Bucket: myBucket + `/${bucketName}`,
        Key: file,
        Body: req.files.file.data,
      };

      ////using await
      // const s3UploadStream = await s3.upload(params).promise();
      // console.log("s3UploadStream--", s3UploadStream);

      // Upload to S3
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading to S3:", err);
          return res.status(500).send("Error uploading to S3");
        }

        console.log("Upload to S3 completed successfully", data);
        res.status(200).send("File uploaded to S3");
      });

      let result = "done";

      // return res.status(200).json({ result: result });
    } catch (err) {
      console.error("error in upload--", err.name, err.message);
      return res.status(500).json({ error: err });
    }
  },
  busboy_s3_v2_upload_using_stream: async (req, res) => {
    let fileType = req.body?.fileType ?? "png";
    const key = Date.now() + `.${fileType}`;
    let bucketName = req.body?.bucketName ?? "exp";
    bucketName = myBucket + `/${bucketName}`;

    const bb = busboy({ headers: req.headers });
    const passThrough = new stream.PassThrough();

    let params = {
      Bucket: bucketName,
      Key: key,
      Body: passThrough,
    };

    const s3UploadStream = s3.upload(params);

    bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log("Busboy file!");
      file.pipe(passThrough);
    });

    bb.on("finish", () => {
      console.log("Busboy finished parsing the form!");
      passThrough.end();
    });
    req.pipe(bb);
    res.send("File upload started.");
  },
  binary_using_stream_save_in_disk: async (req, res) => {
    try {
      // console.log("req-----", req);
      /**
       * @src- https://dev.to/tqbit/how-to-use-node-js-streams-for-fileupload-4m1n#fin
       */
      const filePath = path.join(
        __dirname,
        `/GO_1.18_Workspaces_go.work_file_with_easy_Examples.mp4`
      );
      console.log("__dirname----", __dirname, req.headers);

      console.time("t");
      const write_stream = fs.createWriteStream(filePath);

      write_stream.on("open", () => req.pipe(write_stream));
      let count = 0;
      write_stream.on("drain", () => {
        // Calculate how much data has been piped yet
        const written = parseInt(write_stream.bytesWritten);
        const total = parseInt(req.headers["content-length"]);
        const pWritten = ((written / total) * 100).toFixed(2);
        console.log(`Processing  ...  ${pWritten}% done`);
        count += 1;
      });

      write_stream.on("close", () => {
        // Send a success response back to the client
        const msg = `Data uploaded to ${filePath}`;
        console.log("Processing  ...  100%", count);
        console.log(msg);
        console.timeEnd("t");
        res.status(200).send({ status: "success", msg });
      });

      write_stream.on("error", (err) => {
        // Send an error message to the client
        console.error(err);
        res.status(500).send({ status: "error", err });
      });
      // return res.status(200).json({ result: "ok" });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  },
  copy_file_on_disk_using_stream: async (req, res) => {
    try {
      const filePath = path.join(__dirname, `/copied.png`);
      console.log("__dirname----", __dirname, req.headers);

      console.time("t");
      const write_stream = fs.createWriteStream(filePath);

      const read_stream = fs.createReadStream(path.join(__dirname, `/im.png`));

      write_stream.on("open", () => read_stream.pipe(write_stream));
      let count = 0;
      write_stream.on("drain", () => {
        // Calculate how much data has been piped yet
        const written = parseInt(write_stream.bytesWritten);
        const total = parseInt(req.headers["content-length"]);
        const pWritten = ((written / total) * 100).toFixed(2);
        console.log(`Processing  ...  ${pWritten}% done`);
        count += 1;
      });

      write_stream.on("close", () => {
        // Send a success response back to the client
        const msg = `Data uploaded to ${filePath}`;
        console.log("Processing  ...  100%", count);
        console.log(msg);
        console.timeEnd("t");
        res.status(200).send({ status: "success", msg });
      });

      write_stream.on("error", (err) => {
        // Send an error message to the client
        console.error(err);
        res.status(500).send({ status: "error", err });
      });
      // return res.status(200).json({ result: "ok" });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  },
};

/**
 * @nod_docu
 * https://nodejs.org/api/stream.html#:~:text=pipes%20into%20it.-,const%20writer%20%3D%20getWritableStreamSomehow()%3B%0Aconst%20reader%20%3D%20getReadableStreamSomehow,-()%3B%0Awriter.on
 */
