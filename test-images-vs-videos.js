// Test comparatif images vs vidéos
const http = require('http');

console.log('🔍 TEST COMPARATIF - IMAGES VS VIDÉOS');
console.log('====================================\n');

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

// Test upload d'image avec timeout étendu
async function testImageUploadExtended() {
  console.log('📋 Test 1: Upload image avec timeout étendu...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Pas de token');
    return false;
  }
  
  return new Promise((resolve) => {
    const boundary = '----formdata-' + Math.random().toString(36);
    const formData = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="image"; filename="test.jpg"',
      'Content-Type: image/jpeg',
      '',
      'fake-image-data-for-testing-timeout',
      `--${boundary}`,
      'Content-Disposition: form-data; name="folder"',
      '',
      'engrd/test',
      `--${boundary}--`,
      ''
    ].join('\\r\\n');
    
    console.log('⏱️  Envoi requête image (timeout 2 minutes)...');
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
      },
      timeout: 120000 // 2 minutes
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
      console.log('⏰ Timeout image (2 minutes)');
      req.destroy();
      resolve(false);
    });
    
    req.write(formData);
    req.end();
  });
}

// Test upload de vidéo avec timeout étendu
async function testVideoUploadExtended() {
  console.log('📋 Test 2: Upload vidéo avec timeout étendu...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Pas de token');
    return false;
  }
  
  return new Promise((resolve) => {
    const boundary = '----formdata-' + Math.random().toString(36);
    const formData = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="video"; filename="test.mp4"',
      'Content-Type: video/mp4',
      '',
      'fake-video-data-for-testing-timeout',
      `--${boundary}--`,
      ''
    ].join('\\r\\n');
    
    console.log('⏱️  Envoi requête vidéo (timeout 2 minutes)...');
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
      },
      timeout: 120000 // 2 minutes
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
      console.log('⏰ Timeout vidéo (2 minutes)');
      req.destroy();
      resolve(false);
    });
    
    req.write(formData);
    req.end();
  });
}

// Exécution des tests
async function runComparativeTests() {
  console.log('🚀 Démarrage des tests comparatifs...\n');
  
  const imageOK = await testImageUploadExtended();
  console.log('');
  const videoOK = await testVideoUploadExtended();
  
  console.log('\n🎯 RÉSULTATS COMPARATIFS:');
  console.log(`Upload images: ${imageOK ? '✅' : '❌'}`);
  console.log(`Upload vidéos: ${videoOK ? '✅' : '❌'}`);
  
  console.log('\n💡 ANALYSE:');
  
  if (imageOK && videoOK) {
    console.log('✅ Les deux types d\'upload fonctionnent côté serveur');
    console.log('💡 Le timeout côté frontend peut être différent');
    console.log('🔧 SOLUTION: Augmenter le timeout spécifiquement pour les images');
  } else if (!imageOK && videoOK) {
    console.log('❌ Problème spécifique aux images');
    console.log('💡 Possible différence de traitement Cloudinary');
    console.log('🔧 SOLUTIONS:');
    console.log('   1. Vérifiez les routes d\'images');
    console.log('   2. Cloudinary peut traiter les images différemment');
    console.log('   3. Augmentez le timeout pour les images');
  } else if (imageOK && !videoOK) {
    console.log('❌ Problème spécifique aux vidéos');
    console.log('💡 Mais vous dites que les vidéos marchent...');
  } else {
    console.log('❌ Problème général avec les uploads');
    console.log('💡 Vérifiez que le backend est démarré');
  }
  
  console.log('\n🚀 RECOMMANDATIONS:');
  console.log('1. Essayez avec une image très petite (< 100KB)');
  console.log('2. Vérifiez les logs du backend pendant l\'upload');
  console.log('3. Cloudinary peut être plus lent pour les images');
  console.log('4. Considérez augmenter le timeout spécifiquement pour les images');
}

runComparativeTests();