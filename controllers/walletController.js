const fs = require('fs');
const path = require('path');

const WALLETS_FILE = path.join(__dirname, '../data/wallets.json');
const TRANSACTIONS_FILE = path.join(__dirname, '../data/transactions.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper functions
const readWallets = () => {
  const data = fs.readFileSync(WALLETS_FILE);
  return JSON.parse(data);
};

const writeWallets = (wallets) => {
  fs.writeFileSync(WALLETS_FILE, JSON.stringify(wallets, null, 2));
};

const readTransactions = () => {
  const data = fs.readFileSync(TRANSACTIONS_FILE);
  return JSON.parse(data);
};

const writeTransactions = (transactions) => {
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
};

const readUsers = () => {
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Record transaction
const recordTransaction = (walletId, type, amount, balance) => {
  const transactions = readTransactions();
  const newTransaction = {
    id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
    walletId,
    type, // 'deposit' or 'withdraw'
    amount,
    balance,
    date: new Date().toISOString()
  };
  transactions.push(newTransaction);
  writeTransactions(transactions);
  return newTransaction;
};

const walletController = {
  // Create wallet
  createWallet: (req, res) => {
    const { user_id, name } = req.body;
    
    if (!user_id || !name) {
      return res.status(400).json({ error: "Missing user_id or name" });
    }
    
    // Check if user exists
    const users = readUsers();
    const userExists = users.some(u => u.id === parseInt(user_id));
    if (!userExists) {
      return res.status(400).json({ error: "User does not exist" });
    }
    
    const wallets = readWallets();
    const newWallet = {
      id: wallets.length > 0 ? wallets[wallets.length - 1].id + 1 : 1,
      user_id: parseInt(user_id),
      name,
      sold: 0,
      createdAt: new Date().toISOString()
    };
    
    wallets.push(newWallet);
    writeWallets(wallets);
    
    res.status(201).json(newWallet);
  },

  // Get all wallets WITH PAGINATION AND FILTERING
  getAllWallets: (req, res) => {
    let wallets = readWallets();
    
    // FILTERING
    const { user_id, min_balance, max_balance, name } = req.query;
    
    // Filter by user_id
    if (user_id) {
      wallets = wallets.filter(w => w.user_id === parseInt(user_id));
    }
    
    // Filter by name (partial match, case insensitive)
    if (name) {
      wallets = wallets.filter(w => 
        w.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // Filter by minimum balance
    if (min_balance) {
      wallets = wallets.filter(w => w.sold >= parseFloat(min_balance));
    }
    
    // Filter by maximum balance
    if (max_balance) {
      wallets = wallets.filter(w => w.sold <= parseFloat(max_balance));
    }
    
    // PAGINATION
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedWallets = wallets.slice(startIndex, endIndex);
    
    // Pagination info
    const paginationInfo = {
      total: wallets.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(wallets.length / limit),
      hasNext: endIndex < wallets.length,
      hasPrev: page > 1
    };
    
    res.json({
      pagination: paginationInfo,
      data: paginatedWallets
    });
  },

  // Get wallet by ID
  getWalletById: (req, res) => {
    const id = parseInt(req.params.id);
    const wallets = readWallets();
    const wallet = wallets.find(w => w.id === id);
    
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    // Include transaction history for this wallet
    const transactions = readTransactions();
    const walletTransactions = transactions.filter(t => t.walletId === id);
    
    res.json({
      ...wallet,
      transactions: walletTransactions
    });
  },

  // Update wallet
  updateWallet: (req, res) => {
    const id = parseInt(req.params.id);
    const wallets = readWallets();
    const walletIndex = wallets.findIndex(w => w.id === id);
    
    if (walletIndex === -1) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    // Don't allow updating sold directly (use deposit/withdraw)
    const { sold, ...updateData } = req.body;
    
    wallets[walletIndex] = { 
      ...wallets[walletIndex], 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    writeWallets(wallets);
    
    res.json(wallets[walletIndex]);
  },

  // Delete wallet
  deleteWallet: (req, res) => {
    const id = parseInt(req.params.id);
    const wallets = readWallets();
    const walletIndex = wallets.findIndex(w => w.id === id);
    
    if (walletIndex === -1) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    wallets.splice(walletIndex, 1);
    writeWallets(wallets);
    
    res.status(204).send();
  },

  // Deposit
  deposit: (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }
    
    const wallets = readWallets();
    const walletIndex = wallets.findIndex(w => w.id === id);
    
    if (walletIndex === -1) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    // Update balance
    wallets[walletIndex].sold = wallets[walletIndex].sold + amount;
    wallets[walletIndex].updatedAt = new Date().toISOString();
    writeWallets(wallets);
    
    // Record transaction
    const transaction = recordTransaction(id, 'deposit', amount, wallets[walletIndex].sold);
    
    res.json({
      message: "✅ Deposit successful!",
      newBalance: wallets[walletIndex].sold,
      transaction: transaction
    });
  },

  // Withdraw
  withdraw: (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }
    
    const wallets = readWallets();
    const walletIndex = wallets.findIndex(w => w.id === id);
    
    if (walletIndex === -1) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    if (wallets[walletIndex].sold < amount) {
      return res.status(400).json({ 
        error: "❌ Insufficient balance!",
        currentBalance: wallets[walletIndex].sold,
        requestedAmount: amount
      });
    }
    
    // Update balance
    wallets[walletIndex].sold = wallets[walletIndex].sold - amount;
    wallets[walletIndex].updatedAt = new Date().toISOString();
    writeWallets(wallets);
    
    // Record transaction
    const transaction = recordTransaction(id, 'withdraw', amount, wallets[walletIndex].sold);
    
    res.json({
      message: "✅ Withdrawal successful!",
      newBalance: wallets[walletIndex].sold,
      transaction: transaction
    });
  },

  // Get transaction history for a wallet
  getWalletTransactions: (req, res) => {
    const id = parseInt(req.params.id);
    const wallets = readWallets();
    const wallet = wallets.find(w => w.id === id);
    
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    
    const transactions = readTransactions();
    const walletTransactions = transactions.filter(t => t.walletId === id);
    
    // Pagination for transactions
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedTransactions = walletTransactions.slice(startIndex, endIndex);
    
    res.json({
      wallet: wallet,
      pagination: {
        total: walletTransactions.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(walletTransactions.length / limit)
      },
      transactions: paginatedTransactions
    });
  }
};

module.exports = walletController;