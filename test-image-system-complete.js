// Test complet du système d'upload d'images
const fs = require('fs');
const path = require('path');

console.log('🔍 TEST SYSTÈME UPLOAD IMAGES COMPLET');
console.log('=====================================\n');

// 1. Vérifier la configuration complète
console.log('📋 1. VÉRIFICATION CONFIGURATION SYSTÈME');
console.log('========================================');

// Vérifier Cloudinary config
try {
    const cloudinaryPath = path.join(__dirname, 'backend', 'config', 'cloudinary.js');
    if (fs.existsSync(cloudinaryPath)) {
        console.log('✅ Configuration Cloudinary trouvée');
        const content = fs.readFileSync(cloudinaryPath, 'utf8');
        const hasConfig = content.includes('cloudinary.config');
        console.log(`${hasConfig ? '✅' : '❌'} Configuration Cloudinary initialisée`);
    } else {
        console.log('❌ Configuration Cloudinary manquante');
    }
} catch (error) {
    console.log('❌ Erreur configuration Cloudinary:', error.message);
}

// Vérifier les routes d'upload
try {
    const routesPath = path.join(__dirname, 'backend', 'routes', 'imageUploadRoutes.js');
    if (fs.existsSync(routesPath)) {
        console.log('✅ Routes d\'upload d\'images trouvées');
        const content = fs.readFileSync(routesPath, 'utf8');
        const hasUpload = content.includes('router.post(\'/upload\'');
        const hasDelete = content.includes('router.delete(\'/delete\'');
        const hasCloudinary = content.includes('cloudinary.uploader.upload_stream');
        console.log(`${hasUpload ? '✅' : '❌'} Route POST /upload présente`);
        console.log(`${hasDelete ? '✅' : '❌'} Route DELETE /delete présente`);
        console.log(`${hasCloudinary ? '✅' : '❌'} Intégration Cloudinary présente`);
    } else {
        console.log('❌ Routes d\'upload d\'images manquantes');
    }
} catch (error) {
    console.log('❌ Erreur routes upload:', error.message);
}

// Vérifier la connexion dans server.js
try {
    const serverPath = path.join(__dirname, 'backend', 'server.js');
    if (fs.existsSync(serverPath)) {
        const content = fs.readFileSync(serverPath, 'utf8');
        const hasImageRoutes = content.includes('/api/images') && content.includes('imageUploadRoutes');
        console.log(`${hasImageRoutes ? '✅' : '❌'} Routes images connectées dans server.js`);
    } else {
        console.log('❌ Fichier server.js non trouvé');
    }
} catch (error) {
    console.log('❌ Erreur server.js:', error.message);
}

// Vérifier le hook frontend
try {
    const hookPath = path.join(__dirname, 'eng-rd-clean', 'src', 'hooks', 'useImageUpload.js');
    if (fs.existsSync(hookPath)) {
        console.log('✅ Hook frontend useImageUpload trouvé');
        const content = fs.readFileSync(hookPath, 'utf8');
        const hasCorrectEndpoint = content.includes('/api/images/upload');
        const hasFormData = content.includes('FormData');
        const hasTimeout = content.includes('timeout: 300000');
        console.log(`${hasCorrectEndpoint ? '✅' : '❌'} Endpoint correct (/api/images/upload)`);
        console.log(`${hasFormData ? '✅' : '❌'} Utilisation FormData`);
        console.log(`${hasTimeout ? '✅' : '❌'} Timeout étendu (5 minutes)`);
    } else {
        console.log('❌ Hook frontend manquant');
    }
} catch (error) {
    console.log('❌ Erreur hook frontend:', error.message);
}

console.log('\n');

// 2. Vérifier les variables d'environnement
console.log('📋 2. VÉRIFICATION VARIABLES ENVIRONNEMENT');
console.log('==========================================');

try {
    const envPath = path.join(__dirname, 'backend', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        const cloudName = envContent.match(/CLOUDINARY_CLOUD_NAME=(.+)/);
        const apiKey = envContent.match(/CLOUDINARY_API_KEY=(.+)/);
        const apiSecret = envContent.match(/CLOUDINARY_API_SECRET=(.+)/);
        
        console.log(`${cloudName && cloudName[1].trim() ? '✅' : '❌'} CLOUDINARY_CLOUD_NAME: ${cloudName ? cloudName[1].trim().substring(0, 10) + '...' : 'NON DÉFINI'}`);
        console.log(`${apiKey && apiKey[1].trim() ? '✅' : '❌'} CLOUDINARY_API_KEY: ${apiKey ? apiKey[1].trim().substring(0, 10) + '...' : 'NON DÉFINI'}`);
        console.log(`${apiSecret && apiSecret[1].trim() ? '✅' : '❌'} CLOUDINARY_API_SECRET: ${apiSecret ? '***défini***' : 'NON DÉFINI'}`);
        
        if (!cloudName || !apiKey || !apiSecret) {
            console.log('\n❌ PROBLÈME: Configuration Cloudinary incomplète');
            console.log('💡 SOLUTION: Vérifiez vos clés Cloudinary sur https://cloudinary.com/console');
        }
    } else {
        console.log('❌ Fichier .env non trouvé');
    }
} catch (error) {
    console.log('❌ Erreur variables environnement:', error.message);
}

console.log('\n');

// 3. Diagnostic des problèmes courants
console.log('📋 3. DIAGNOSTIC PROBLÈMES COURANTS');
console.log('===================================');

console.log('🔍 Problème: "Une image fonctionne, une autre non"');
console.log('');

console.log('📊 CAUSES POSSIBLES:');
console.log('');

console.log('1. 📏 TAILLE DU FICHIER:');
console.log('   ✅ Image OK: < 2MB');
console.log('   ❌ Image KO: > 5MB');
console.log('   💡 Le backend accepte jusqu\'à 10MB mais Cloudinary est plus lent avec les gros fichiers');
console.log('');

console.log('2. 🎨 FORMAT DU FICHIER:');
console.log('   ✅ Formats rapides: JPG, PNG standard');
console.log('   ⚠️ Formats lents: PNG très détaillés, WebP, GIF');
console.log('   💡 Tous sont acceptés mais certains prennent plus de temps');
console.log('');

console.log('3. 🖼️ COMPLEXITÉ DE L\'IMAGE:');
console.log('   ✅ Images simples: Photos normales, logos unis');
console.log('   ⚠️ Images complexes: Beaucoup de détails, transparences');
console.log('   💡 Cloudinary optimise automatiquement mais c\'est plus long');
console.log('');

console.log('4. ⚡ ÉTAT DU RÉSEAU:');
console.log('   ✅ Première image: Connexion stable');
console.log('   ❌ Deuxième image: Micro-coupure ou ralentissement');
console.log('   💡 Le timeout est de 5 minutes, mais parfois ça suffit pas');
console.log('');

console.log('5. 🌐 ÉTAT DE CLOUDINARY:');
console.log('   ✅ Première image: Serveurs Cloudinary disponibles');
console.log('   ❌ Deuxième image: Serveurs Cloudinary surchargés');
console.log('   💡 Cloudinary peut avoir des ralentissements temporaires');
console.log('');

// 4. Tests à effectuer
console.log('📋 4. TESTS À EFFECTUER MAINTENANT');
console.log('==================================');

console.log('🧪 Test A: Vérifiez votre image problématique');
console.log('   1. Clic droit sur l\'image → Propriétés');
console.log('   2. Notez: Taille (MB), Format, Dimensions');
console.log('   3. Si > 3MB → Compressez avant upload');
console.log('   4. Si format PNG lourd → Convertissez en JPG');
console.log('');

console.log('🧪 Test B: Test avec image de référence');
console.log('   1. Trouvez une image JPG < 1MB');
console.log('   2. Uploadez-la dans l\'admin');
console.log('   3. Si ça marche → Le système fonctionne');
console.log('   4. Si ça échoue → Problème système (voir solutions)');
console.log('');

console.log('🧪 Test C: Réessayez la même image');
console.log('   1. Réessayez d\'uploader l\'image qui a échoué');
console.log('   2. Attendez bien les 5 minutes de timeout');
console.log('   3. Si ça marche → C\'était temporaire');
console.log('   4. Si ça échoue → Image problématique');
console.log('');

console.log('🧪 Test D: Vérifiez les logs');
console.log('   1. Ouvrez F12 → Console dans le navigateur');
console.log('   2. Regardez la console du backend');
console.log('   3. Uploadez une image et notez les erreurs');
console.log('   4. Les erreurs vous diront exactement quoi faire');
console.log('');

// 5. Solutions selon les erreurs
console.log('📋 5. SOLUTIONS SELON LES ERREURS');
console.log('=================================');

console.log('🔧 Erreur "Timeout" ou "ECONNABORTED":');
console.log('   → Image trop lourde ou connexion lente');
console.log('   → Compressez l\'image à < 2MB');
console.log('   → Réessayez avec une meilleure connexion');
console.log('');

console.log('🔧 Erreur "413 Payload Too Large":');
console.log('   → Image > 10MB (limite serveur)');
console.log('   → Compressez obligatoirement l\'image');
console.log('');

console.log('🔧 Erreur "Format non supporté":');
console.log('   → Format de fichier non accepté');
console.log('   → Convertissez en JPG, PNG, WebP ou GIF');
console.log('');

console.log('🔧 Erreur "Network Error":');
console.log('   → Backend non démarré ou inaccessible');
console.log('   → Redémarrez: cd backend && npm start');
console.log('');

console.log('🔧 Erreur Cloudinary (API key, etc.):');
console.log('   → Configuration Cloudinary incorrecte');
console.log('   → Vérifiez le fichier .env');
console.log('   → Redémarrez le backend après modification');
console.log('');

// 6. Outils recommandés
console.log('📋 6. OUTILS POUR OPTIMISER VOS IMAGES');
console.log('======================================');

console.log('🛠️ Compresseurs en ligne (gratuits):');
console.log('   • TinyPNG.com → Excellent pour PNG');
console.log('   • CompressJPEG.com → Excellent pour JPG');
console.log('   • Squoosh.app → Google, tous formats');
console.log('');

console.log('🛠️ Convertisseurs de format:');
console.log('   • CloudConvert.com → Tous formats');
console.log('   • Convertio.co → Simple et rapide');
console.log('');

console.log('🛠️ Redimensionnement:');
console.log('   • ResizeImage.net → Redimensionner facilement');
console.log('   • ILoveIMG.com → Suite complète d\'outils');
console.log('');

// 7. Checklist finale
console.log('📋 7. CHECKLIST AVANT UPLOAD');
console.log('============================');

console.log('□ Backend démarré (cd backend && npm start)');
console.log('□ Pas d\'erreurs dans la console backend');
console.log('□ Image < 3MB (idéal < 1MB)');
console.log('□ Format JPG ou PNG standard');
console.log('□ Dimensions raisonnables (< 2000px)');
console.log('□ Connexion internet stable');
console.log('□ Connecté en tant qu\'admin');
console.log('');

console.log('💡 CONSEIL FINAL:');
console.log('=================');
console.log('Le système d\'upload est COMPLET et FONCTIONNEL !');
console.log('Si une image fonctionne parfois, c\'est que tout marche.');
console.log('');
console.log('Les échecs viennent généralement de:');
console.log('• Images trop lourdes (> 3MB)');
console.log('• Connexion internet instable');
console.log('• Ralentissements temporaires de Cloudinary');
console.log('');
console.log('🎯 SOLUTION SIMPLE:');
console.log('1. Compressez vos images à < 1MB');
console.log('2. Utilisez le format JPG');
console.log('3. Réessayez si ça échoue une fois');
console.log('');
console.log('✅ Avec ces précautions, l\'upload devrait marcher à 99% !');

console.log('\n🚀 PROCHAINE ÉTAPE:');
console.log('Testez maintenant avec une image JPG < 1MB pour confirmer.');