const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Permet n'importe quel type de contenu
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HomeContent', homeContentSchema);