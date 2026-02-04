// Debug de l'upload d'images
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG UPLOAD D\'IMAGES');
console.log('========================\n');

// Fonction pour obtenir un token admin
async function getAdminToken() {
  return new Promise((resolve) => {
    const loginData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.token);
        } catch (e) {
          resolve(null);
        }
      });
    });
    
    req.on('error', () => resolve(null));
    req.write(loginData);
    req.end();
  });
}

// Test avec un vrai fichier multipart
async function testRealImageUpload() {
  console.log('📋 Test avec simulation de fichier image...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Impossible d\'obtenir le token admin');
    return;
  }
  
  console.log('✅ Token admin obtenu');
  
  // Créer un boundary pour multipart
  const boundary = '----formdata-boundary-' + Math.random().toString(36);
  
  // Créer le contenu multipart
  const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="image"; filename="test.jpg"',
    'Content-Type: image/jpeg',
    '',
    'fake-image-data-for-testing',
    `--${boundary}`,
    'Content-Disposition: form-data; name="folder"',
    '',
    'engrnd/test',
    `--${boundary}--`,
    ''
  ].join('\\r\\n');
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/images/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Réponse serveur (${res.statusCode}):`);
        console.log(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Upload simulé réussi !');
        } else if (res.statusCode === 400) {
          console.log('⚠️  Erreur 400 - Probablement format de fichier');
        } else if (res.statusCode === 500) {
          console.log('❌ Erreur serveur 500');
        }
        
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Erreur requête:', err.message);
      resolve();
    });
    
    req.write(formData);
    req.end();
  });
}

// Test de configuration Cloudinary
function testCloudinaryConfig() {
  console.log('📋 Test configuration Cloudinary...');
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/images/info/test',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 404) {
          console.log('✅ Route info accessible (404 normal pour image inexistante)');
        } else if (res.statusCode === 500) {
          console.log('❌ Erreur 500 - Problème configuration Cloudinary');
          console.log('Réponse:', data);
        } else {
          console.log(`📊 Réponse: ${res.statusCode}`);
        }
        resolve();
      });
    });
    
    req.on('error', () => {
      console.log('❌ Route info non accessible');
      resolve();
    });
    
    req.end();
  });
}

// Exécution des tests
async function runDebugTests() {
  console.log('🚀 Démarrage du debug...\n');
  
  await testCloudinaryConfig();
  console.log('');
  await testRealImageUpload();
  
  console.log('\n💡 SOLUTIONS POSSIBLES:');
  console.log('1. Vérifiez que vous êtes bien connecté en admin dans le navigateur');
  console.log('2. Essayez de vous déconnecter et reconnecter');
  console.log('3. Vérifiez la console du navigateur pour les erreurs');
  console.log('4. Essayez avec un fichier image plus petit (< 1MB)');
  console.log('5. Vérifiez que le fichier est bien au format JPG/PNG');
}

runDebugTests();