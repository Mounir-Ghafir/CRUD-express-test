const validateUser = (req, res, next) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
        return res.status(400).json({ 
            error: 'name, email and phone are required'
        });
    }
    
    next();
};

const validateWallet = (req, res, next) => {
    const { user_id, name } = req.body;
    
    if (!user_id || !name) {
        return res.status(400).json({ 
            error: 'user_id and name are required' 
        });
    }
    
    next();
};

const validateAmount = (req, res, next) => {
    const amount = req.body.amount;
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ 
            error: 'The amount must be positive'
        });
    }
    
    req.validAmount = amount;
    next();
};

module.exports = {
    validateUser,
    validateWallet,
    validateAmount
};