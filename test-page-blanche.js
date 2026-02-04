// Test pour diagnostiquer la page blanche
const http = require('http');

console.log('🔍 DIAGNOSTIC PAGE BLANCHE');
console.log('==========================\n');

// Test 1: Récupérer le HTML de la page d'accueil
function testHomePage() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Contenu de la page d\'accueil...');
    
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
        console.log(`📊 Content-Type: ${res.headers['content-type']}`);
        
        if (data.includes('<div id="root">')) {
          console.log('✅ Element root trouvé');
        } else {
          console.log('❌ Element root manquant');
        }
        
        if (data.includes('ENG RND')) {
          console.log('✅ Titre ENG RND trouvé');
        } else {
          console.log('❌ Titre ENG RND manquant');
        }
        
        if (data.includes('<script')) {
          console.log('✅ Scripts JavaScript trouvés');
        } else {
          console.log('❌ Pas de scripts JavaScript');
        }
        
        // Afficher un extrait du HTML
        console.log('\\n📄 Extrait HTML:');
        console.log(data.substring(0, 500) + '...');
        
        resolve(data.length > 0);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Erreur:', err.message);
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: Vérifier les routes React
function testReactRoutes() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: Routes React...');
    
    const routes = ['/', '/jobs', '/contact', '/admin/login'];
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
        results.push({
          route: route,
          status: 'ERROR',
          ok: false
        });
        completed++;
        if (completed === routes.length) {
          resolve(false);
        }
      });
      
      req.end();
    });
  });
}

// Exécution des tests
async function runPageBlancheTests() {
  console.log('🚀 Démarrage du diagnostic page blanche..\\n');
  
  const homePageOK = await testHomePage();
  console.log('');
  const routesOK = await testReactRoutes();
  
  console.log('\\n🎯 RÉSULTATS:');
  console.log(`Page d'accueil: ${homePageOK ? '✅' : '❌'}`);
  console.log(`Routes React: ${routesOK ? '✅' : '❌'}`);
  
  console.log('\\n💡 SOLUTIONS POUR PAGE BLANCHE:');
  console.log('================================');
  
  if (homePageOK && routesOK) {
    console.log('✅ Le serveur fonctionne correctement');
    console.log('');
    console.log('🔧 VÉRIFICATIONS NAVIGATEUR:');
    console.log('1. Ouvrez F12 (Outils développeur)');
    console.log('2. Regardez l\'onglet Console pour les erreurs');
    console.log('3. Regardez l\'onglet Network pour les requêtes');
    console.log('4. Essayez Ctrl+F5 (actualisation forcée)');
    console.log('5. Essayez en navigation privée');
    console.log('');
    console.log('🌐 URLS À TESTER:');
    console.log('- http://localhost:3000 (site public)');
    console.log('- http://localhost:3000/admin/login (admin)');
  } else {
    console.log('❌ Problème côté serveur');
    console.log('');
    console.log('🔧 SOLUTIONS:');
    console.log('1. Redémarrez le frontend:');
    console.log('   cd eng-rd-clean');
    console.log('   npm start');
    console.log('');
    console.log('2. Vérifiez les erreurs dans le terminal');
    console.log('3. Vérifiez que le port 3000 est libre');
  }
}

runPageBlancheTests();