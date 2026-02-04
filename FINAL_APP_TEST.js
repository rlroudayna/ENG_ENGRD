// FINAL_APP_TEST.js - Test complet de l'application avant déploiement
const fs = require('fs');
const path = require('path');

console.log('🚀 DÉBUT DU TEST FINAL DE L\'APPLICATION ENG R&D');
console.log('=' .repeat(60));

// 1. Vérification des fichiers critiques
const criticalFiles = [
  // Frontend React
  'eng-rd-clean/src/App.js',
  'eng-rd-clean/src/index.js',
  'eng-rd-clean/package.json',
  
  // Pages principales
  'eng-rd-clean/src/pages/Home.jsx',
  'eng-rd-clean/src/pages/Jobs.jsx',
  'eng-rd-clean/src/pages/Contact.jsx',
  'eng-rd-clean/src/pages/Actualites.jsx',
  'eng-rd-clean/src/pages/JobDetails.jsx',
  
  // Composants critiques
  'eng-rd-clean/src/components/Navbar.jsx',
  'eng-rd-clean/src/components/Footer.jsx',
  'eng-rd-clean/src/components/JobList.jsx',
  'eng-rd-clean/src/components/ApplicationForm.jsx',
  'eng-rd-clean/src/components/CustomSelect.jsx',
  
  // Admin
  'eng-rd-clean/src/admin/Login.jsx',
  'eng-rd-clean/src/admin/components/JobListAdmin.jsx',
  'eng-rd-clean/src/admin/components/ApplicationList.jsx',
  'eng-rd-clean/src/admin/components/ContactList.jsx',
  'eng-rd-clean/src/admin/components/NewsList.jsx',
  'eng-rd-clean/src/admin/components/HomeContentEditor.jsx',
  'eng-rd-clean/src/admin/components/AdminStyles.css',
  
  // CSS critiques
  'eng-rd-clean/src/components/Footer.css',
  'eng-rd-clean/src/components/JobList.css',
  'eng-rd-clean/src/components/ApplicationForm.css',
  'eng-rd-clean/src/components/CustomSelect.css',
  
  // Backend
  'backend/server.js',
  'backend/package.json',
  
  // Configuration
  'backend/.env.example'
];

console.log('📁 VÉRIFICATION DES FICHIERS CRITIQUES...');
let missingFiles = [];
let existingFiles = [];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    existingFiles.push(file);
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file} - MANQUANT`);
  }
});

console.log(`\n📊 RÉSULTAT: ${existingFiles.length}/${criticalFiles.length} fichiers présents`);

if (missingFiles.length > 0) {
  console.log('\n⚠️  FICHIERS MANQUANTS:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
}

// 2. Vérification des dépendances package.json
console.log('\n📦 VÉRIFICATION DES DÉPENDANCES...');

try {
  // Frontend dependencies
  const frontendPackage = JSON.parse(fs.readFileSync('eng-rd-clean/package.json', 'utf8'));
  console.log('✅ Frontend package.json valide');
  console.log(`   - React: ${frontendPackage.dependencies?.react || 'Non trouvé'}`);
  console.log(`   - React Router: ${frontendPackage.dependencies?.['react-router-dom'] || 'Non trouvé'}`);
  console.log(`   - Axios: ${frontendPackage.dependencies?.axios || 'Non trouvé'}`);
  
  // Backend dependencies
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  console.log('✅ Backend package.json valide');
  console.log(`   - Express: ${backendPackage.dependencies?.express || 'Non trouvé'}`);
  console.log(`   - Mongoose: ${backendPackage.dependencies?.mongoose || 'Non trouvé'}`);
  console.log(`   - Multer: ${backendPackage.dependencies?.multer || 'Non trouvé'}`);
  
} catch (error) {
  console.log('❌ Erreur lors de la lecture des package.json:', error.message);
}

// 3. Vérification de la structure des routes
console.log('\n🛣️  VÉRIFICATION DES ROUTES...');

const routesToCheck = [
  { path: 'eng-rd-clean/src/App.js', type: 'Frontend Routes' },
  { path: 'backend/routes/jobs.js', type: 'Backend Jobs API' },
  { path: 'backend/routes/applications.js', type: 'Backend Applications API' },
  { path: 'backend/routes/messages.js', type: 'Backend Messages API' },
  { path: 'backend/routes/news.js', type: 'Backend News API' },
  { path: 'backend/routes/admin.js', type: 'Backend Admin API' }
];

routesToCheck.forEach(route => {
  if (fs.existsSync(route.path)) {
    console.log(`✅ ${route.type}: ${route.path}`);
  } else {
    console.log(`❌ ${route.type}: ${route.path} - MANQUANT`);
  }
});

// 4. Vérification des variables d'environnement
console.log('\n🔧 VÉRIFICATION DE LA CONFIGURATION...');

if (fs.existsSync('backend/.env.example')) {
  console.log('✅ Fichier .env.example présent');
  const envExample = fs.readFileSync('backend/.env.example', 'utf8');
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  
  requiredVars.forEach(varName => {
    if (envExample.includes(varName)) {
      console.log(`✅ Variable ${varName} documentée`);
    } else {
      console.log(`⚠️  Variable ${varName} manquante dans .env.example`);
    }
  });
} else {
  console.log('❌ Fichier .env.example manquant');
}

// 5. Vérification des assets
console.log('\n🖼️  VÉRIFICATION DES ASSETS...');

const assetDirs = [
  'eng-rd-clean/src/assets',
  'eng-rd-clean/public',
  'backend/uploads'
];

assetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    console.log(`✅ ${dir}: ${files.length} fichiers`);
  } else {
    console.log(`⚠️  ${dir}: Dossier manquant`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('🎯 RÉSUMÉ DU TEST FINAL');
console.log('='.repeat(60));

// Calcul du score global
const totalChecks = criticalFiles.length;
const passedChecks = existingFiles.length;
const score = Math.round((passedChecks / totalChecks) * 100);

console.log(`📊 Score global: ${score}%`);
console.log(`✅ Fichiers présents: ${passedChecks}/${totalChecks}`);

if (score >= 95) {
  console.log('🎉 EXCELLENT! L\'application est prête pour le déploiement');
} else if (score >= 85) {
  console.log('✅ BIEN! L\'application est globalement prête, quelques ajustements mineurs');
} else if (score >= 70) {
  console.log('⚠️  ATTENTION! Plusieurs fichiers manquants, vérification nécessaire');
} else {
  console.log('❌ CRITIQUE! Trop de fichiers manquants, déploiement non recommandé');
}

console.log('\n🚀 PROCHAINES ÉTAPES POUR LE DÉPLOIEMENT:');
console.log('1. Vérifier que MongoDB est configuré');
console.log('2. Créer le fichier .env avec les bonnes variables');
console.log('3. Installer les dépendances: npm install (frontend et backend)');
console.log('4. Tester en local: npm start (frontend) et npm run dev (backend)');
console.log('5. Build de production: npm run build');
console.log('6. Déployer sur votre serveur');

console.log('\n📋 CHECKLIST FINALE:');
console.log('□ Base de données MongoDB configurée');
console.log('□ Variables d\'environnement définies');
console.log('□ Dépendances installées');
console.log('□ Tests locaux réussis');
console.log('□ Build de production créé');
console.log('□ Serveur de déploiement prêt');

console.log('\n✨ FIN DU TEST FINAL');