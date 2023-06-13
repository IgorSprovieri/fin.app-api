import AWS from "aws-sdk";

class AwsS3 {
  #user;
  #accessKey;
  #secretKey;
  #bucketName;
  #bucketRegion;

  constructor() {
    this.#user = process.env.AWS_IAM_USER;
    this.#accessKey = process.env.AWS_ACCESS_KEY;
    this.#secretKey = process.env.AWS_SECRET_KEY;
    this.#bucketName = process.env.AWS_BUCKET_NAME;
    this.#bucketRegion = process.env.AWS_BUCKET_REGION;

    AWS.config.update({
      region: this.#bucketRegion,
      credentials: {
        accessKeyId: this.#accessKey,
        secretAccessKey: this.#secretKey,
      },
    });
  }

  async upload(key, base64, mime) {
    try {
      try {
        const buffer = Buffer.from(
          base64.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const body = {
          Bucket: this.#bucketName,
          Key: key,
          Body: buffer,
          ContentEncoding: "base64",
          ContentType: mime || "image/jpeg",
          ACL: "public-read",
        };

        const s3 = new AWS.S3({
          apiVersion: "2006-03-01",
          region: this.#bucketRegion,
        });

        const data = await s3.upload(body).promise();
        return data;
      } catch (error) {
        return { error };
      }
    } catch (error) {
      return error;
    }
  }

  async delete(key) {
    try {
      const body = {
        Bucket: this.#bucketName,
        Key: key,
      };

      const s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        region: this.#bucketRegion,
      });

      const response = await s3.deleteObject(body).promise();

      return response;
    } catch (error) {
      return { error };
    }
  }
}

export default new AwsS3();
