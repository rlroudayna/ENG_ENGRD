const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

mongoose.connect('mongodb://127.0.0.1:27017/engrd')
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('You can now use: mongodb://127.0.0.1:27017/engrd');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:', err.message);
    console.log('Make sure MongoDB service is running: net start MongoDB');
    process.exit(1);
  });