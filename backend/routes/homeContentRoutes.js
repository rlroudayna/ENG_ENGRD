// backend/routes/homeContentRoutes.js
const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');

// Public route to get home content
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all home content from database...');
    const content = await HomeContent.find().select('-__v').sort({ section: 1 });
    
    if (!content || content.length === 0) {
      console.log('No home content found in database');
      return res.status(404).json({ 
        success: false,
        message: 'Aucun contenu trouvé' 
      });
    }
    
    console.log(`Successfully retrieved ${content.length} content sections`);
    res.status(200).json({
      success: true,
      data: content,
      count: content.length
    });
  } catch (err) {
    console.error("Erreur backend GET /api/home-content:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Erreur lors de la récupération du contenu'
    });
  }
});

// Public route to get specific section content
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    console.log(`Fetching content for section: ${section}`);
    
    const content = await HomeContent.findOne({ section }).select('-__v');
    if (!content) {
      console.log(`Section not found: ${section}`);
      return res.status(404).json({ 
        success: false,
        message: 'Section non trouvée' 
      });
    }
    
    console.log(`Successfully retrieved content for section: ${section}`);
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (err) {
    console.error("Erreur backend GET /api/home-content/:section:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Erreur lors de la récupération de la section'
    });
  }
});

// PUT route to update home content (for admin)
router.put('/', async (req, res) => {
  try {
    const { section, content } = req.body;
    
    if (!section || !content) {
      return res.status(400).json({
        success: false,
        message: 'Section et contenu requis'
      });
    }
    
    console.log(`Updating content for section: ${section}`);
    
    // Update or create the section content
    const updatedContent = await HomeContent.findOneAndUpdate(
      { section },
      { section, content },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    );
    
    console.log(`Successfully updated content for section: ${section}`);
    res.status(200).json({
      success: true,
      message: 'Contenu mis à jour avec succès',
      data: updatedContent
    });
  } catch (err) {
    console.error("Erreur backend PUT /api/home-content:", err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la mise à jour du contenu'
    });
  }
});

// DELETE route to remove a section (for admin)
router.delete('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    console.log(`Deleting content for section: ${section}`);
    
    const deletedContent = await HomeContent.findOneAndDelete({ section });
    if (!deletedContent) {
      return res.status(404).json({
        success: false,
        message: 'Section non trouvée'
      });
    }
    
    console.log(`Successfully deleted content for section: ${section}`);
    res.status(200).json({
      success: true,
      message: 'Section supprimée avec succès'
    });
  } catch (err) {
    console.error("Erreur backend DELETE /api/home-content/:section:", err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la suppression de la section'
    });
  }
});

module.exports = router;