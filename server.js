const express = require('express');
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(express.json());


global.users = [];
global.wallets = [];
global.generateId = () => Date.now().toString();


app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Wallet API!' });
});


app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});