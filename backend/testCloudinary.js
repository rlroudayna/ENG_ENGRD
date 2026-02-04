require('dotenv').config();
const cloudinary = require('./config/cloudinary');

console.log('Testing Cloudinary configuration...');

// Check if credentials are set
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('❌ CLOUDINARY_CLOUD_NAME not set in .env file');
  process.exit(1);
}

if (!process.env.CLOUDINARY_API_KEY) {
  console.error('❌ CLOUDINARY_API_KEY not set in .env file');
  process.exit(1);
}

if (!process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ CLOUDINARY_API_SECRET not set in .env file');
  process.exit(1);
}

console.log('✅ All Cloudinary credentials are set');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY.substring(0, 6) + '...');

// Test Cloudinary connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed:');
    console.error(error.message);
    process.exit(1);
  });