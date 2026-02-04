// Démarrage rapide avec base de données en mémoire
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Base de données en mémoire pour les tests
let jobs = [
  {
    _id: '1',
    title: 'Développeur React',
    company: 'TechCorp',
    location: 'Paris',
    type: 'CDI',
    description: 'Développement d\'applications React',
    requirements: 'React, JavaScript, CSS',
    salary: '45000',
    sector: 'Informatique'
  }
];

let news = [];
let applications = [];
let messages = [];

// Routes API
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j._id === req.params.id);
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

app.get('/api/news', (req, res) => {
  res.json(news);
});

app.get('/api/applications', (req, res) => {
  res.json(applications);
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/auth/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { userId: 'admin', role: 'admin' },
      'test-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: { username: 'admin', role: 'admin' }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Identifiants incorrects'
    });
  }
});

app.post('/api/auth/admin/verify', (req, res) => {
  const { token } = req.body;
  
  try {
    const decoded = jwt.verify(token, 'test-secret');
    res.json({
      success: true,
      user: { username: decoded.username, role: decoded.role }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

app.post('/api/jobs', (req, res) => {
  const newJob = {
    _id: Date.now().toString(),
    ...req.body
  };
  jobs.push(newJob);
  res.json(newJob);
});

app.put('/api/jobs/:id', (req, res) => {
  const index = jobs.findIndex(j => j._id === req.params.id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...req.body };
    res.json(jobs[index]);
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

app.delete('/api/jobs/:id', (req, res) => {
  jobs = jobs.filter(j => j._id !== req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 Backend de test démarré sur le port', PORT);
  console.log('📍 API disponible sur http://localhost:' + PORT);
  console.log('🔐 Login admin: admin / admin123');
  console.log('✅ Prêt pour les tests !');
});