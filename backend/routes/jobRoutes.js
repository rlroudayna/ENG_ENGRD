// backend/routes/jobRoutes.js
const express = require('express');
const Job = require('../models/Job'); // Importe le modèle Job
const router = express.Router();

// Route pour obtenir toutes les offres d'emploi
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Erreur backend GET /api/jobs:", err); // Ajout de log
    res.status(500).json({ error: 'Erreur lors de la récupération des offres.' });
  }
});

// Route pour obtenir une offre d'emploi par son ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // Cherche l'offre par son ID
    if (!job) {
      console.log(`Offre non trouvée pour l'ID: ${req.params.id}`); // Ajout de log
      return res.status(404).json({ message: 'Offre d\'emploi non trouvée' });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error(`Erreur backend GET /api/jobs/${req.params.id}:`, err); // Ajout de log
    // Vérifie si l'erreur est due à un format d'ID invalide
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID d\'offre invalide.' });
    }
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'offre.' });
  }
});

// Route pour ajouter une nouvelle offre d'emploi
router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("Erreur backend POST /api/jobs:", err); // Ajout de log
    res.status(400).json({ error: 'Erreur lors de l’ajout de l’offre.' });
  }
});

module.exports = router;