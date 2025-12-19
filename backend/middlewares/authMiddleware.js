const jwt = require('jsonwebtoken');

// 1. Verify Token Middleware
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach payload (id, role, email) to request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid Token' });
  }
};

// 2. Role Authorization Middleware
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access Denied: Requires one of the following roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};