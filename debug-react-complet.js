// Debug complet de React
const http = require('http');

console.log('🔍 DEBUG REACT COMPLET');
console.log('======================\n');

// Test 1: Vérifier le contenu HTML complet
function testFullHTML() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Analyse HTML complète...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📊 Content-Length: ${data.length} caractères`);
        
        // Vérifications détaillées
        const checks = [
          { name: 'DOCTYPE html', test: data.includes('<!DOCTYPE html>') },
          { name: 'Element root', test: data.includes('<div id="root">') },
          { name: 'Scripts React', test: data.includes('/static/js/') },
          { name: 'CSS React', test: data.includes('/static/css/') },
          { name: 'Titre ENG RND', test: data.includes('<title>ENG RND</title>') },
          { name: 'Meta viewport', test: data.includes('viewport') },
          { name: 'Bundle JS', test: data.includes('bundle.js') || data.includes('/static/js/') }
        ];
        
        checks.forEach(check => {
          console.log(`${check.test ? '✅' : '❌'} ${check.name}`);
        });
        
        // Chercher les scripts
        const scriptMatches = data.match(/<script[^>]*src="([^"]*)"[^>]*>/g);
        if (scriptMatches) {
          console.log('\\n📜 Scripts trouvés:');
          scriptMatches.forEach(script => {
            console.log(`   ${script}`);
          });
        } else {
          console.log('❌ Aucun script trouvé!');
        }
        
        resolve(checks.every(c => c.test));
      });
    });
    
    req.on('error', () => {
      console.log('❌ Erreur connexion');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: Vérifier les fichiers statiques React
function testStaticFiles() {
  return new Promise((resolve) => {
    console.log('\\n📋 Test 2: Fichiers statiques React...');
    
    // Tester quelques fichiers statiques communs
    const staticPaths = [
      '/static/js/bundle.js',
      '/static/css/main.css',
      '/manifest.json',
      '/favicon.ico'
    ];
    
    let completed = 0;
    let results = [];
    
    staticPaths.forEach(path => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'GET'
      }, (res) => {
        results.push({
          path: path,
          status: res.statusCode,
          ok: res.statusCode === 200
        });
        
        completed++;
        if (completed === staticPaths.length) {
          results.forEach(result => {
            console.log(`${result.ok ? '✅' : '❌'} ${result.path} (${result.status})`);
          });
          resolve(results.some(r => r.ok)); // Au moins un fichier doit marcher
        }
      });
      
      req.on('error', () => {
        results.push({ path: path, status: 'ERROR', ok: false });
        completed++;
        if (completed === staticPaths.length) {
          resolve(false);
        }
      });
      
      req.end();
    });
  });
}

// Test 3: Vérifier la configuration du serveur de développement
function testDevServerConfig() {
  console.log('\\n📋 Test 3: Configuration serveur de développement...');
  
  return new Promise((resolve) => {
    // Tester une route qui devrait être gérée par React Router
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/nonexistent-route-test',
      method: 'GET'
    }, (res) => {
      console.log(`📊 Route inexistante: ${res.statusCode}`);
      
      if (res.statusCode === 200) {
        console.log('✅ Serveur de développement configuré pour React Router');
        resolve(true);
      } else if (res.statusCode === 404) {
        console.log('❌ Serveur ne redirige pas vers React (problème historyApiFallback)');
        resolve(false);
      } else {
        console.log(`⚠️  Réponse inattendue: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Erreur test serveur dev');
      resolve(false);
    });
    
    req.end();
  });
}

// Exécution complète
async function runCompleteDebug() {
  console.log('🚀 Démarrage du debug React complet...\\n');
  
  const htmlOK = await testFullHTML();
  const staticOK = await testStaticFiles();
  const devServerOK = await testDevServerConfig();
  
  console.log('\\n🎯 DIAGNOSTIC COMPLET:');
  console.log('======================');
  console.log(`HTML de base: ${htmlOK ? '✅' : '❌'}`);
  console.log(`Fichiers statiques: ${staticOK ? '✅' : '❌'}`);
  console.log(`Config serveur dev: ${devServerOK ? '✅' : '❌'}`);
  
  console.log('\\n💡 ANALYSE:');
  
  if (!htmlOK) {
    console.log('❌ PROBLÈME: HTML de base incorrect');
    console.log('🔧 SOLUTION: Vérifiez public/index.html');
  }
  
  if (!staticOK) {
    console.log('❌ PROBLÈME: Fichiers statiques React non générés');
    console.log('🔧 SOLUTION: Redémarrez le serveur de développement');
  }
  
  if (!devServerOK) {
    console.log('❌ PROBLÈME: Serveur de développement mal configuré');
    console.log('🔧 SOLUTION: React Router nécessite historyApiFallback');
    console.log('   Le serveur doit rediriger toutes les routes vers index.html');
  }
  
  if (htmlOK && staticOK && devServerOK) {
    console.log('✅ Configuration React semble correcte');
    console.log('💡 Il peut y avoir une erreur JavaScript runtime');
    console.log('🔧 VÉRIFIEZ:');
    console.log('   1. Console navigateur (F12) pour erreurs JS');
    console.log('   2. Onglet Network pour requêtes échouées');
    console.log('   3. Redémarrez le frontend: cd eng-rd-clean && npm start');
  }
  
  console.log('\\n🚀 ACTIONS RECOMMANDÉES:');
  console.log('=========================');
  console.log('1. Redémarrez le frontend complètement');
  console.log('2. Vérifiez la console navigateur pour nouvelles erreurs');
  console.log('3. Testez http://localhost:3000 dans le navigateur');
  console.log('4. Si page blanche persiste, il y a une erreur JS runtime');
}

runCompleteDebug();