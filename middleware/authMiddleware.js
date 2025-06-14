const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect("/admin/login", {
        isAdmin: false,
        title: "Admin Login",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      res.cookie("jwt", "", { maxAge: 1 });
      return res.redirect("/admin/login");
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/admin/login"),
      {
        isAdmin: false,
        title: "Admin Login",
      };
  }
};
