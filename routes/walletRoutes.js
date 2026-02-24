const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { validateWallet, validateAmount } = require('../middleware/validation');

router.get('/', walletController.getAllWallets);

router.get('/:id', walletController.getWalletById);

router.post('/', validateWallet, walletController.createWallet);

router.put('/:id', validateWallet, walletController.updateWallet);

router.delete('/:id', walletController.deleteWallet);

router.post('/:id/deposit', validateAmount, walletController.deposit);

router.post('/:id/withdraw', validateAmount, walletController.withdraw);

module.exports = router;