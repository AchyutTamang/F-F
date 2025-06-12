const mongoose = require("mongoose");

// Function to generate custom ID
async function generateCustomId(model) {
  const count = await model.countDocuments({});
  return `ITEM${(count + 1).toString().padStart(4, "0")}`;
}

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageKey: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add ID field after schema definition
menuItemSchema.add({
  id: {
    type: String,
    unique: false,
    required: false,
  },
});

// Pre-save middleware to generate custom ID
menuItemSchema.pre("save", async function (next) {
  if (!this.id) {
    try {
      this.id = await generateCustomId(this.constructor);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Merch", menuItemSchema);
