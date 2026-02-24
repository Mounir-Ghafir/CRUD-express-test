// GET /users - Get all users
const getAllUsers = (req, res) => {
    res.json(global.users);
};

// GET /users/:id - Get a single user
const getUserById = (req, res) => {
    const user = global.users.find(u => u.id === req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
};

// POST /users - Create a user
const createUser = (req, res) => {
    const { name, email, phone } = req.body;
    
    const newUser = {
        id: global.generateId(),
        name,
        email,
        phone
    };
    
    global.users.push(newUser);
    res.status(201).json(newUser);
};

// PUT /users/:id - Update a user
const updateUser = (req, res) => {
    const user = global.users.find(u => u.id === req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, email, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    res.json(user);
};

// DELETE /users/:id - Delete a user
const deleteUser = (req, res) => {
    const index = global.users.findIndex(u => u.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const deleted = global.users.splice(index, 1)[0];
    res.json(deleted);
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};