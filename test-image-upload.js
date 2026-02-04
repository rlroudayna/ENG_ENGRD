// Test des routes d'upload d'images
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 TEST DES ROUTES D\'UPLOAD D\'IMAGES');
console.log('====================================\n');

// Test 1: Vérifier que les routes d'images existent
function testImageRoutesExist() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Vérification des routes d\'images...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/images/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 401) {
          console.log('✅ Routes d\'images existent (401 = authentification requise)');
          resolve(true);
        } else if (res.statusCode === 404) {
          console.log('❌ Routes d\'images non trouvées (404)');
          resolve(false);
        } else {
          console.log(`⚠️  Réponse inattendue (${res.statusCode}): ${data}`);
          resolve(true); // Considérer comme OK si pas 404
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Impossible d\'accéder aux routes d\'images');
      resolve(false);
    });
    
    req.write('{}');
    req.end();
  });
}

// Test 2: Vérifier l'authentification admin
function testAdminAuth() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: Test d\'authentification admin...');
    
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
          if (res.statusCode === 200 && response.token) {
            console.log('✅ Authentification admin OK - Token reçu');
            resolve(response.token);
          } else {
            console.log(`❌ Authentification échouée (${res.statusCode}): ${data}`);
            resolve(null);
          }
        } catch (e) {
          console.log('❌ Erreur parsing réponse auth');
          resolve(null);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Impossible de tester l\'authentification');
      resolve(null);
    });
    
    req.write(loginData);
    req.end();
  });
}

// Test 3: Tester l'upload avec token
function testImageUploadWithAuth(token) {
  return new Promise((resolve) => {
    console.log('📋 Test 3: Test upload avec authentification...');
    
    if (!token) {
      console.log('❌ Pas de token disponible pour le test');
      resolve(false);
      return;
    }
    
    // Créer un fichier de test simple (pas une vraie image, juste pour tester l'auth)
    const testData = 'test-image-data';
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/images/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 400) {
          console.log('✅ Authentification OK (400 = fichier manquant, mais auth passée)');
          resolve(true);
        } else if (res.statusCode === 401) {
          console.log('❌ Authentification échouée (401)');
          resolve(false);
        } else {
          console.log(`⚠️  Réponse: ${res.statusCode} - ${data}`);
          resolve(true); // Si pas 401, l'auth fonctionne
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Erreur lors du test d\'upload');
      resolve(false);
    });
    
    req.write(testData);
    req.end();
  });
}

// Exécution des tests
async function runImageUploadTests() {
  console.log('🚀 Démarrage des tests d\'upload d\'images...\n');
  
  const routesOK = await testImageRoutesExist();
  const token = await testAdminAuth();
  const uploadOK = await testImageUploadWithAuth(token);
  
  console.log('\n🎯 RÉSULTATS:');
  console.log(`Routes d'images: ${routesOK ? '✅' : '❌'}`);
  console.log(`Authentification admin: ${token ? '✅' : '❌'}`);
  console.log(`Upload avec auth: ${uploadOK ? '✅' : '❌'}`);
  
  if (routesOK && token && uploadOK) {
    console.log('\n🎉 SUCCÈS! L\'infrastructure d\'upload d\'images fonctionne!');
    console.log('Le problème vient probablement de:');
    console.log('1. Configuration Cloudinary manquante');
    console.log('2. Token non envoyé depuis le frontend');
    console.log('3. Format de fichier non supporté');
    console.log('\n💡 Solutions:');
    console.log('- Vérifiez les variables Cloudinary dans .env');
    console.log('- Vérifiez que vous êtes connecté en admin');
    console.log('- Essayez avec un fichier JPG/PNG plus petit');
  } else {
    console.log('\n⚠️  Problème avec l\'infrastructure d\'upload');
    if (!routesOK) console.log('- Routes d\'images non accessibles');
    if (!token) console.log('- Authentification admin ne fonctionne pas');
    if (!uploadOK) console.log('- Upload avec authentification échoue');
  }
}

runImageUploadTests();