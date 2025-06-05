// modulse/MenuItems.js

const mongoose = require('mongoose');
const MenuItemSchema = new mongoose.Schema({
    
    name: { type: String, required:true },
    price: {type: Number, required:true},
    catagory: {type: String, required: ture},
    imageUrl: {type: String }
});

module.exports = mongoose.model('MenuIntem', menuItemSchema);