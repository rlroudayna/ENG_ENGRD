const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  author: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

module.exports = mongoose.model('News', newsSchema);