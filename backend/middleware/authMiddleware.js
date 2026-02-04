// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers.authorization);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    console.log('Auth middleware - Token extracted:', token ? 'Token present' : 'No token');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ 
        success: false,
        message: 'Token d\'accès requis' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    console.log('Auth middleware - Token decoded:', decoded);
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      console.log('Auth middleware - User is not admin:', decoded.role);
      return res.status(403).json({ 
        success: false,
        message: 'Accès administrateur requis' 
      });
    }
    
    // Add user info to request
    req.user = decoded;
    console.log('Auth middleware - Authentication successful');
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expiré, veuillez vous reconnecter' 
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide' 
      });
    } else {
      console.error('Erreur d\'authentification:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur serveur lors de l\'authentification' 
      });
    }
  }
};

module.exports = { authenticateAdmin };