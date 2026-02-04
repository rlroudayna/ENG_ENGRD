// Test des routes du contenu d'accueil
const http = require('http');

console.log('🔍 TEST DES ROUTES CONTENU D\'ACCUEIL');
console.log('====================================\n');

// Test 1: GET /api/home-content
function testGetHomeContent() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: GET /api/home-content...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/home-content',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log(`✅ GET Home Content OK - ${response.data?.length || 0} sections`);
            resolve(true);
          } else if (res.statusCode === 404) {
            console.log('⚠️  Aucun contenu trouvé (normal pour une nouvelle installation)');
            resolve(true);
          } else {
            console.log(`❌ GET Home Content erreur (${res.statusCode})`);
            resolve(false);
          }
        } catch (e) {
          console.log('❌ GET Home Content erreur de parsing');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ GET Home Content non accessible');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: PUT /api/home-content (création de contenu test)
function testUpdateHomeContent() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: PUT /api/home-content...');
    
    const testContent = JSON.stringify({
      section: 'test',
      content: {
        title: 'Test Section',
        description: 'Ceci est un test de contenu d\'accueil'
      }
    });
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/home-content',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testContent)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ PUT Home Content OK - Contenu créé/mis à jour');
          resolve(true);
        } else {
          console.log(`❌ PUT Home Content erreur (${res.statusCode}): ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ PUT Home Content non accessible');
      resolve(false);
    });
    
    req.write(testContent);
    req.end();
  });
}

// Test 3: GET section spécifique
function testGetSpecificSection() {
  return new Promise((resolve) => {
    console.log('📋 Test 3: GET /api/home-content/test...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/home-content/test',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ GET Section spécifique OK');
          resolve(true);
        } else {
          console.log(`❌ GET Section spécifique erreur (${res.statusCode})`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ GET Section spécifique non accessible');
      resolve(false);
    });
    
    req.end();
  });
}

// Exécution des tests
async function runTests() {
  const getOK = await testGetHomeContent();
  const putOK = await testUpdateHomeContent();
  const getSpecificOK = await testGetSpecificSection();
  
  console.log('\n🎯 RÉSULTATS:');
  console.log(`GET /api/home-content: ${getOK ? '✅' : '❌'}`);
  console.log(`PUT /api/home-content: ${putOK ? '✅' : '❌'}`);
  console.log(`GET /api/home-content/test: ${getSpecificOK ? '✅' : '❌'}`);
  
  if (getOK && putOK && getSpecificOK) {
    console.log('\n🎉 SUCCÈS! Les routes du contenu d\'accueil fonctionnent!');
    console.log('L\'éditeur de contenu d\'accueil devrait maintenant marcher.');
  } else {
    console.log('\n⚠️  Problème avec les routes du contenu d\'accueil.');
    console.log('Redémarrez le backend pour appliquer les changements.');
  }
}

runTests();