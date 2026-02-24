const getAllWallets = (req, res) => {
    res.json(global.wallets);
};

const getWalletById = (req, res) => {
    const wallet = global.wallets.find(w => w.id === req.params.id);
    
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    res.json(wallet);
};


const createWallet = (req, res) => {
    const { user_id, name } = req.body;
    
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


const deleteWallet = (req, res) => {
    const index = global.wallets.findIndex(w => w.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    const deleted = global.wallets.splice(index, 1)[0];
    res.json(deleted);
};


const deposit = (req, res) => {
    const wallet = global.wallets.find(w => w.id === req.params.id);
    
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    wallet.sold += req.validAmount;
    res.json({ 
        message: 'Deposit successful', 
        newSold: wallet.sold 
    });
};


const withdraw = (req, res) => {
    const wallet = global.wallets.find(w => w.id === req.params.id);
    
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    
    if (wallet.sold < req.validAmount) {
        return res.status(400).json({ 
            error: 'Insufficient balance',
            sold: wallet.sold,
            requested: req.validAmount
        });
    }
    
    wallet.sold -= req.validAmount;
    res.json({ 
        message: 'Withdrawal successful', 
        newSold: wallet.sold 
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