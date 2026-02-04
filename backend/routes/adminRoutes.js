// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/application");
const Message = require("../models/Message");
const News = require("../models/News");
const HomeContent = require("../models/HomeContent");
const { authenticateAdmin } = require("../middleware/authMiddleware");

// Apply authentication middleware to all admin routes
router.use(authenticateAdmin);

// --- Routes pour les Offres d'Emploi ---

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/jobs:", err);
    res.status(500).json({ error: 'Erreur lors de la récupération des offres.' });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error("Erreur backend POST /api/admin/jobs:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/jobs/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Erreur backend PUT /api/admin/jobs/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Offre supprimée" });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/jobs/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Routes pour les Candidatures ---

// ⭐ MODIFICATION IMPORTANTE : Utilise .populate('jobId') pour obtenir les détails de l'offre liée
router.get("/applications", async (req, res) => {
  try {
    // Trouve toutes les candidatures et "remplit" le champ 'jobId' avec les détails de l'offre
    const apps = await Application.find().populate({
      path: 'jobId',
      model: 'Job', // Explicitly specify the model
      strictPopulate: false
    });
    
    // Transform the data to ensure proper serialization
    const transformedApps = apps.map(app => {
      const appObj = app.toObject();
      return {
        ...appObj,
        job: appObj.jobId // Add a 'job' field for easier frontend access
      };
    });
    

    
    res.status(200).json(transformedApps);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/applications:", err);
    res.status(500).json({ error: 'Erreur lors de la récupération des candidatures.' });
  }
});

// ⭐ NOUVEAU : Supprimer une candidature (si ce n'était pas déjà là)
router.delete("/applications/:id", async (req, res) => {
  try {
    const result = await Application.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Candidature non trouvée' });
    res.json({ message: 'Candidature supprimée' });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/applications/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Routes pour les Messages de Contact ---

router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/messages:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    const result = await Message.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Message non trouvé' });
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/messages/:id:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- Routes pour les Actualités ---

router.get('/news', async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/news:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/news', async (req, res) => {
  const newsItem = new News({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
  });
  try {
    const newNewsItem = await newsItem.save();
    res.status(201).json(newNewsItem);
  } catch (err) {
    console.error("Erreur backend POST /api/admin/news:", err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/news/:id', async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
    }, { new: true });
    
    if (!updated) {
      return res.status(404).json({ message: 'Actualité non trouvée' });
    }
    
    res.json(updated);
  } catch (err) {
    console.error("Erreur backend PUT /api/admin/news/:id:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/news/:id', async (req, res) => {
  try {
    const result = await News.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.json({ message: 'Actualité supprimée' });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/news/:id:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- Routes pour le Contenu de la Page d'Accueil ---

router.get('/home-content', async (req, res) => {
  try {
    const content = await HomeContent.find();
    res.status(200).json(content);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/home-content:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/home-content/:section', async (req, res) => {
  try {
    const content = await HomeContent.findOne({ section: req.params.section });
    if (!content) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }
    res.status(200).json(content);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/home-content/:section:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/home-content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;
    
    // Validate section
    const validSections = ['hero', 'about', 'expertise', 'sectors', 'values'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Section invalide' });
    }
    
    // Validate content
    if (!content || typeof content !== 'object' || Object.keys(content).length === 0) {
      return res.status(400).json({ message: 'Le contenu ne peut pas être vide' });
    }
    
    console.log(`Updating home content section: ${section} by user: ${req.user?.username || 'unknown'}`);
    
    const updated = await HomeContent.findOneAndUpdate(
      { section },
      { 
        content,
        updatedAt: new Date(),
        updatedBy: req.user?.username || 'admin'
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    console.log(`Successfully updated section: ${section}, version: ${updated.version}`);
    res.json({
      success: true,
      message: 'Contenu mis à jour avec succès',
      data: updated
    });
  } catch (err) {
    console.error("Erreur backend PUT /api/admin/home-content/:section:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Erreur lors de la mise à jour du contenu'
    });
  }
});

module.exports = router;