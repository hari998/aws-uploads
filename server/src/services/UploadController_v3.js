const region = "ap-south-1";
let myBucket = "flyden-uploads";
// const accessKeyId = "AKIAWMUVNFXIPRHGN2GW";
// const secretAccessKey = "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";

const {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
} = require("@aws-sdk/client-s3");

const client = new S3Client({
  region,
  // accessKeyId,
  // secretAccessKey,
  signatureVersion: "v4",
});

module.exports = {
  s3_v3_uploadExample: async (req, res) => {
    try {
      console.log("enter v3 upload");
      console.log(
        "keysss---",
        process.env.accessKeyId,
        process.env.secretAccessKey
      );

      /**
       * error- CredentialsProviderError: Could not load credentials from any providers
       */

      let fileType = req.body?.fileType ?? "png";
      let bucketName = req.body?.bucketName ?? "exp";
      const key = `${bucketName}/${Date.now()}.${fileType}`;
      // bucketName = myBucket + `/${bucketName}`; // cant use nested path in v3, now specify nesting in Key properties

      let params = {
        Bucket: myBucket,
        Key: key,
        Body: "Hello S3!",
      };

      /**
       * @put_object
       */
      const PutObject = async () => {
        const command = new PutObjectCommand(params);

        try {
          console.log("client--", client);
          const response = await client.send(command);
          console.log("response---", response);
        } catch (err) {
          console.error("err--", err);
        }
      };
      PutObject();

      // /**
      //  * @list_buckets
      //  */
      // const ListBuckets = async () => {
      //   const command = new ListBucketsCommand(params);

      //   try {
      //     const response = await client.send(command);
      //     console.log("response---", response);
      //   } catch (err) {
      //     console.error("err--", err);
      //   }
      // };
      // ListBuckets();

      return res.status(200).json({ result: "ok" });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  },
  s3_v3_listBucketExample: async (req, res) => {
    try {
      console.log("enter v3");

      /**
       * @list_buckets
       */
      const ListBuckets = async () => {
        // const command = new ListBucketsCommand(params);

        try {
          // console.log("client here---", client);
          // const response = await client.send(command);
          const input = {};
          const command = new ListBucketsCommand(input);
          const response = await client.send(command);
          console.log("response---", response);
        } catch (err) {
          console.error("err--", err);
        }
      };
      await ListBuckets();

      //

      return res.status(200).json({ result: "ok" });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  },
};

/**
 * @nod_docu
 * https://nodejs.org/api/stream.html#:~:text=pipes%20into%20it.-,const%20writer%20%3D%20getWritableStreamSomehow()%3B%0Aconst%20reader%20%3D%20getReadableStreamSomehow,-()%3B%0Awriter.on
 */
