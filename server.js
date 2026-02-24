const express = require('express');
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(express.json());

// Simulated database (shared across all files)
global.users = [];
global.wallets = [];
global.generateId = () => Date.now().toString();

// Routes
app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Wallet API is working!' });
});

// Handle not found routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});