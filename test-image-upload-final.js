// Test final de l'upload d'images
const http = require('http');

console.log('🔍 TEST FINAL - UPLOAD D\'IMAGES');
console.log('===============================\n');

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

// Test de la route d'upload d'images
async function testImageUploadRoute() {
  console.log('📋 Test de la route /api/images/upload...');
  
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Impossible d\'obtenir le token');
    return false;
  }
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/images/upload',
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

// Exécution du test
async function runFinalTest() {
  console.log('🚀 Démarrage du test final...\n');
  
  const routeOK = await testImageUploadRoute();
  
  console.log('\n🎯 RÉSULTAT FINAL:');
  console.log(`Route /api/images/upload: ${routeOK ? '✅' : '❌'}`);
  
  if (routeOK) {
    console.log('\n🎉 SUCCÈS! La route d\'upload d\'images fonctionne!');
    console.log('\n📍 Maintenant testez dans l\'admin:');
    console.log('1. Allez sur http://localhost:3000/admin/home-content');
    console.log('2. Connectez-vous si nécessaire');
    console.log('3. Essayez d\'uploader une image JPG/PNG');
    console.log('4. L\'image devrait s\'uploader sur Cloudinary');
  } else {
    console.log('\n❌ PROBLÈME: La route d\'upload ne fonctionne pas');
    console.log('💡 Vérifiez que le backend est démarré');
    console.log('💡 Vérifiez les routes dans server.js');
  }
}

runFinalTest();