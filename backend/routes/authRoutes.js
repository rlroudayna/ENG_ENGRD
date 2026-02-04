// backend/routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Admin login route
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password: '***' });
    
    // Check credentials against environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log('Expected credentials:', { adminUsername, adminPassword: '***' });
    
    if (username === adminUsername && password === adminPassword) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: 'admin',
          role: 'admin',
          username: adminUsername
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );
      
      console.log('Login successful, token generated');
      
      res.json({
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          username: adminUsername,
          role: 'admin'
        }
      });
    } else {
      console.log('Login failed - incorrect credentials');
      res.status(401).json({
        success: false,
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// Verify token route
router.post('/admin/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    res.json({
      success: true,
      message: 'Token valide',
      user: {
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
});

// Logout route (mainly for clearing client-side data)
router.post('/admin/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

module.exports = router;