// routes/menu.js
const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// Middleware to protect routes (ensure admin is logged in)
router.use((req, res, next) => {
  if (!req.session.admin) {
    return res.status(401).send('Not authorized');
  }
  next();
});

// CREATE a new menu item
router.post('/menu-items', async (req, res) => {
  try {
    const newItem = new MenuItem({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      imageUrl: req.body.imageUrl
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating item');
  }
});

// READ all menu items
router.get('/menu-items', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching items');
  }
});

// READ single item by ID (optional route)
router.get('/menu-items/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found');
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching item');
  }
});

// UPDATE an item by ID
router.put('/menu-items/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { 
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.body.imageUrl
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send('Item not found');
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating item');
  }
});

// DELETE an item by ID
router.delete('/menu-items/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('Item not found');
    res.sendStatus(204);  // No Content, successfully deleted
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting item');
  }
});

module.exports = router;