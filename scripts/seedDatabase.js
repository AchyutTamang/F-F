require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Menu items data extracted from menu.html
const menuItems = [
  // Refreshers
  {
    name: "Lemonade",
    price: 170,
    category: "refreshers",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124222.826.jfif?alt=media&token=9f86f07a-fb83-4bf6-baec-444091e3ff27",
  },
  {
    name: "Mint Lemonade",
    price: 250,
    category: "refreshers",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124312.721.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },

  // Manuel Brew
  {
    name: "V60",
    price: 300,
    category: "manuel-brew",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124350.561.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },
  {
    name: "French Press",
    price: 300,
    category: "manuel-brew",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124428.933.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },

  // Hot Espresso Beverages
  {
    name: "Espresso",
    price: 170,
    category: "hot-espresso",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124506.091.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },
  {
    name: "Cappuccino",
    price: 200,
    category: "hot-espresso",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124544.003.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },

  // Pizza
  {
    name: "Margherita Pizza",
    price: 450,
    category: "pizza",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124622.644.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },
  {
    name: "Pepperoni Pizza",
    price: 550,
    category: "pizza",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124701.284.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },

  // Breakfast
  {
    name: "English Breakfast",
    price: 450,
    category: "breakfast",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124739.941.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },
  {
    name: "Pancakes",
    price: 350,
    category: "breakfast",
    image:
      "https://firebasestorage.googleapis.com/v0/b/indie-menu.appspot.com/o/products%2Fdownload%20-%202025-03-05T124818.582.jfif?alt=media&token=ed88d38f-5e58-4ae5-8833-c68537c75558",
  },

  // Would you like me to continue with more categories and items?
];

async function seedDatabase() {
  try {
    // Clear existing data
    await MenuItem.deleteMany({});
    console.log("Cleared existing menu items");

    // Insert new data
    const result = await MenuItem.insertMany(menuItems);
    console.log(`Successfully inserted ${result.length} menu items`);

    // Log categories for verification
    const categories = [...new Set(menuItems.map((item) => item.category))];
    console.log("Categories in database:", categories);

    mongoose.disconnect();
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
