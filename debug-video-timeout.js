// Debug du timeout vidéo
const http = require('http');

console.log('🔍 DEBUG TIMEOUT VIDÉO');
console.log('======================\n');

// Test des timeouts et limites
async function testVideoUploadLimits() {
  console.log('📋 Test des limites d\'upload vidéo...');
  
  // Obtenir un token admin
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Impossible d\'obtenir le token');
    return;
  }
  
  // Test avec une requête qui prend du temps (simulation)
  return new Promise((resolve) => {
    console.log('⏱️  Test de timeout (attente 10 secondes)...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/videos/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 secondes pour ce test
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Réponse après attente: ${res.statusCode}`);
        resolve();
      });
    });
    
    req.on('timeout', () => {
      console.log('⏰ Timeout détecté côté client (15s)');
      req.destroy();
      resolve();
    });
    
    req.on('error', (err) => {
      if (err.code === 'ECONNRESET') {
        console.log('🔌 Connexion fermée par le serveur');
      } else {
        console.log('❌ Erreur:', err.message);
      }
      resolve();
    });
    
    // Envoyer une requête vide pour déclencher l'erreur 400 rapidement
    req.write('{}');
    req.end();
  });
}

// Obtenir un token admin
async function getAdminToken() {
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

// Test de la taille de fichier
function testFileSizeRecommendations() {
  console.log('📋 Recommandations pour les vidéos:');
  console.log('');
  console.log('🎯 TAILLES RECOMMANDÉES:');
  console.log('- ✅ Petite vidéo: < 5MB (upload rapide)');
  console.log('- ✅ Vidéo moyenne: 5-15MB (upload normal)');
  console.log('- ⚠️  Grande vidéo: 15-30MB (upload lent)');
  console.log('- ❌ Très grande: > 30MB (risque timeout)');
  console.log('');
  console.log('🎬 FORMATS OPTIMAUX:');
  console.log('- ✅ MP4 H.264 (meilleure compatibilité)');
  console.log('- ✅ Résolution: 1080p max recommandée');
  console.log('- ✅ Durée: < 2 minutes pour éviter les gros fichiers');
  console.log('');
  console.log('⚡ CONSEILS POUR ÉVITER LES TIMEOUTS:');
  console.log('1. Compressez vos vidéos avant upload');
  console.log('2. Utilisez des outils comme HandBrake ou FFmpeg');
  console.log('3. Réduisez la résolution si nécessaire');
  console.log('4. Vérifiez votre connexion internet');
}

// Exécution des tests
async function runDebugTests() {
  console.log('🚀 Démarrage du debug timeout...\n');
  
  await testVideoUploadLimits();
  console.log('');
  testFileSizeRecommendations();
  
  console.log('\n💡 SOLUTIONS AU TIMEOUT:');
  console.log('');
  console.log('🔧 SOLUTIONS IMMÉDIATES:');
  console.log('1. Utilisez une vidéo plus petite (< 10MB)');
  console.log('2. Compressez votre vidéo avant upload');
  console.log('3. Vérifiez votre connexion internet');
  console.log('4. Essayez à un moment avec moins de trafic');
  console.log('');
  console.log('🛠️  SOLUTIONS TECHNIQUES:');
  console.log('- J\'ai augmenté le timeout à 10 minutes');
  console.log('- Le serveur accepte jusqu\'à 50MB');
  console.log('- Cloudinary optimise automatiquement');
  console.log('');
  console.log('🎯 RECOMMANDATION:');
  console.log('Essayez avec une vidéo MP4 de moins de 10MB pour commencer.');
}

runDebugTests();