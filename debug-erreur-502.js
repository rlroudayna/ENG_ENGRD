// Debug de l'erreur 502
const http = require('http');

console.log('🔍 DEBUG ERREUR 502 - IMAGES');
console.log('============================\n');

// Test 1: Vérifier si le backend répond
function testBackendHealth() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Santé du backend...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET'
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend répond correctement');
        resolve(true);
      } else {
        console.log(`⚠️  Backend répond avec code ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Backend ne répond pas');
      resolve(false);
    });
    
    req.setTimeout(5000);
    req.on('timeout', () => {
      console.log('⏰ Backend timeout');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: Vérifier l'authentification
async function testAuth() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: Authentification admin...');
    
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
        if (res.statusCode === 200) {
          console.log('✅ Authentification OK');
          resolve(true);
        } else {
          console.log(`❌ Authentification échouée (${res.statusCode})`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Erreur authentification');
      resolve(false);
    });
    
    req.write(loginData);
    req.end();
  });
}

// Test 3: Vérifier les routes d'images
async function testImageRoute() {
  return new Promise((resolve) => {
    console.log('📋 Test 3: Route images...');
    
    // D'abord obtenir un token
    getToken().then(token => {
      if (!token) {
        console.log('❌ Pas de token pour tester la route');
        resolve(false);
        return;
      }
      
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
        console.log(`📊 Route images répond: ${res.statusCode}`);
        
        if (res.statusCode === 400) {
          console.log('✅ Route images accessible (400 = fichier manquant)');
          resolve(true);
        } else if (res.statusCode === 502) {
          console.log('❌ Erreur 502 sur route images');
          resolve(false);
        } else if (res.statusCode === 500) {
          console.log('❌ Erreur 500 sur route images');
          resolve(false);
        } else {
          console.log(`⚠️  Code inattendu: ${res.statusCode}`);
          resolve(false);
        }
      });
      
      req.on('error', () => {
        console.log('❌ Erreur connexion route images');
        resolve(false);
      });
      
      req.write('{}');
      req.end();
    });
  });
}

// Fonction helper pour obtenir un token
function getToken() {
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

// Exécution des tests
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic 502...\n');
  
  const backendOK = await testBackendHealth();
  console.log('');
  const authOK = await testAuth();
  console.log('');
  const imageRouteOK = await testImageRoute();
  
  console.log('\n🎯 DIAGNOSTIC:');
  console.log(`Backend général: ${backendOK ? '✅' : '❌'}`);
  console.log(`Authentification: ${authOK ? '✅' : '❌'}`);
  console.log(`Route images: ${imageRouteOK ? '✅' : '❌'}`);
  
  console.log('\n💡 ANALYSE:');
  if (!backendOK) {
    console.log('❌ PROBLÈME: Backend ne répond pas');
    console.log('🔧 SOLUTION: Redémarrez le backend');
    console.log('   cd backend && npm start');
  } else if (!authOK) {
    console.log('❌ PROBLÈME: Authentification cassée');
    console.log('🔧 SOLUTION: Vérifiez les routes auth');
  } else if (!imageRouteOK) {
    console.log('❌ PROBLÈME: Route images a un problème 502');
    console.log('🔧 SOLUTIONS POSSIBLES:');
    console.log('   1. Problème Cloudinary (vérifiez les credentials)');
    console.log('   2. Erreur dans le code de traitement d\'images');
    console.log('   3. Problème de mémoire serveur');
    console.log('   4. Redémarrez le backend');
  } else {
    console.log('✅ TOUT SEMBLE OK côté serveur');
    console.log('💡 L\'erreur 502 peut venir de:');
    console.log('   1. Cloudinary temporairement indisponible');
    console.log('   2. Fichier image corrompu');
    console.log('   3. Problème réseau temporaire');
    console.log('🔧 ESSAYEZ:');
    console.log('   1. Redémarrez le backend');
    console.log('   2. Essayez avec une autre image');
    console.log('   3. Vérifiez les logs du backend');
  }
}

runDiagnostic();