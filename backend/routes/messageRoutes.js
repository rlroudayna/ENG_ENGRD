// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Importe le modèle Message

// Route POST pour soumettre un message via le formulaire de contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation basique
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Le nom, l\'email, l\'objet et le message sont obligatoires.' });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Erreur lors de la soumission du message :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la soumission du message.', error: error.message });
  }
});

module.exports = router;

// GET route to fetch all messages (for admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ receivedAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// DELETE route to remove a message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
});