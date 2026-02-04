// Test de synchronisation entre l'éditeur admin et la page publique
const http = require('http');

console.log('🔍 TEST DE SYNCHRONISATION ADMIN ↔ PUBLIC');
console.log('==========================================\n');

// Test 1: Créer du contenu via l'API admin
function createTestContent() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Création de contenu test via API admin...');
    
    const testContent = JSON.stringify({
      section: 'hero',
      content: {
        title: 'TEST SYNCHRONISATION - ' + new Date().toLocaleTimeString(),
        subtitle: 'Ce titre a été modifié via l\'API pour tester la synchronisation.',
        presentationTitle: 'Test de synchronisation',
        presentationText1: 'Si vous voyez ce texte sur la page d\'accueil, la synchronisation fonctionne !',
        presentationText2: 'Modifié le ' + new Date().toLocaleString()
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
          console.log('✅ Contenu test créé avec succès');
          resolve(true);
        } else {
          console.log(`❌ Erreur création contenu (${res.statusCode}): ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Impossible de créer le contenu test');
      resolve(false);
    });
    
    req.write(testContent);
    req.end();
  });
}

// Test 2: Vérifier que le contenu est accessible via l'API publique
function verifyPublicAccess() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: Vérification accès public au contenu...');
    
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
          if (res.statusCode === 200 && response.data) {
            const heroSection = response.data.find(item => item.section === 'hero');
            if (heroSection && heroSection.content.title.includes('TEST SYNCHRONISATION')) {
              console.log('✅ Contenu test trouvé dans l\'API publique');
              resolve(true);
            } else {
              console.log('⚠️  Contenu test non trouvé dans l\'API publique');
              resolve(false);
            }
          } else {
            console.log(`❌ Erreur accès public (${res.statusCode})`);
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Erreur parsing réponse publique');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Impossible d\'accéder à l\'API publique');
      resolve(false);
    });
    
    req.end();
  });
}

// Test 3: Restaurer le contenu original
function restoreOriginalContent() {
  return new Promise((resolve) => {
    console.log('📋 Test 3: Restauration du contenu original...');
    
    const originalContent = JSON.stringify({
      section: 'hero',
      content: {
        title: 'Bienvenue chez ENG RND',
        subtitle: 'Votre partenaire en ingénierie automobile, expert en systèmes embarqués, modélisation et validation.',
        presentationTitle: 'Votre partenaire en ingénierie automobile',
        presentationText1: 'Depuis 2018 à Casablanca, ENG RND propose des solutions de modélisation, simulation et logiciels embarqués.',
        presentationText2: 'Nous engageons performance, innovation et qualité dans tous nos projets.'
      }
    });
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/home-content',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(originalContent)
      }
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Contenu original restauré');
        resolve(true);
      } else {
        console.log(`❌ Erreur restauration (${res.statusCode})`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Impossible de restaurer le contenu');
      resolve(false);
    });
    
    req.write(originalContent);
    req.end();
  });
}

// Exécution des tests
async function runSyncTests() {
  console.log('🚀 Démarrage des tests de synchronisation...\n');
  
  const createOK = await createTestContent();
  
  if (createOK) {
    // Attendre un peu pour la synchronisation
    console.log('⏳ Attente de la synchronisation (2 secondes)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const verifyOK = await verifyPublicAccess();
    const restoreOK = await restoreOriginalContent();
    
    console.log('\n🎯 RÉSULTATS FINAUX:');
    console.log('===================');
    console.log(`Création contenu: ${createOK ? '✅' : '❌'}`);
    console.log(`Vérification publique: ${verifyOK ? '✅' : '❌'}`);
    console.log(`Restauration: ${restoreOK ? '✅' : '❌'}`);
    
    if (createOK && verifyOK && restoreOK) {
      console.log('\n🎉 PARFAIT! La synchronisation fonctionne!');
      console.log('✅ Les modifications dans l\'admin apparaissent sur le site public');
      console.log('✅ Vous pouvez maintenant modifier le contenu d\'accueil');
      console.log('\n📍 Pour tester:');
      console.log('1. Allez sur http://localhost:3000/admin/home-content');
      console.log('2. Modifiez du contenu et sauvegardez');
      console.log('3. Allez sur http://localhost:3000 pour voir les changements');
    } else {
      console.log('\n⚠️  Problème de synchronisation détecté');
      console.log('💡 Vérifiez que le frontend et backend sont bien démarrés');
    }
  } else {
    console.log('\n❌ Impossible de créer le contenu test');
    console.log('💡 Vérifiez que le backend est démarré et accessible');
  }
}

runSyncTests();