const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper functions to read/write JSON
const readUsers = () => {
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const userController = {
  // Create user
  createUser: (req, res) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Missing information (name, email, phone)" });
    }
    
    const users = readUsers();
    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      name,
      email,
      phone,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeUsers(users);
    
    res.status(201).json(newUser);
  },

  // Get all users
  getAllUsers: (req, res) => {
    const users = readUsers();
    res.json(users);
  },

  // Get user by ID
  getUserById: (req, res) => {
    const id = parseInt(req.params.id);
    const users = readUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  },

  // Update user
  updateUser: (req, res) => {
    const id = parseInt(req.params.id);
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    
    users[userIndex] = { ...users[userIndex], ...req.body, updatedAt: new Date().toISOString() };
    writeUsers(users);
    
    res.json(users[userIndex]);
  },

  // Delete user
  deleteUser: (req, res) => {
    const id = parseInt(req.params.id);
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    
    users.splice(userIndex, 1);
    writeUsers(users);
    
    res.status(204).send();
  }
};

module.exports = userController;