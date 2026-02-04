// Test complet pour diagnostiquer les problèmes d'upload d'images
const fs = require('fs');
const path = require('path');

console.log('🔍 TEST COMPLET UPLOAD IMAGES');
console.log('==============================\n');

// 1. Vérifier la configuration Cloudinary
console.log('📋 1. VÉRIFICATION CONFIGURATION CLOUDINARY');
console.log('============================================');

try {
    const envPath = path.join(__dirname, 'backend', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        const hasCloudName = envContent.includes('CLOUDINARY_CLOUD_NAME=');
        const hasApiKey = envContent.includes('CLOUDINARY_API_KEY=');
        const hasApiSecret = envContent.includes('CLOUDINARY_API_SECRET=');
        
        console.log(`✅ Fichier .env trouvé: ${envPath}`);
        console.log(`${hasCloudName ? '✅' : '❌'} CLOUDINARY_CLOUD_NAME configuré`);
        console.log(`${hasApiKey ? '✅' : '❌'} CLOUDINARY_API_KEY configuré`);
        console.log(`${hasApiSecret ? '✅' : '❌'} CLOUDINARY_API_SECRET configuré`);
        
        if (!hasCloudName || !hasApiKey || !hasApiSecret) {
            console.log('\n❌ PROBLÈME: Configuration Cloudinary incomplète');
            console.log('💡 SOLUTION: Vérifiez vos clés Cloudinary dans le fichier .env');
        } else {
            console.log('\n✅ Configuration Cloudinary complète');
        }
    } else {
        console.log('❌ Fichier .env non trouvé');
        console.log('💡 SOLUTION: Créez le fichier backend/.env avec vos clés Cloudinary');
    }
} catch (error) {
    console.log('❌ Erreur lors de la vérification:', error.message);
}

console.log('\n');

// 2. Vérifier les routes d'upload
console.log('📋 2. VÉRIFICATION ROUTES UPLOAD');
console.log('=================================');

const routesToCheck = [
    'backend/routes/newsRoutes.js',
    'backend/routes/homeContentRoutes.js',
    'backend/routes/jobRoutes.js'
];

routesToCheck.forEach(routePath => {
    try {
        if (fs.existsSync(routePath)) {
            const content = fs.readFileSync(routePath, 'utf8');
            const hasUpload = content.includes('upload') || content.includes('multer');
            const hasCloudinary = content.includes('cloudinary');
            
            console.log(`📁 ${routePath}:`);
            console.log(`   ${hasUpload ? '✅' : '❌'} Configuration upload présente`);
            console.log(`   ${hasCloudinary ? '✅' : '❌'} Intégration Cloudinary présente`);
        } else {
            console.log(`📁 ${routePath}: ❌ Fichier non trouvé`);
        }
    } catch (error) {
        console.log(`📁 ${routePath}: ❌ Erreur: ${error.message}`);
    }
});

console.log('\n');

// 3. Vérifier le hook d'upload côté frontend
console.log('📋 3. VÉRIFICATION HOOK UPLOAD FRONTEND');
console.log('=======================================');

try {
    const hookPath = 'eng-rd-clean/src/hooks/useImageUpload.js';
    if (fs.existsSync(hookPath)) {
        const content = fs.readFileSync(hookPath, 'utf8');
        const hasFormData = content.includes('FormData');
        const hasErrorHandling = content.includes('catch') || content.includes('error');
        const hasProgressTracking = content.includes('progress') || content.includes('loading');
        
        console.log(`✅ Hook d'upload trouvé: ${hookPath}`);
        console.log(`${hasFormData ? '✅' : '❌'} Utilisation FormData`);
        console.log(`${hasErrorHandling ? '✅' : '❌'} Gestion d'erreurs`);
        console.log(`${hasProgressTracking ? '✅' : '❌'} Suivi du progrès`);
    } else {
        console.log('❌ Hook d\'upload non trouvé');
        console.log('💡 SOLUTION: Le hook useImageUpload.js est nécessaire');
    }
} catch (error) {
    console.log('❌ Erreur lors de la vérification du hook:', error.message);
}

console.log('\n');

// 4. Instructions de test pratique
console.log('📋 4. TESTS PRATIQUES À EFFECTUER');
console.log('==================================');

console.log('🎯 Test A: Vérifiez votre image');
console.log('   1. Ouvrez les propriétés de votre image');
console.log('   2. Notez la taille (doit être < 5MB)');
console.log('   3. Notez le format (JPG recommandé)');
console.log('   4. Notez les dimensions (< 4K recommandé)');
console.log('');

console.log('🎯 Test B: Test avec image simple');
console.log('   1. Trouvez une image JPG < 1MB');
console.log('   2. Essayez de l\'uploader');
console.log('   3. Si ça marche = problème de taille/format');
console.log('   4. Si ça échoue = problème système');
console.log('');

console.log('🎯 Test C: Vérifiez la console navigateur');
console.log('   1. Ouvrez F12 dans votre navigateur');
console.log('   2. Allez dans l\'onglet Console');
console.log('   3. Essayez d\'uploader une image');
console.log('   4. Notez les erreurs affichées');
console.log('');

console.log('🎯 Test D: Vérifiez la console backend');
console.log('   1. Regardez la console où tourne le backend');
console.log('   2. Essayez d\'uploader une image');
console.log('   3. Notez les erreurs côté serveur');
console.log('');

// 5. Solutions selon les cas
console.log('📋 5. SOLUTIONS SELON LES PROBLÈMES');
console.log('===================================');

console.log('🔧 Si l\'image est trop lourde:');
console.log('   - Utilisez un compresseur en ligne');
console.log('   - Réduisez la qualité à 80-90%');
console.log('   - Redimensionnez si > 1920px de large');
console.log('');

console.log('🔧 Si erreur "Network Error":');
console.log('   - Vérifiez que le backend tourne');
console.log('   - Vérifiez l\'URL de l\'API');
console.log('   - Redémarrez le backend si nécessaire');
console.log('');

console.log('🔧 Si erreur Cloudinary:');
console.log('   - Vérifiez vos clés dans .env');
console.log('   - Vérifiez votre quota Cloudinary');
console.log('   - Réessayez dans quelques minutes');
console.log('');

console.log('🔧 Si timeout:');
console.log('   - Réduisez la taille de l\'image');
console.log('   - Vérifiez votre connexion internet');
console.log('   - Réessayez plus tard');
console.log('');

// 6. Commandes utiles
console.log('📋 6. COMMANDES UTILES');
console.log('======================');

console.log('🚀 Redémarrer le backend:');
console.log('   cd backend && npm start');
console.log('');

console.log('🔍 Voir les logs backend en temps réel:');
console.log('   (Les erreurs s\'affichent dans la console du backend)');
console.log('');

console.log('🧪 Tester l\'API directement:');
console.log('   Ouvrez: http://localhost:5000/api/test');
console.log('   (Doit afficher "API fonctionne")');
console.log('');

// 7. Checklist finale
console.log('📋 7. CHECKLIST FINALE');
console.log('======================');

console.log('□ Backend démarré et accessible');
console.log('□ Configuration Cloudinary complète');
console.log('□ Image < 5MB et format JPG/PNG');
console.log('□ Pas d\'erreurs dans la console navigateur');
console.log('□ Pas d\'erreurs dans la console backend');
console.log('□ Connexion internet stable');
console.log('');

console.log('💡 CONSEIL FINAL:');
console.log('=================');
console.log('Si UNE image fonctionne parfois, le système est OK !');
console.log('Le problème vient probablement de:');
console.log('- La taille/format de l\'image spécifique');
console.log('- Un problème temporaire de réseau/Cloudinary');
console.log('- Une surcharge momentanée du serveur');
console.log('');
console.log('Réessayez avec une image plus petite et au format JPG.');
console.log('Si ça marche, compressez vos autres images avant upload.');

console.log('\n🎯 PROCHAINE ÉTAPE:');
console.log('Testez maintenant avec une image JPG < 1MB pour confirmer que le système fonctionne.');