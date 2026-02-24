const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const validationMiddleware = require('../middlewares/validation');

// Basic CRUD with validation
router.post('/', 
  validationMiddleware.validateWallet, 
  walletController.createWallet
);

router.get('/', 
  validationMiddleware.validatePagination, 
  walletController.getAllWallets
);

router.get('/:id', 
  validationMiddleware.validateId, 
  walletController.getWalletById
);

router.put('/:id', 
  validationMiddleware.validateId,
  validationMiddleware.validateWalletUpdate,
  validationMiddleware.validateWallet, 
  walletController.updateWallet
);

router.delete('/:id', 
  validationMiddleware.validateId, 
  walletController.deleteWallet
);

// Financial operations with validation
router.post('/:id/deposit', 
  validationMiddleware.validateId,
  validationMiddleware.validateAmount, 
  walletController.deposit
);

router.post('/:id/withdraw', 
  validationMiddleware.validateId,
  validationMiddleware.validateAmount, 
  walletController.withdraw
);

// Transaction history
router.get('/:id/transactions', 
  validationMiddleware.validateId,
  validationMiddleware.validatePagination,
  walletController.getWalletTransactions
);

module.exports = router;