const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const { login, logout } = require("../controllers/adminController");
const adminController = require("../controllers/adminController");
const { uploadErrorHandler } = require("../middleware/errorMiddleware");
const methodOverride = require("method-override"); // Add this for PUT/DELETE requests
const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getItem,
  createItemCategory,
  createMerch,
} = require("../controllers/itemController");

// Middleware to handle PUT/DELETE requests
router.use(methodOverride("_method"));

// Auth routes
router.get("/login", (req, res) => {
  res.render("admin/login", {
    title: "Admin Login",
    isAdmin: false,
  });
});
router.post("/login", login);
router.get("/logout", logout);

router.get("/", protect, (req, res) => {
  res.redirect("/admin/dashboard");
});

// Dashboard
router.get("/dashboard", protect, adminController.getDashboard);
router.get("/dashboard/merch", protect, adminController.getDashboardMerch);

// Item CRUD Routes
router.get("/items/new", protect, (req, res) => {
  res.render("admin/items/create", {
    title: "Add New Item",
    // error: req.flash("error"),
    // success: req.flash("success"),
  });
});

router.get("/items/category/new", protect, (req, res) => {
  res.render("admin/items/createCategory", {
    title: "Add New Category",
  });
});
router.get("/items/merch/new", protect, (req, res) => {
  res.render("admin/items/createMerch", {
    title: "Add New Merch",
  });
});

// Create item with S3 upload
router.post(
  "/items",
  protect,
  upload.single("image"),
  // uploadErrorHandler,
  createItem
);
router.post(
  "/merch",
  protect,
  upload.single("image"),
  // uploadErrorHandler,
  createMerch
);
router.post("/items/category", protect, createItemCategory);

// Get item for editing
router.get("/items/:id/edit", protect, async (req, res) => {
  try {
    console.log("item id: ", req.params.id);
    const item = await getItem(req.params.id);
    if (!item) {
      console.log("item not found");

      // req.flash("error", "Item not found");
      return res.redirect("/admin/dashboard");
    }
    console.log("item found: ", item);
    res.render("admin/items/edit", {
      title: "Edit Item",
      item,
      // error: req.flash("error"),
      // success: req.flash("success"),
    });
  } catch (error) {
    // req.flash("error", "Error loading item");
    res.redirect("/admin/dashboard");
  }
});

// Update item with S3 upload
router.put(
  "/items/:id",
  protect,
  upload.single("image"),
  // uploadErrorHandler,
  updateItem
);

// Delete item and its S3 image
router.delete("/items/:id", protect, deleteItem);

// Error handler for this router
router.use((error, req, res, next) => {
  console.error("Admin route error:", error);
  // req.flash("error", "An error occurred while processing your request");
  res.redirect("/admin/dashboard");
});

// Orders Management Routes
router.get("/orders", protect, async (req, res) => {
  try {
    const { status, startDate, endDate, sort } = req.query;
    let query = {};

    // Apply filters
    if (status && status !== "all") {
      query.status = status;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Apply sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort) {
      switch (sort) {
        case "date-asc":
          sortOption = { createdAt: 1 };
          break;
        case "amount-desc":
          sortOption = { totalAmount: -1 };
          break;
        case "amount-asc":
          sortOption = { totalAmount: 1 };
          break;
      }
    }

    const orders = await Order.find(query)
      .sort(sortOption)
      .populate("items.itemId");

    res.render("admin/orders", {
      title: "Orders Management",
      orders,
      filters: { status, startDate, endDate, sort },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error loading orders");
  }
});

// Error handler for this router
router.use((error, req, res, next) => {
  console.error("Admin route error:", error);
  // req.flash("error", "An error occurred while processing your request");
  res.redirect("/admin/dashboard");
});

module.exports = router;
