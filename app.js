const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const MenuItem = require("./models/MenuItem");
const adminRoutes = require("./routes/adminRoutes");
const menuRoutes = require("./routes/menuRoutes");
const mainRoutes = require("./routes/mainRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const e = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));
app.use(express.static("public/photo/F&F.svg"));

// Session and flash setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(flash());

// Method override for PUT/DELETE
app.use(methodOverride("_method"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");

// Admin initialization function
async function initializeAdmin() {
  try {
    console.log("Checking for admin existence...");
    const adminExists = await Admin.findOne({});

    if (!adminExists) {
      console.log("Admin does not exist, creating one...");
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        phoneNo: process.env.ADMIN_PHONE,
        password: process.env.ADMIN_PASSWORD,
      });

      await admin.save();
      console.log("Admin created successfully");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error during admin initialization:", error);
  }
}

// Database connection with admin initialization
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB");
  const adminExists = await Admin.find({});
  if (adminExists.length == 0) {
    // await Admin.deleteMany({});
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      phoneNo: process.env.ADMIN_PHONE,
      password: process.env.ADMIN_PASSWORD,
    });

    await admin.save();
    console.log("Created new admin");
    process.exit();
  } else {
    console.log("Admin already exists, skipping creation");
  }
});

// Routes in order of specificity
app.use("/admin", adminRoutes); // Admin routes
app.use("/menu", menuRoutes); // Menu specific routes
app.use("/cart", cartRoutes); // Cart routes
app.use("/checkout", checkoutRoutes);
app.use("/", mainRoutes); // Main routes last

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 3000;
app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });
