const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  try {
    // console.log("Checking authentication...");
    const token = req.cookies.jwt;
    // console.log("Token from cookie:", token);

    if (!token) {
      console.log("No token found, redirecting to login");
      return res.redirect("/admin/login");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      console.log("No admin found with token ID");
      res.cookie("jwt", "", { maxAge: 1 });
      return res.redirect("/admin/login");
    }

    // console.log("Admin authenticated:", admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/admin/login");
  }
};
