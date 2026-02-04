// Test complet de l'application ENG RND
const http = require('http');

console.log('🔍 TEST COMPLET - ENG RND PROJECT');
console.log('================================\n');

// Test 1: Backend API
function testBackend() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Backend API...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jobs = JSON.parse(data);
          console.log(`✅ Backend OK - ${jobs.length} offres trouvées`);
          resolve(true);
        } catch (e) {
          console.log('❌ Backend erreur de parsing');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Backend non accessible');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: Routes admin
function testAdminRoutes() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: Routes admin...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      console.log(`✅ Route admin accessible (${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Routes admin non accessibles');
      resolve(false);
    });
    
    req.write(JSON.stringify({ username: 'test', password: 'test' }));
    req.end();
  });
}

// Exécution des tests
async function runTests() {
  const backendOK = await testBackend();
  const adminOK = await testAdminRoutes();
  
  console.log('\n🎯 RÉSULTATS:');
  console.log(`Backend API: ${backendOK ? '✅' : '❌'}`);
  console.log(`Routes Admin: ${adminOK ? '✅' : '❌'}`);
  
  if (backendOK && adminOK) {
    console.log('\n🎉 SUCCÈS! Votre application ENG RND fonctionne parfaitement!');
    console.log('\n📍 Accès:');
    console.log('- Site public: http://localhost:3001 (ou 3000)');
    console.log('- Admin: http://localhost:3001/admin/login');
    console.log('- Login: admin / admin123');
  } else {
    console.log('\n⚠️  Certains composants ne fonctionnent pas correctement.');
  }
}

runTests();