const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { validateWallet, validateAmount } = require('../middleware/validation');

// GET /wallets
router.get('/', walletController.getAllWallets);

// GET /wallets/:id
router.get('/:id', walletController.getWalletById);

// POST /wallets
router.post('/', validateWallet, walletController.createWallet);

// PUT /wallets/:id
router.put('/:id', validateWallet, walletController.updateWallet);

// DELETE /wallets/:id
router.delete('/:id', walletController.deleteWallet);

// POST /wallets/:id/deposit
router.post('/:id/deposit', validateAmount, walletController.deposit);

// POST /wallets/:id/withdraw
router.post('/:id/withdraw', validateAmount, walletController.withdraw);

module.exports = router;