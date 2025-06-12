const express = require("express");
const router = express.Router();
const {
  getFilteredItems,
  getCategories,
} = require("../controllers/menuController");

router.get("/", getFilteredItems);
router.get("/getCategories", getCategories);


module.exports = router;
