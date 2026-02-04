// Test des routes des candidatures
const http = require('http');

console.log('🔍 TEST DES ROUTES CANDIDATURES');
console.log('===============================\n');

// Test 1: GET /api/applications
function testGetApplications() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: GET /api/applications...');
    
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
          console.log(`✅ GET Applications OK - ${applications.length} candidatures trouvées`);
          resolve(true);
        } catch (e) {
          console.log('❌ GET Applications erreur de parsing');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ GET Applications non accessible');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: Vérifier que le dossier uploads existe
function testUploadsFolder() {
  const fs = require('fs');
  const path = require('path');
  
  console.log('📋 Test 2: Vérification du dossier uploads...');
  
  const uploadsPath = path.join(__dirname, 'backend', 'uploads');
  
  if (fs.existsSync(uploadsPath)) {
    console.log('✅ Dossier uploads existe');
    return true;
  } else {
    console.log('❌ Dossier uploads manquant');
    console.log('💡 Création du dossier uploads...');
    try {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log('✅ Dossier uploads créé');
      return true;
    } catch (e) {
      console.log('❌ Impossible de créer le dossier uploads');
      return false;
    }
  }
}

// Exécution des tests
async function runTests() {
  const uploadsOK = testUploadsFolder();
  const getOK = await testGetApplications();
  
  console.log('\n🎯 RÉSULTATS:');
  console.log(`Dossier uploads: ${uploadsOK ? '✅' : '❌'}`);
  console.log(`GET /api/applications: ${getOK ? '✅' : '❌'}`);
  
  if (uploadsOK && getOK) {
    console.log('\n🎉 SUCCÈS! Les routes des candidatures sont prêtes!');
    console.log('Vous pouvez maintenant soumettre des candidatures.');
  } else {
    console.log('\n⚠️  Problème avec les candidatures.');
    console.log('Assurez-vous que le backend est démarré et redémarré.');
  }
}

runTests();