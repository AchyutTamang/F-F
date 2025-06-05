// server.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use (express.jason());
app.use(express.utlencoded({extended: true}));

app.use(express.static('public'));

app.use(session({
    secret: 'your-secret-key',    // replace with a strong secret for sign cookies
    resave: false,
    saveUninitialized: false,


    // cookie: {secure: ture } // use secure cookies in production (HTTPS)
}));


// Import routes (actual files to be created later)
// const authRoutes = require('./routes/auth');
// const menuRoutes = require('./routes/menu');
// app.use('/api', authRoutes);
// app.use('/api', menuRoutes);


// Serve admin panel page (protected route)

app.get('/admin', (req, res) => {
    if (req.session.admin) {
        return res.redirect('/login.html');  // if not logged in, redirect to login

    }

    res.sendFile(path.join(__dirname, 'public/admin.html'));
});



// Connect to MongoDB and start server
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurantDB';
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch(err => console.error('Database connection error:', err));


// for auth.js 

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// session middleware for security

function ensureAdmin(req, res, next) {
    if (!req.session.admin) {
    return res.status(401).send('Unauthorized');
    }
    next();
}

// for routes/menu.js

const menuRoutes = require('./routes/menu');
app.use('/api', menuRoutes);
