// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const router = express.Router();

// Login handler
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminUser = await Admin.findOne({ email: email });
    if (!adminUser) {
      return res.status(401).send('No such user');  // admin not found
    }
    const passwordMatch = await bcrypt.compare(password, adminUser.password);
    if (!passwordMatch) {
      return res.status(401).send('Incorrect password');
    }
    // Credentials are valid:
    req.session.admin = { id: adminUser._id, email: adminUser.email };  // store admin info in session
    res.redirect('/admin');  // redirect to admin panel
  } catch (err) {
    console.error('Login error', err);
    res.status(500).send('Server error');
  }
});

// Logout handler
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');  // clears the session cookie
    res.redirect('/login.html');     // redirect to login page
  });
});

module.exports = router;