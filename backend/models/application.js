const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: false // Optionnel pour les candidatures spontanées
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  otherStatus: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: false
  },
  cv: {
    type: String, // Nom du fichier CV
    required: true
  },
  coverLetter: {
    type: String // Nom du fichier lettre de motivation (optionnel)
  },
  applicationStatus: {
    type: String,
    enum: ['nouveau', 'lu', 'traité', 'rejeté'],
    default: 'nouveau'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

module.exports = mongoose.model('Application', applicationSchema);