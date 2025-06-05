const session = require('express-session');

app.use(session({
secret: 'your-secret-key',
resave: false,
saveUninitialized: true,
  cookie: { secure: false } // Adjust as needed
}));