const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token. User not found.' 
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};

/**
 * Check if user is an instructor
 */
const isInstructor = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Instructor privileges required.' 
    });
  }
};

/**
 * Check if user is a student
 */
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Student privileges required.' 
    });
  }
};

/**
 * Restrict access to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${roles.join(' or ')} privileges required.`
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  protect: authenticate, // Alias for consistency
  isInstructor,
  isStudent,
  restrictTo
};
