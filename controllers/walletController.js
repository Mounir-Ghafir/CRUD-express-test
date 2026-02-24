// GET /wallets - Get all wallets
const getAllWallets = (req, res) => {
    res.json(global.wallets);
};

// GET /wallets/:id - Get a single wallet
const getWalletById = (req, res) => {
    const wallet = global.wallets.find(w => w.id === req.params.id);
    
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    res.json(wallet);
};

// POST /wallets - Create a wallet
const createWallet = (req, res) => {
    const { user_id, name } = req.body;
    
    // Check if user exists
    const userExists = global.users.some(u => u.id === user_id);
    if (!userExists) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    
    const newWallet = {
        id: global.generateId(),
        user_id,
        name,
        sold: 0
    };
    
    global.wallets.push(newWallet);
    res.status(201).json(newWallet);
};

// PUT /wallets/:id - Update a wallet
const updateWallet = (req, res) => {
    const wallet = global.wallets.find(w => w.id === req.params.id);
    
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    const { name, user_id } = req.body;
    if (name) wallet.name = name;
    if (user_id) {
        const userExists = global.users.some(u => u.id === user_id);
        if (!userExists) {
            return res.status(400).json({ error: 'User does not exist' });
        }
        wallet.user_id = user_id;
    }
    
    res.json(wallet);
};

// DELETE /wallets/:id - Delete a wallet
const deleteWallet = (req, res) => {
    const index = global.wallets.findIndex(w => w.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    const deleted = global.wallets.splice(index, 1)[0];
    res.json(deleted);
};

// POST /wallets/:id/deposit - Deposit money
const deposit = (req, res) => {
    const wallet = global.wallets.find(w => w.id === req.params.id);
    
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    wallet.sold += req.validAmount;
    res.json({ 
        message: 'Deposit successful', 
        newBalance: wallet.sold 
    });
};

// POST /wallets/:id/withdraw - Withdraw money
const withdraw = (req, res) => {
    const wallet = global.wallets.find(w => w.id === req.params.id);
    
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    if (wallet.sold < req.validAmount) {
        return res.status(400).json({ 
            error: 'Insufficient balance',
            balance: wallet.sold,
            requested: req.validAmount
        });
    }
    
    wallet.sold -= req.validAmount;
    res.json({ 
        message: 'Withdrawal successful', 
        newBalance: wallet.sold 
    });
};

module.exports = {
    getAllWallets,
    getWalletById,
    createWallet,
    updateWallet,
    deleteWallet,
    deposit,
    withdraw
};