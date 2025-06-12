const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).render("error", {
    title: "Error",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.uploadErrorHandler = (err, req, res, next) => {
  console.error("Upload Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).render("error", {
        message: "File too large. Maximum size is 5MB",
        error: err,
      });
    }
    return res.status(400).render("error", {
      message: "File upload error",
      error: err,
    });
  }
  next(err);
};

module.exports = { errorHandler, notFound };
