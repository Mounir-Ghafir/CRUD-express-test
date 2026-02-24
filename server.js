const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // For file operations

const userRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallets');

const app = express();
const PORT = 3000;

// Create data folder and files if they don't exist
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Initialize JSON files if they don't exist
const initFile = (filename, defaultData) => {
  if (!fs.existsSync(`./data/${filename}`)) {
    fs.writeFileSync(`./data/${filename}`, JSON.stringify(defaultData, null, 2));
  }
};

initFile('users.json', []);
initFile('wallets.json', []);
initFile('transactions.json', []);

app.use(bodyParser.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`📢 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Digital Wallet API 💰",
    features: {
      users: "/users - Manage users",
      wallets: "/wallets - Manage wallets (with pagination & filtering)",
      transactions: "Automatically recorded in transactions.json"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});