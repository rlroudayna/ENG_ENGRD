// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/application');
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes"); // ⭐ NOUVEAU : Routes d'authentification
const newsRoutes = require("./routes/newsRoutes"); // ⭐ Nouveau : Importe les routes des actualités publiques
const messageRoutes = require("./routes/messageRoutes"); // ⭐ NOUVEAU : Importe les routes des messages
const homeContentRoutes = require("./routes/homeContentRoutes"); // Routes pour le contenu de la page d'accueil

const app = express();


// Configure CORS to allow credentials and specific headers
app.use(cors({
  origin: ['https://engineering-rmd.com', 'https://www.engineering-rmd.com'], // React app URL
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use("/api/auth", authRoutes); // ⭐ NOUVEAU : Routes d'authentification
app.use("/api/admin", adminRoutes);
app.use("/api/news", newsRoutes); // ⭐ Nouveau : Utilise les routes des actualités publiques
app.use("/api/messages", messageRoutes);
app.use("/api/home-content", homeContentRoutes); // Routes publiques pour le contenu de la page d'accueil
app.use('/api/videos', require('./routes/videoUploadRoutes')); // Routes pour l'upload de vidéos
app.use('/api/images', require('./routes/imageUploadRoutes')); // Routes pour l'upload d'images 
// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));