// Diagnostic complet de l'application
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC COMPLET - APPLICATION ENG RND');
console.log('===========================================\n');

// Test 1: Vérifier que le backend tourne
function testBackend() {
  return new Promise((resolve) => {
    console.log('📋 Test 1: Backend sur port 5000...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jobs = JSON.parse(data);
            console.log(`✅ Backend OK - ${jobs.length} offres trouvées`);
            resolve(true);
          } catch (e) {
            console.log('❌ Backend répond mais données invalides');
            resolve(false);
          }
        } else {
          console.log(`❌ Backend erreur ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Backend ne répond pas sur port 5000');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Backend timeout');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Test 2: Vérifier que le frontend tourne
function testFrontend() {
  return new Promise((resolve) => {
    console.log('📋 Test 2: Frontend sur port 3000...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
            console.log('✅ Frontend répond avec du HTML');
            resolve(true);
          } else {
            console.log('❌ Frontend répond mais pas de HTML');
            resolve(false);
          }
        } else {
          console.log(`❌ Frontend erreur ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Frontend ne répond pas sur port 3000');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Frontend timeout');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Test 3: Vérifier les fichiers critiques
function testCriticalFiles() {
  console.log('📋 Test 3: Fichiers critiques...');
  
  const criticalFiles = [
    'eng-rd-clean/package.json',
    'eng-rd-clean/src/App.js',
    'eng-rd-clean/src/index.js',
    'eng-rd-clean/public/index.html',
    'backend/package.json',
    'backend/server.js',
    'backend/.env'
  ];
  
  let allExist = true;
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ MANQUANT: ${file}`);
      allExist = false;
    }
  });
  
  return allExist;
}

// Test 4: Vérifier les dépendances
function testDependencies() {
  console.log('📋 Test 4: Dépendances...');
  
  // Vérifier node_modules frontend
  const frontendNodeModules = fs.existsSync('eng-rd-clean/node_modules');
  console.log(`Frontend node_modules: ${frontendNodeModules ? '✅' : '❌'}`);
  
  // Vérifier node_modules backend
  const backendNodeModules = fs.existsSync('backend/node_modules');
  console.log(`Backend node_modules: ${backendNodeModules ? '✅' : '❌'}`);
  
  return frontendNodeModules && backendNodeModules;
}

// Test 5: Vérifier la configuration
function testConfiguration() {
  console.log('📋 Test 5: Configuration...');
  
  try {
    // Vérifier package.json frontend
    const frontendPackage = JSON.parse(fs.readFileSync('eng-rd-clean/package.json', 'utf8'));
    console.log(`✅ Frontend package.json - ${frontendPackage.name}`);
    
    // Vérifier .env backend
    const backendEnv = fs.readFileSync('backend/.env', 'utf8');
    const hasMongoUri = backendEnv.includes('MONGO_URI');
    const hasPort = backendEnv.includes('PORT');
    console.log(`Backend .env - MongoDB: ${hasMongoUri ? '✅' : '❌'}, Port: ${hasPort ? '✅' : '❌'}`);
    
    return hasMongoUri && hasPort;
  } catch (e) {
    console.log('❌ Erreur lecture configuration');
    return false;
  }
}

// Test 6: Vérifier les processus
function testProcesses() {
  console.log('📋 Test 6: Processus en cours...');
  
  // Note: Ce test est approximatif car on ne peut pas facilement lister les processus en Node.js
  console.log('💡 Vérifiez manuellement:');
  console.log('   - Backend: cd backend && npm start');
  console.log('   - Frontend: cd eng-rd-clean && npm start');
  
  return true;
}

// Exécution de tous les tests
async function runCompleteCheck() {
  console.log('🚀 Démarrage du diagnostic complet...\n');
  
  const backendOK = await testBackend();
  console.log('');
  
  const frontendOK = await testFrontend();
  console.log('');
  
  const filesOK = testCriticalFiles();
  console.log('');
  
  const depsOK = testDependencies();
  console.log('');
  
  const configOK = testConfiguration();
  console.log('');
  
  testProcesses();
  
  console.log('\n🎯 RÉSULTATS FINAUX:');
  console.log('===================');
  console.log(`Backend (port 5000): ${backendOK ? '✅' : '❌'}`);
  console.log(`Frontend (port 3000): ${frontendOK ? '✅' : '❌'}`);
  console.log(`Fichiers critiques: ${filesOK ? '✅' : '❌'}`);
  console.log(`Dépendances: ${depsOK ? '✅' : '❌'}`);
  console.log(`Configuration: ${configOK ? '✅' : '❌'}`);
  
  console.log('\n💡 DIAGNOSTIC:');
  
  if (!backendOK) {
    console.log('❌ PROBLÈME CRITIQUE: Backend ne fonctionne pas');
    console.log('🔧 SOLUTION:');
    console.log('   cd backend');
    console.log('   npm install');
    console.log('   npm start');
  }
  
  if (!frontendOK) {
    console.log('❌ PROBLÈME CRITIQUE: Frontend ne fonctionne pas');
    console.log('🔧 SOLUTION:');
    console.log('   cd eng-rd-clean');
    console.log('   npm install');
    console.log('   npm start');
  }
  
  if (!filesOK) {
    console.log('❌ PROBLÈME: Fichiers manquants');
    console.log('🔧 SOLUTION: Vérifiez l\'intégrité du projet');
  }
  
  if (!depsOK) {
    console.log('❌ PROBLÈME: Dépendances manquantes');
    console.log('🔧 SOLUTION: Installez les dépendances');
    console.log('   cd backend && npm install');
    console.log('   cd eng-rd-clean && npm install');
  }
  
  if (backendOK && frontendOK && filesOK && depsOK && configOK) {
    console.log('✅ TOUT SEMBLE OK!');
    console.log('💡 Si la page est blanche:');
    console.log('   1. Vérifiez la console du navigateur (F12)');
    console.log('   2. Actualisez la page (Ctrl+F5)');
    console.log('   3. Vérifiez l\'URL: http://localhost:3000');
  }
  
  console.log('\n🚀 COMMANDES DE DÉMARRAGE:');
  console.log('==========================');
  console.log('Terminal 1 (Backend):');
  console.log('   cd backend');
  console.log('   npm start');
  console.log('');
  console.log('Terminal 2 (Frontend):');
  console.log('   cd eng-rd-clean');
  console.log('   npm start');
  console.log('');
  console.log('Puis ouvrez: http://localhost:3000');
}

runCompleteCheck();