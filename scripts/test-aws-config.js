require("dotenv").config();
const {
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const s3Client = require("../config/aws");
const fs = require("fs");
const path = require("path");

async function testImageUpload() {
  try {
    // Use a test image from the public folder
    const testImagePath = path.join(
      __dirname,
      "..",
      "public",
      "photo",
      "F&F.svg"
    );
    const fileContent = fs.readFileSync(testImagePath);
    const testKey = `test-uploads/test-image-${Date.now()}.svg`;

    console.log("\nTesting image upload...");
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: testKey,
      Body: fileContent,
      ContentType: "image/svg+xml",
    };

    const uploadResponse = await s3Client.send(
      new PutObjectCommand(uploadParams)
    );
    console.log("Successfully uploaded test image");
    console.log("Test file key:", testKey);
    return testKey;
  } catch (error) {
    console.error("\nImage upload test failed:", error.message);
    throw error;
  }
}

async function testAWSConnection() {
  try {
    console.log("Testing AWS Configuration...");
    console.log("Using Region:", process.env.AWS_REGION);
    console.log("Using Bucket:", process.env.AWS_BUCKET_NAME);

    // Test S3 connection
    const listBucketsResponse = await s3Client.send(new ListBucketsCommand({}));
    console.log("\nSuccessfully connected to AWS");
    console.log(
      "Available buckets:",
      listBucketsResponse.Buckets.map((b) => b.Name)
    );

    if (
      !listBucketsResponse.Buckets.find(
        (b) => b.Name === process.env.AWS_BUCKET_NAME
      )
    ) {
      console.warn(
        `\nWarning: Bucket '${process.env.AWS_BUCKET_NAME}' not found in your account`
      );
    } else {
      // Test specific bucket access
      const listObjectsResponse = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET_NAME,
        })
      );
      console.log(
        `\nSuccessfully accessed bucket: ${process.env.AWS_BUCKET_NAME}`
      );
      console.log(
        "Objects in bucket:",
        listObjectsResponse.Contents?.length || 0
      );

      // Test image upload
      const uploadedKey = await testImageUpload();
      console.log("\nAll tests completed successfully!");
    }
  } catch (error) {
    console.error("\nAWS Configuration Error:", error.message);
    console.error("\nPlease check:");
    console.error("1. AWS credentials are correct");
    console.error("2. Region is correctly specified");
    console.error("3. Bucket exists and is accessible");
    console.error("4. IAM user has appropriate permissions");
    process.exit(1);
  }
}

testAWSConnection();
