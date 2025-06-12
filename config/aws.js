const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

// Ensure environment variables are loaded
dotenv.config();

// Validate required AWS configuration
const required = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_BUCKET_NAME",
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing required AWS configuration: ${missing.join(", ")}`);
}

// Configuration with explicit credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Force path style URLs to avoid DNS issues
  forcePathStyle: true,
  // Increase timeout for slower connections
  requestHandler: {
    setTimeout: 3000,
  },
});

// Test the configuration immediately
async function testS3Connection() {
  try {
    await s3Client.config.credentials();
    console.log("AWS credentials loaded successfully");
  } catch (error) {
    console.error("Error loading AWS credentials:", error);
    throw error;
  }
}

testS3Connection().catch(console.error);

module.exports = s3Client;
