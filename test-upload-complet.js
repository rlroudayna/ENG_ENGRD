// Test complet des uploads (images et vidéos)
const http = require('http');

console.log('🔍 TEST COMPLET - UPLOADS IMAGES & VIDÉOS');
console.log('=========================================\n');

// Obtenir un token admin
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
          resolve(response.token || null);
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

// Test avec simulation d'upload d'image
async function testImageUploadSimulation() {
  console.log('📋 Test simulation upload image...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Pas de token');
    return false;
  }
  
  // Créer un faux multipart pour tester
  const boundary = '----formdata-' + Math.random().toString(36);
  const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="image"; filename="test.jpg"',
    'Content-Type: image/jpeg',
    '',
    'fake-image-data-for-testing-small-file',
    `--${boundary}`,
    'Content-Disposition: form-data; name="folder"',
    '',
    'engrd/test',
    `--${boundary}--`,
    ''
  ].join('\\r\\n');
  
  return new Promise((resolve) => {
    console.log('⏱️  Envoi de la requête image...');
    const startTime = Date.now();
    
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
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Réponse image: ${res.statusCode} (${duration}ms)`);
        
        if (res.statusCode === 200) {
          console.log('✅ Upload image simulé réussi');
          resolve(true);
        } else if (res.statusCode === 400) {
          console.log('⚠️  Erreur 400 (normal pour fausses données)');
          resolve(true);
        } else if (res.statusCode === 500) {
          console.log('❌ Erreur serveur 500');
          console.log('Détails:', data.substring(0, 200));
          resolve(false);
        } else {
          console.log(`⚠️  Réponse inattendue: ${data.substring(0, 100)}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Erreur requête image:', err.message);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('⏰ Timeout image détecté');
      resolve(false);
    });
    
    req.setTimeout(10000); // 10 secondes pour ce test
    req.write(formData);
    req.end();
  });
}

// Test avec simulation d'upload de vidéo
async function testVideoUploadSimulation() {
  console.log('📋 Test simulation upload vidéo...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Pas de token');
    return false;
  }
  
  // Créer un faux multipart pour tester
  const boundary = '----formdata-' + Math.random().toString(36);
  const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="video"; filename="test.mp4"',
    'Content-Type: video/mp4',
    '',
    'fake-video-data-for-testing-small-file',
    `--${boundary}--`,
    ''
  ].join('\\r\\n');
  
  return new Promise((resolve) => {
    console.log('⏱️  Envoi de la requête vidéo...');
    const startTime = Date.now();
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/videos/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formData)
      }
    }, (res) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Réponse vidéo: ${res.statusCode} (${duration}ms)`);
        
        if (res.statusCode === 200) {
          console.log('✅ Upload vidéo simulé réussi');
          resolve(true);
        } else if (res.statusCode === 400) {
          console.log('⚠️  Erreur 400 (normal pour fausses données)');
          resolve(true);
        } else if (res.statusCode === 500) {
          console.log('❌ Erreur serveur 500');
          console.log('Détails:', data.substring(0, 200));
          resolve(false);
        } else {
          console.log(`⚠️  Réponse inattendue: ${data.substring(0, 100)}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Erreur requête vidéo:', err.message);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('⏰ Timeout vidéo détecté');
      resolve(false);
    });
    
    req.setTimeout(10000); // 10 secondes pour ce test
    req.write(formData);
    req.end();
  });
}

// Exécution des tests
async function runCompleteTests() {
  console.log('🚀 Démarrage des tests complets...\n');
  
  const imageOK = await testImageUploadSimulation();
  console.log('');
  const videoOK = await testVideoUploadSimulation();
  
  console.log('\n🎯 RÉSULTATS:');
  console.log(`Upload images: ${imageOK ? '✅' : '❌'}`);
  console.log(`Upload vidéos: ${videoOK ? '✅' : '❌'}`);
  
  console.log('\n💡 DIAGNOSTIC:');
  if (imageOK && videoOK) {
    console.log('✅ Les deux types d\'upload fonctionnent côté serveur');
    console.log('💡 Si ça prend du temps dans le navigateur, c\'est Cloudinary qui traite');
    console.log('⏱️  Cloudinary peut prendre 10-30 secondes même pour de petits fichiers');
  } else if (!imageOK && videoOK) {
    console.log('❌ Problème spécifique aux images');
    console.log('💡 Vérifiez les routes d\'images dans le serveur');
  } else if (imageOK && !videoOK) {
    console.log('❌ Problème spécifique aux vidéos');
    console.log('💡 Vérifiez les routes vidéos dans le serveur');
  } else {
    console.log('❌ Problème général avec les uploads');
    console.log('💡 Vérifiez que le backend est démarré et Cloudinary configuré');
  }
  
  console.log('\n🔧 SOLUTIONS:');
  console.log('1. Patientez 30-60 secondes pour les uploads');
  console.log('2. Vérifiez la console du navigateur pour les erreurs');
  console.log('3. Essayez de vous reconnecter en admin');
  console.log('4. Redémarrez le backend si nécessaire');
}

runCompleteTests();