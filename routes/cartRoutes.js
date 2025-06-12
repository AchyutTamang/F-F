const express = require("express");
const router = express.Router();
const {
  viewCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  directCheckout, // Add this
} = require("../controllers/cartController");

// View cart page
router.get("/", viewCart);

// Cart API endpoints
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:itemId", removeFromCart);
router.post("/direct-checkout", directCheckout); // Add this route

module.exports = router;
