const MenuItem = require("../models/MenuItem");

exports.viewCart = async (req, res) => {
  try {
    res.render("pages/cart", {
      title: "Shopping Cart",
      path: "/cart",
    });
  } catch (error) {
    console.error("Error viewing cart:", error);
    res.status(500).json({ message: "Error viewing cart" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const item = await MenuItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Item added to cart successfully",
      item: {
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    res.json({
      message: "Cart updated successfully",
      itemId,
      quantity,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    res.json({
      message: "Item removed from cart successfully",
      itemId,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

exports.directCheckout = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const item = await MenuItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Create a single-item cart session
    const cartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
    };

    // Store the single item cart in session or local storage
    req.session.directCheckoutItem = cartItem;

    // Redirect to the checkout page

    // res.render("pages/checkout", {
    //   title: "Checkout",
    //   path: "",
    //   isDirectCheckout: true,
    //   checkoutItem: cartItem,
    // });
    res.json({
      success: true,
      redirectUrl: "/checkout",
      item: cartItem,
    });
  } catch (error) {
    console.error("Error processing direct checkout:", error);
    res.status(500).json({ message: "Error processing direct checkout" });
  }
};
