const getAllUsers = (req, res) => {
    res.json(global.users);
};


const getUserById = (req, res) => {
    const user = global.users.find(u => u.id === req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
};


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


const deleteUser = (req, res) => {
    const index = global.users.findIndex(u => u.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'User not found'});
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