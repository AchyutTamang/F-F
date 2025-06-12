const MenuItem = require("../models/MenuItem");
const MenuItemCategory = require("../models/Category");

exports.getFilteredItems = async (req, res) => {
  try {
    console.log("menu in menuController");

    const { search, category, minPrice, maxPrice } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    query.isAvailable = true; // Ensure only available items are fetched

    const items = await MenuItem.find(query);

    if (req.xhr) {
      return res.json(items);
    }

    res.render("pages/menu", {
      title: "Menu",
      menuItems: items,
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
      },
      isAdmin: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    // Get unique categories from MenuItems
    const categories = await MenuItemCategory.distinct("name");

    // Transform categories into value-label pairs
    const formattedCategories = categories.map((category) => ({
      value: category.toLowerCase(),
      label: category.charAt(0).toUpperCase() + category.slice(1),
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};
