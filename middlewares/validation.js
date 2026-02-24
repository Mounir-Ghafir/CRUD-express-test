// Validation middleware for users and wallets

const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper to read users
const readUsers = () => {
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

const validationMiddleware = {
  // 1. Validate user data when creating/updating
  validateUser: (req, res, next) => {
    const { name, email, phone } = req.body;
    const errors = [];

    // Check if all fields exist
    if (!name) {
      errors.push("Name is required");
    } else if (name.length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    // Email validation
    if (!email) {
      errors.push("Email is required");
    } else {
      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push("Invalid email format");
      }
    }

    // Phone validation
    if (!phone) {
      errors.push("Phone is required");
    } else if (phone.length < 8) {
      errors.push("Phone must be at least 8 digits");
    }

    // If there are errors, return 400
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors 
      });
    }

    // If all good, continue to the controller
    next();
  },

  // 2. Validate wallet data
  validateWallet: (req, res, next) => {
    const { user_id, name } = req.body;
    const errors = [];

    // Check user_id
    if (!user_id) {
      errors.push("user_id is required");
    } else {
      // Check if user_id is a number
      if (isNaN(parseInt(user_id))) {
        errors.push("user_id must be a number");
      } else {
        // Check if user exists in database
        try {
          const users = readUsers();
          const userExists = users.some(u => u.id === parseInt(user_id));
          if (!userExists) {
            errors.push(`User with id ${user_id} does not exist`);
          }
        } catch (err) {
          console.log("Error reading users:", err);
        }
      }
    }

    // Check name
    if (!name) {
      errors.push("Wallet name is required");
    } else if (name.length < 3) {
      errors.push("Wallet name must be at least 3 characters long");
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors 
      });
    }

    next();
  },

  // 3. Validate amount for deposit/withdraw
  validateAmount: (req, res, next) => {
    const { amount } = req.body;
    const errors = [];

    // Check if amount exists
    if (amount === undefined || amount === null) {
      errors.push("Amount is required");
    } else {
      // Check if amount is a number
      if (isNaN(parseFloat(amount))) {
        errors.push("Amount must be a number");
      } else {
        // Check if amount is positive
        if (parseFloat(amount) <= 0) {
          errors.push("Amount must be greater than 0");
        }
        
        // Check if amount has too many decimals (max 2 decimals for money)
        const amountStr = amount.toString();
        if (amountStr.includes('.') && amountStr.split('.')[1].length > 2) {
          errors.push("Amount can have maximum 2 decimal places");
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors 
      });
    }

    next();
  },

  // 4. Validate ID parameter
  validateId: (req, res, next) => {
    const id = req.params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ 
        error: "Invalid ID", 
        details: "ID must be a valid number" 
      });
    }
    
    // Convert to number and attach to request
    req.params.id = parseInt(id);
    next();
  },

  // 5. Validate pagination parameters
  validatePagination: (req, res, next) => {
    const { page, limit } = req.query;
    
    // Validate page
    if (page) {
      if (isNaN(parseInt(page)) || parseInt(page) < 1) {
        return res.status(400).json({ 
          error: "Invalid pagination", 
          details: "Page must be a positive number" 
        });
      }
    }
    
    // Validate limit
    if (limit) {
      if (isNaN(parseInt(limit)) || parseInt(limit) < 1 || parseInt(limit) > 100) {
        return res.status(400).json({ 
          error: "Invalid pagination", 
          details: "Limit must be between 1 and 100" 
        });
      }
    }
    
    next();
  },

  // 6. Validate wallet update (prevent sold update directly)
  validateWalletUpdate: (req, res, next) => {
    const { sold, ...rest } = req.body;
    
    // If someone tries to update sold directly, block it
    if (sold !== undefined) {
      return res.status(400).json({ 
        error: "Invalid operation", 
        details: "Cannot update balance directly. Use deposit or withdraw endpoints." 
      });
    }
    
    // Continue with the rest of the data
    req.body = rest;
    next();
  }
};

module.exports = validationMiddleware;