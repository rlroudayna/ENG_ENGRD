#!/usr/bin/env node

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('🔍 DIAGNOSTIC BACKEND ENG RND');
console.log('================================');

// 1. Vérifier les variables d'environnement
console.log('📋 Variables d\'environnement:');
console.log('PORT:', process.env.PORT || 'NON DÉFINI');
console.log('MONGO_URI:', process.env.MONGO_URI || 'NON DÉFINI');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DÉFINI' : 'NON DÉFINI');
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME || 'NON DÉFINI');
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'DÉFINI' : 'NON DÉFINI');

// 2. Tester la connexion MongoDB
console.log('\n🗄️  Test connexion MongoDB...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/engrd')
  .then(() => {
    console.log('✅ MongoDB connecté avec succès');
  })
  .catch(err => {
    console.log('❌ Erreur MongoDB:', err.message);
  });

// 3. Créer un serveur de test minimal
const app = express();

app.use(cors());
app.use(express.json());

// Route de test
app.get('/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend fonctionne',
    timestamp: new Date().toISOString()
  });
});

// Route auth de test
app.post('/api/auth/admin/login', (req, res) => {
  console.log('🔐 Tentative de login:', req.body);
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ 
      success: true, 
      message: 'Login réussi',
      token: 'test-token-123'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Identifiants incorrects' 
    });
  }
});

// Route jobs de test
app.get('/api/jobs', (req, res) => {
  res.json([
    { id: 1, title: 'Test Job 1', company: 'Test Company' },
    { id: 2, title: 'Test Job 2', company: 'Test Company 2' }
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Serveur de test démarré sur le port ${PORT}`);
  console.log(`📍 Testez: http://localhost:${PORT}/test`);
  console.log(`📍 API Jobs: http://localhost:${PORT}/api/jobs`);
  console.log(`📍 API Login: POST http://localhost:${PORT}/api/auth/admin/login`);
  console.log('\n✨ Si vous voyez ce message, le backend peut démarrer !');
});

// Gestion des erreurs
process.on('uncaughtException', (err) => {
  console.log('❌ Erreur non gérée:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log('❌ Promesse rejetée:', err.message);
  process.exit(1);
});