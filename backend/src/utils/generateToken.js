const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {String} userId - User's MongoDB _id
 * @param {String} role - User's role (student/instructor)
 * @returns {String} JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      id: userId,
      role: role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRY || '1d' 
    }
  );
};

module.exports = generateToken;
