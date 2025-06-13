const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const Merch = require("../models/Merch");

// Use specific routes instead of catch-all
router.get("/home", (req, res) => {
  res.render("pages/home", {
    title: "Home",
    isAdmin: false,
  });
});
router.get("/", (req, res) => {
  res.render("pages/home", {
    title: "Home",
    isAdmin: false,
  });
});

router.get("/menu", async (req, res, next) => {
  console.log("menu in mainRoute");

  try {
    const menuItems = await MenuItem.find({
      category: { $in: ["beverage", "food"] },
    });
    res.render("pages/menu", {
      title: "Menu",
      menuItems,
      isAdmin: false,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/merch", async (req, res, next) => {
  console.log("in merch get");

  try {
    const merchItems = await Merch.find({});
    // const merchItems = {};
    res.render("pages/merch", {
      title: "Merchandise",
      merchItems,
      isAdmin: false,
    });
  } catch (error) {
    next(error);
  }
});

router.all("/*", (req, res) => {
  res.render("pages/home", {
    title: "Home",
  });
});
module.exports = router;
