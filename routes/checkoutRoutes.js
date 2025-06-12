const express = require("express");
const router = express.Router();
const { viewCheckout } = require("../controllers/checkoutController");

// const {
//   viewCart,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
// } = require("../controllers/cartController");

// View cart page
// router.get("/", viewCart);
router.get("/", viewCheckout);
// Cart API endpoints
// router.post("/add", addToCart);
// router.put("/update", updateCartItem);
// router.delete("/remove/:itemId", removeFromCart);

module.exports = router;
