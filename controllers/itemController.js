const MenuItem = require("../models/MenuItem");
const MenuItemCategory = require("../models/Category");
const Merch = require("../models/Merch");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/aws");
const Category = require("../models/Category");

// exports.getItems = async (req, res) => {
//   try {
//     const items = await MenuItem.find().sort({ createdAt: -1 });
//     res.render("admin/dashboard", {
//       title: "Dashboard",
//       items,
//       isAdmin: true,
//     });
//   } catch (error) {
//     res.status(500).render("error", {
//       message: "Error fetching items",
//       error,
//     });
//   }
// };
exports.getItems = async () => {
  try {
    const items = await MenuItem.find();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.log("Error fetching items:", error);

    return [];
  }
};
exports.getMerchs = async () => {
  try {
    const items = await Merch.find();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.log("Error fetching items:", error);

    return [];
  }
};
exports.getCategories = async () => {
  try {
    const items = await Category.find();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.log("Error fetching items:", error);

    return [];
  }
};
exports.getItem = async (id, category) => {
  try {
    let items;
    if (category == "merch") {
      items = await Merch.findById(id);
    } else {
      items = await MenuItem.findById(id);
    }
    if (!items) {
      // req.flash("error", "Item not found");
      return res.redirect("/admin/dashboard");
    }
    return items;
  } catch (error) {
    res.status(500).render("error", {
      message: "Error fetching items",
      error,
    });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Input validation
    if (!name || !price || !category) {
      // req.flash("error", "All fields are required");
      return res.redirect("/admin/items/new");
    }

    // Get the uploaded file info
    if (!req.file) {
      req.flash("error", "Please select an image");
      return res.redirect("/admin/items/new");
    }

    // Create the full S3 URL
    const image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;

    const newItem = new MenuItem({
      name,
      description,
      price: Number(price),
      category,
      image,
      imageKey: req.file.key,
    });

    await newItem.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).render("error", {
      message: "Error creating item",
      error,
    });
  }
};
exports.createMerch = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Input validation
    if (!name || !price || !category) {
      // req.flash("error", "All fields are required");
      return res.redirect("/admin/merch/new");
    }

    // Get the uploaded file info
    if (!req.file) {
      req.flash("error", "Please select an image");
      return res.redirect("/admin/items/new");
    }

    // Create the full S3 URL
    const image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;

    const newItem = new Merch({
      name,
      description,
      price: Number(price),
      category,
      image,
      imageKey: req.file.key,
    });

    await newItem.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).render("error", {
      message: "Error creating item",
      error,
    });
  }
};
exports.createItemCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Input validation
    if (!name) {
      return res.redirect("/admin/items/category/new");
    }

    const newItemCategory = new MenuItemCategory({
      name: String(name).toLowerCase(),
      description,
    });

    await newItemCategory.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).render("error", {
      message: "Error creating item",
      error,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;
    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      isAvailable,
    };

    if (req.file) {
      // If there's a new image, create the full S3 URL
      updateData.imageKey = req.file.key;
      updateData.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;

      // Delete old image from S3 if it exists
      const oldItem = await MenuItem.findById(req.params.id);
      if (oldItem && oldItem.imageKey) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: oldItem.imageKey,
            })
          );
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    }

    console.log("itm cate: ", category, name);

    if (category == "merch") {
      await Merch.findByIdAndUpdate(req.params.id, updateData);
    } else {
      await MenuItem.findByIdAndUpdate(req.params.id, updateData);
    }
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).render("error", {
      message: "Error updating item",
      error,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (item && item.imageKey) {
      // Delete image from S3 using stored key
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: item.imageKey,
          })
        );
      } catch (deleteError) {
        console.error("Error deleting image from S3:", deleteError);
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({
      message: "Merch deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      message: "Error deleting item",
      error: error.message,
    });
  }
};
exports.deleteMerch = async (req, res) => {
  try {
    const item = await Merch.findById(req.params.id);
    if (item && item.imageKey) {
      // Delete image from S3 using stored key
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: item.imageKey,
          })
        );
      } catch (deleteError) {
        console.error("Error deleting image from S3:", deleteError);
      }
    }

    await Merch.findByIdAndDelete(req.params.id);
    res.json({
      message: "Merch deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      message: "Error deleting item",
      error: error.message,
    });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const item = await Category.findById(req.params.id);

    await Category.findByIdAndDelete(req.params.id);
    res.json({
      message: "Merch deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      message: "Error deleting item",
      error: error.message,
    });
  }
};
