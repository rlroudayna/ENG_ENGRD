// Diagnostic complet de l'application
const http = require('http');

console.log('🔍 DIAGNOSTIC COMPLET - ENG RND PROJECT');
console.log('=====================================\n');

// Test 1: Backend général
function testBackendHealth() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Santé du backend...');
    
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
          console.log(`✅ Backend OK - ${jobs.length} offres d'emploi`);
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

// Test 2: Routes des actualités
function testNewsRoutes() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: Routes des actualités...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/news',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const news = JSON.parse(data);
          console.log(`✅ Actualités OK - ${news.length} actualités`);
          resolve(true);
        } catch (e) {
          console.log('❌ Actualités erreur');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Routes actualités non accessibles');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 3: Routes des candidatures
function testApplicationRoutes() {
  return new Promise((resolve) => {
    console.log('📋 Test 3: Routes des candidatures...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/applications',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const applications = JSON.parse(data);
          console.log(`✅ Candidatures OK - ${applications.length} candidatures`);
          resolve(true);
        } catch (e) {
          console.log('❌ Candidatures erreur');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Routes candidatures non accessibles');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 4: Routes des messages
function testMessageRoutes() {
  return new Promise((resolve) => {
    console.log('📋 Test 4: Routes des messages...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/messages',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const messages = JSON.parse(data);
          console.log(`✅ Messages OK - ${messages.length} messages`);
          resolve(true);
        } catch (e) {
          console.log('❌ Messages erreur');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Routes messages non accessibles');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 5: Routes du contenu d'accueil
function testHomeContentRoutes() {
  return new Promise((resolve) => {
    console.log('📋 Test 5: Routes du contenu d\'accueil...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/home-content',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Contenu d\'accueil OK');
          resolve(true);
        } else {
          console.log(`❌ Contenu d'accueil erreur (${res.statusCode})`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Routes contenu d\'accueil non accessibles');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 6: Test POST actualité
function testCreateNews() {
  return new Promise((resolve) => {
    console.log('📋 Test 6: Création d\'actualité...');
    
    const newsData = JSON.stringify({
      title: 'Test Diagnostic',
      content: 'Test de création d\'actualité pour diagnostic.',
      imageUrl: ''
    });
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/news',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(newsData)
      }
    }, (res) => {
      if (res.statusCode === 201) {
        console.log('✅ Création actualité OK');
        resolve(true);
      } else {
        console.log(`❌ Création actualité erreur (${res.statusCode})`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Création actualité non accessible');
      resolve(false);
    });
    
    req.write(newsData);
    req.end();
  });
}

// Exécution de tous les tests
async function runAllTests() {
  console.log('🚀 Démarrage du diagnostic complet...\n');
  
  const backendOK = await testBackendHealth();
  const newsOK = await testNewsRoutes();
  const applicationsOK = await testApplicationRoutes();
  const messagesOK = await testMessageRoutes();
  const homeContentOK = await testHomeContentRoutes();
  const createNewsOK = await testCreateNews();
  
  console.log('\n🎯 RÉSULTATS FINAUX:');
  console.log('===================');
  console.log(`Backend général: ${backendOK ? '✅' : '❌'}`);
  console.log(`Routes actualités: ${newsOK ? '✅' : '❌'}`);
  console.log(`Routes candidatures: ${applicationsOK ? '✅' : '❌'}`);
  console.log(`Routes messages: ${messagesOK ? '✅' : '❌'}`);
  console.log(`Routes contenu accueil: ${homeContentOK ? '✅' : '❌'}`);
  console.log(`Création actualité: ${createNewsOK ? '✅' : '❌'}`);
  
  const allOK = backendOK && newsOK && applicationsOK && messagesOK && homeContentOK && createNewsOK;
  
  if (allOK) {
    console.log('\n🎉 EXCELLENT! Tout fonctionne parfaitement!');
    console.log('Votre application ENG RND est prête à l\'emploi.');
  } else {
    console.log('\n⚠️  Certains composants ont des problèmes.');
    console.log('💡 Solution: Redémarrez le backend pour appliquer tous les changements.');
    console.log('\n🔄 Pour redémarrer:');
    console.log('1. Arrêtez le backend (Ctrl+C)');
    console.log('2. cd backend');
    console.log('3. npm start');
  }
}

runAllTests();