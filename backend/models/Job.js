// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['CDI', 'CDD', 'Freelance', 'Stage'],
    required: true
  },
  sector: {
    type: String,
    enum: [
      'Automobile', 'Aéronautique', 'Ferroviaire', 'Spatial', 'Militaire', 
      'Énergie', 'Santé', 'IT', 'RH', 'Marketing', 'Finance', 'Commercial', 
      'Communication', 'Juridique', 'Qualité', 'Logistique', 'Production', 
      'R&D', 'Consulting', 'Formation'
    ],
    required: true
  },
  salary: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  deadline: {
    type: Date
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
