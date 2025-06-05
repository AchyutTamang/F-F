// models /Admin.js

const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema ({

    email: {type: String, required:true, unique: ture},
    password: {type: String, required:true}           // this will store the hashed password
});

module.exports = mongoose.model('Admin', adminSchema);



const bcrypt = require('bcrypt');
const hashed = await bcrypt.hash('MySecretPassword', 10);
await Admin.create({ email: 'admin@example.com', password: hashed });