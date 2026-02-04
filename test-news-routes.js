// Test des routes des actualités
const http = require('http');

console.log('🔍 TEST DES ROUTES ACTUALITÉS');
console.log('=============================\n');

// Test 1: GET /api/news
function testGetNews() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: GET /api/news...');
    
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
          console.log(`✅ GET News OK - ${news.length} actualités trouvées`);
          resolve(true);
        } catch (e) {
          console.log('❌ GET News erreur de parsing');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ GET News non accessible');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: POST /api/news
function testCreateNews() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: POST /api/news...');
    
    const newsData = JSON.stringify({
      title: 'Test Actualité',
      content: 'Ceci est un test d\'actualité créé automatiquement.',
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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log('✅ POST News OK - Actualité créée');
          resolve(true);
        } else {
          console.log(`❌ POST News erreur (${res.statusCode}): ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ POST News non accessible');
      resolve(false);
    });
    
    req.write(newsData);
    req.end();
  });
}

// Exécution des tests
async function runTests() {
  const getOK = await testGetNews();
  const postOK = await testCreateNews();
  
  console.log('\n🎯 RÉSULTATS:');
  console.log(`GET /api/news: ${getOK ? '✅' : '❌'}`);
  console.log(`POST /api/news: ${postOK ? '✅' : '❌'}`);
  
  if (getOK && postOK) {
    console.log('\n🎉 SUCCÈS! Les routes des actualités fonctionnent!');
    console.log('Vous pouvez maintenant ajouter des actualités depuis l\'admin.');
  } else {
    console.log('\n⚠️  Problème avec les routes des actualités.');
    console.log('Assurez-vous que le backend est démarré.');
  }
}

runTests();