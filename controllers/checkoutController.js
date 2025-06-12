exports.viewCheckout = async (req, res) => {
  try {
    // Check if it's a direct checkout or regular cart checkout
    const checkoutItem = req.session.directCheckoutItem; //added
    const isDirectCheckout = !!checkoutItem; //added

    res.render("pages/checkout", {
      title: "Checkout",
      path: "",
      isDirectCheckout, //added
      checkoutItem, //added
    });

    // Clear the direct checkout item after rendering //added
    if (isDirectCheckout) {
      delete req.session.directCheckoutItem;
    }
  } catch (error) {
    console.error("Error viewing checkout:", error);
    res.status(500).json({ message: "Error viewing checkout" });
  }
};
