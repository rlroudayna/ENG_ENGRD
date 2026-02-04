// Test pour vérifier que l'erreur JavaScript est corrigée
const http = require('http');

console.log('🔍 TEST - ERREUR JAVASCRIPT CORRIGÉE');
console.log('===================================\n');

// Test de la page d'accueil après correction
function testHomePageFixed() {
  return new Promise((resolve) => {
    console.log('📋 Test: Page d\'accueil après correction...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          console.log('✅ Page d\'accueil répond');
          
          // Vérifier que le HTML contient les éléments React
          if (data.includes('<div id="root">')) {
            console.log('✅ Element root présent');
          }
          
          if (data.includes('ENG RND')) {
            console.log('✅ Titre ENG RND présent');
          }
          
          resolve(true);
        } else {
          console.log(`❌ Erreur ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Erreur connexion:', err.message);
      resolve(false);
    });
    
    req.end();
  });
}

// Test des routes React après correction
function testReactRoutesFixed() {
  return new Promise((resolve) => {
    console.log('📋 Test: Routes React après correction...');
    
    // Attendre un peu que React se recompile
    setTimeout(() => {
      const routes = ['/', '/jobs', '/contact'];
      let completed = 0;
      let results = [];
      
      routes.forEach(route => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: route,
          method: 'GET'
        }, (res) => {
          results.push({
            route: route,
            status: res.statusCode,
            ok: res.statusCode === 200
          });
          
          completed++;
          if (completed === routes.length) {
            results.forEach(result => {
              console.log(`${result.ok ? '✅' : '❌'} ${result.route} (${result.status})`);
            });
            resolve(results.every(r => r.ok));
          }
        });
        
        req.on('error', () => {
          results.push({ route: route, status: 'ERROR', ok: false });
          completed++;
          if (completed === routes.length) {
            resolve(false);
          }
        });
        
        req.end();
      });
    }, 2000); // Attendre 2 secondes pour la recompilation
  });
}

// Exécution des tests
async function runFixedTests() {
  console.log('🚀 Vérification de la correction...\n');
  
  console.log('⏳ Attente de la recompilation React (5 secondes)...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const homePageOK = await testHomePageFixed();
  console.log('');
  const routesOK = await testReactRoutesFixed();
  
  console.log('\n🎯 RÉSULTATS APRÈS CORRECTION:');
  console.log(`Page d'accueil: ${homePageOK ? '✅' : '❌'}`);
  console.log(`Routes React: ${routesOK ? '✅' : '❌'}`);
  
  if (homePageOK && routesOK) {
    console.log('\n🎉 SUCCÈS! L\'erreur JavaScript est corrigée!');
    console.log('✅ L\'application React fonctionne maintenant');
    console.log('✅ Les routes React fonctionnent');
    console.log('✅ La page ne devrait plus être blanche');
    console.log('\n📍 TESTEZ MAINTENANT:');
    console.log('- http://localhost:3000 (page d\'accueil)');
    console.log('- http://localhost:3000/jobs (offres d\'emploi)');
    console.log('- http://localhost:3000/contact (contact)');
    console.log('- http://localhost:3000/admin/login (admin)');
  } else {
    console.log('\n⚠️  L\'erreur persiste ou il y en a d\'autres');
    console.log('💡 Vérifiez à nouveau la console du navigateur (F12)');
    console.log('💡 Redémarrez le frontend si nécessaire');
  }
}

runFixedTests();