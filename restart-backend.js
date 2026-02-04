// Script pour redémarrer le backend
const { spawn } = require('child_process');
const http = require('http');

console.log('🔄 REDÉMARRAGE DU BACKEND');
console.log('========================\n');

// Fonction pour tester si le backend répond
function testBackend() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

async function restartBackend() {
  console.log('📋 Vérification de l\'état du backend...');
  
  const isRunning = await testBackend();
  
  if (isRunning) {
    console.log('⚠️  Backend déjà en cours d\'exécution');
    console.log('💡 Arrêtez le backend manuellement (Ctrl+C) puis relancez-le');
    console.log('\n🚀 Pour redémarrer le backend :');
    console.log('1. Arrêtez le processus actuel (Ctrl+C)');
    console.log('2. Tapez: cd backend');
    console.log('3. Tapez: npm start');
  } else {
    console.log('📋 Démarrage du backend...');
    
    const backend = spawn('npm', ['start'], {
      cwd: './backend',
      stdio: 'inherit',
      shell: true
    });
    
    backend.on('error', (err) => {
      console.error('❌ Erreur lors du démarrage:', err.message);
    });
    
    // Attendre un peu puis tester
    setTimeout(async () => {
      const isNowRunning = await testBackend();
      if (isNowRunning) {
        console.log('✅ Backend redémarré avec succès!');
      }
    }, 3000);
  }
}

restartBackend();