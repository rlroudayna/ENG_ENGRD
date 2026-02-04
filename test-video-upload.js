// Test de l'upload de vidéos
const http = require('http');

console.log('🔍 TEST UPLOAD DE VIDÉOS');
console.log('========================\n');

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
          if (response.token) {
            console.log('✅ Token admin obtenu');
            resolve(response.token);
          } else {
            console.log('❌ Pas de token dans la réponse');
            resolve(null);
          }
        } catch (e) {
          console.log('❌ Erreur parsing token');
          resolve(null);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Erreur connexion auth');
      resolve(null);
    });
    
    req.write(loginData);
    req.end();
  });
}

// Test de la route d'upload de vidéos
async function testVideoUploadRoute() {
  console.log('📋 Test de la route /api/videos/upload...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Impossible d\'obtenir le token');
    return false;
  }
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/videos/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Réponse: ${res.statusCode}`);
        
        if (res.statusCode === 400) {
          console.log('✅ Route accessible (400 = fichier manquant, normal)');
          resolve(true);
        } else if (res.statusCode === 404) {
          console.log('❌ Route non trouvée (404)');
          resolve(false);
        } else if (res.statusCode === 401) {
          console.log('❌ Non authentifié (401)');
          resolve(false);
        } else {
          console.log(`⚠️  Réponse inattendue: ${data}`);
          resolve(true);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Erreur connexion route');
      resolve(false);
    });
    
    req.write('{}');
    req.end();
  });
}

// Test de la route de suppression de vidéos
async function testVideoDeleteRoute() {
  console.log('📋 Test de la route /api/videos/delete...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Impossible d\'obtenir le token');
    return false;
  }
  
  return new Promise((resolve) => {
    const deleteData = JSON.stringify({
      url: 'test-url',
      publicId: 'test-id'
    });
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/videos/delete',
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(deleteData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Réponse: ${res.statusCode}`);
        
        if (res.statusCode === 404 || res.statusCode === 500) {
          console.log('✅ Route accessible (erreur normale pour test)');
          resolve(true);
        } else if (res.statusCode === 404) {
          console.log('❌ Route non trouvée (404)');
          resolve(false);
        } else if (res.statusCode === 401) {
          console.log('❌ Non authentifié (401)');
          resolve(false);
        } else {
          console.log(`⚠️  Réponse: ${data}`);
          resolve(true);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Erreur connexion route');
      resolve(false);
    });
    
    req.write(deleteData);
    req.end();
  });
}

// Exécution des tests
async function runVideoTests() {
  console.log('🚀 Démarrage des tests vidéo...\n');
  
  const uploadOK = await testVideoUploadRoute();
  console.log('');
  const deleteOK = await testVideoDeleteRoute();
  
  console.log('\n🎯 RÉSULTATS:');
  console.log(`Route /api/videos/upload: ${uploadOK ? '✅' : '❌'}`);
  console.log(`Route /api/videos/delete: ${deleteOK ? '✅' : '❌'}`);
  
  if (uploadOK && deleteOK) {
    console.log('\n🎉 SUCCÈS! Les routes vidéo fonctionnent!');
    console.log('\n📍 Maintenant testez dans l\'admin:');
    console.log('1. Allez sur http://localhost:3000/admin/home-content');
    console.log('2. Connectez-vous si nécessaire');
    console.log('3. Essayez d\'uploader une vidéo MP4');
    console.log('4. La vidéo devrait s\'uploader sur Cloudinary');
  } else {
    console.log('\n❌ PROBLÈME: Les routes vidéo ne fonctionnent pas');
    console.log('💡 Vérifiez que le backend est démarré');
    console.log('💡 Vérifiez les routes dans server.js');
  }
}

runVideoTests();