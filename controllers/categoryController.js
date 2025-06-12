const MenuItem = require("../models/MenuItem");

exports.getCategories = async (req, res) => {
  try {
    // Get unique categories from MenuItems
    const categories = await MenuItem.distinct("category");

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
