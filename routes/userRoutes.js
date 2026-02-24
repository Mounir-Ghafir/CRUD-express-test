const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

// GET /users
router.get('/', userController.getAllUsers);

// GET /users/:id
router.get('/:id', userController.getUserById);

// POST /users
router.post('/', validateUser, userController.createUser);

// PUT /users/:id
router.put('/:id', validateUser, userController.updateUser);

// DELETE /users/:id
router.delete('/:id', userController.deleteUser);

module.exports = router;