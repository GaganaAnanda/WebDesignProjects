const jwt = require('jsonwebtoken');
const logger = require('debug')('app:middleware');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger('❌ [401] No token provided or invalid format');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object
    req.user = decoded;
    logger('✅ Token verified for user:', decoded.email);
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger('❌ [401] Token expired');
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      logger('❌ [401] Invalid token');
      return res.status(401).json({ error: 'Invalid token.' });
    }
    logger('❌ [500] Token verification error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.type !== 'admin') {
    logger('❌ [403] Access denied - Admin role required for:', req.user.email);
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  logger('✅ Admin access granted for:', req.user.email);
  next();
};

// Middleware to verify employee role
const verifyEmployee = (req, res, next) => {
  if (req.user.type !== 'employee') {
    logger('❌ [403] Access denied - Employee role required for:', req.user.email);
    return res.status(403).json({ error: 'Access denied. Employee privileges required.' });
  }
  logger('✅ Employee access granted for:', req.user.email);
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyEmployee
};
