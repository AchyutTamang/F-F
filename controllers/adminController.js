const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");
const Merch = require("../models/Merch");
const itemController = require("../controllers/itemController");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.render("admin/login", {
        title: "Admin Login",
        error: "Invalid email or password",
      });
    }

    // Use the model's method to compare passwords
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.render("admin/login", {
        title: "Admin Login",
        error: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(admin._id);

    // Set JWT cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.render("admin/login", {
      title: "Admin Login",
      error: "An error occurred during login",
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.redirect("/admin/login", { isAdmin: false, title: "Admin Login" });
};

// Add these functions to adminController.js
exports.getAnalytics = async (req, res) => {
  try {
    // Popular Items
    const popularItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.itemId",
          totalOrders: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 10 },
    ]);

    // Peak Order Times
    const peakTimes = await Order.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.render("admin/analytics", {
      popularItems,
      peakTimes,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).send("Error fetching analytics");
  }
};

// Add to adminController.js
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const resetToken = generateToken(admin._id);
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await admin.save();

    res.json({ message: "Password reset instructions sent" });
  } catch (error) {
    res.status(500).json({ message: "Error requesting password reset" });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // Get counts for statistics
    const totalItems = await MenuItem.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Merch.countDocuments();
    console.log("filtered: ", req.query.category, req.query.search);

    if (req.query.category || req.query.search) {
      let query = {};
      if (req.query.category) {
        query.category = req.query.category;
      }
      if (req.query.search) {
        // query.name = { $regex: req.params.search, $options: "i" };
        query.$text = { $search: req.query.search };
      }
      const items = await MenuItem.find(query);
      const popularItems = await MenuItem.find()
        .sort({ orderCount: -1 })
        .limit(5);
      // const items = await itemController.getItems();
      console.log("admin filter item: ", items);

      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        path: "/admin/dashboard",
        isAdmin: true,
        totalItems,
        totalCategories,
        totalProducts,
        popularItems,
        items,
        isCategory: false,
      });
    } else {
      // Get popular items
      const popularItems = await MenuItem.find()
        .sort({ orderCount: -1 })
        .limit(5);
      const items = await itemController.getItems();

      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        path: "/admin/dashboard",
        isAdmin: true,
        totalItems,
        totalCategories,
        totalProducts,
        popularItems,
        items,
        isCategory: false,
      });
    }
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", {
      message: "Error loading dashboard",
      error: error,
    });
  }
};
exports.getDashboardMerch = async (req, res) => {
  try {
    // Get counts for statistics
    const totalItems = await Merch.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Merch.countDocuments();

    // Get popular items
    const popularItems = await Merch.find().sort({ orderCount: -1 }).limit(5);
    const items = await itemController.getMerchs();

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      path: "/admin/dashboard/merch",
      isAdmin: true,
      totalItems,
      totalCategories,
      totalProducts,
      popularItems,
      items,
      isCategory: false,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", {
      message: "Error loading dashboard",
      error: error,
    });
  }
};
exports.getDashboardCategory = async (req, res) => {
  try {
    // Get counts for statistics
    const totalItems = await Merch.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Merch.countDocuments();

    // Get popular items
    const popularItems = await Category.find()
      .sort({ orderCount: -1 })
      .limit(5);
    const items = await itemController.getCategories();

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      path: "/admin/dashboard/category",
      isAdmin: true,
      totalItems,
      totalCategories,
      totalProducts,
      popularItems,
      items,
      isCategory: true,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", {
      message: "Error loading dashboard",
      error: error,
    });
  }
};
