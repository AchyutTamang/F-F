const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const s3Client = require("../config/aws");
const dotenv = require("dotenv");

// Debug function
function debugLog(message, ...args) {
  console.log(`[Upload Debug] ${message}`, ...args);
}

// Load environment variables
dotenv.config();

// Test AWS credentials before initializing middleware
async function validateAWSCredentials() {
  try {
    await s3Client.config.credentials();
    debugLog("AWS credentials validated successfully");
    return true;
  } catch (error) {
    debugLog("AWS credentials validation failed:", error);
    return false;
  }
}
// Validate AWS configuration before creating upload middleware
const requiredEnvVars = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_BUCKET_NAME",
];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  throw new Error(
    `Missing required AWS configuration: ${missingVars.join(", ")}`
  );
}

// Initial validation
validateAWSCredentials()
  .then((isValid) => {
    if (!isValid) {
      console.error("AWS credentials validation failed during initialization");
    }
  })
  .catch(console.error);

debugLog("Initializing upload middleware with config:", {
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET_NAME,
  keyId: process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + "...",
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
      });
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // Use path style endpoint
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `menu-items/${uniqueSuffix}${path
        .extname(file.originalname)
        .toLowerCase()}`;
      // Store the generated filename in the request for later use
      if (!req.uploadedFiles) req.uploadedFiles = [];
      req.uploadedFiles.push({
        originalName: file.originalname,
        key: fileName,
        contentType: file.mimetype,
      });
      cb(null, fileName);
    },
  }),
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error(`Only ${filetypes} files are allowed!`));
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

module.exports = { upload };
