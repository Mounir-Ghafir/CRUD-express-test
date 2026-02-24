const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validationMiddleware = require('../middlewares/validation');

// Apply validation middleware to routes
router.post('/', 
  validationMiddleware.validateUser, 
  userController.createUser
);

router.get('/', userController.getAllUsers);

router.get('/:id', 
  validationMiddleware.validateId, 
  userController.getUserById
);

router.put('/:id', 
  validationMiddleware.validateId,
  validationMiddleware.validateUser, 
  userController.updateUser
);

router.delete('/:id', 
  validationMiddleware.validateId, 
  userController.deleteUser
);

module.exports = router;