// Debug pour identifier pourquoi le nom de l'offre ne s'affiche pas
console.log('🔍 DEBUG NOM D\'OFFRE MANQUANT');
console.log('=============================\n');

const fs = require('fs');
const path = require('path');

// 1. Vérifier la route backend
console.log('📋 1. VÉRIFICATION ROUTE BACKEND');
console.log('================================');

try {
    const routePath = path.join(__dirname, 'backend', 'routes', 'application.js');
    if (fs.existsSync(routePath)) {
        const content = fs.readFileSync(routePath, 'utf8');
        
        // Vérifier le populate
        const populateMatch = content.match(/\.populate\(['"]jobId['"],\s*['"]([^'"]+)['"]\)/);
        
        console.log('✅ Route application.js trouvée');
        if (populateMatch) {
            console.log(`✅ Populate configuré: jobId avec champs "${populateMatch[1]}"`);
            
            // Vérifier si 'title' est inclus
            if (populateMatch[1].includes('title')) {
                console.log('✅ Champ "title" inclus dans le populate');
            } else {
                console.log('❌ Champ "title" MANQUANT dans le populate');
                console.log('💡 SOLUTION: Ajouter "title" dans le populate');
            }
        } else {
            console.log('❌ Populate jobId non trouvé ou mal configuré');
        }
    } else {
        console.log('❌ Route application.js non trouvée');
    }
} catch (error) {
    console.log('❌ Erreur route backend:', error.message);
}

// 2. Vérifier le modèle Job
console.log('\n📋 2. VÉRIFICATION MODÈLE JOB');
console.log('=============================');

try {
    const jobModelPath = path.join(__dirname, 'backend', 'models', 'Job.js');
    if (fs.existsSync(jobModelPath)) {
        const content = fs.readFileSync(jobModelPath, 'utf8');
        
        const hasTitle = content.includes('title:') || content.includes('title {');
        const hasLocation = content.includes('location:') || content.includes('location {');
        
        console.log('✅ Modèle Job.js trouvé');
        console.log(`${hasTitle ? '✅' : '❌'} Champ "title" dans le modèle`);
        console.log(`${hasLocation ? '✅' : '❌'} Champ "location" dans le modèle`);
        
        if (hasTitle) {
            console.log('✅ Le modèle Job a bien un champ title');
        } else {
            console.log('❌ Le modèle Job n\'a PAS de champ title');
        }
    } else {
        console.log('❌ Modèle Job.js non trouvé');
    }
} catch (error) {
    console.log('❌ Erreur modèle Job:', error.message);
}

// 3. Diagnostic des causes possibles
console.log('\n📋 3. CAUSES POSSIBLES DU PROBLÈME');
console.log('==================================');

console.log('🔍 CAUSE 1: Populate incorrect');
console.log('   • Backend populate jobId mais sans le champ "title"');
console.log('   • Résultat: app.jobId existe mais app.jobId.title est undefined');
console.log('   • Solution: Corriger le populate pour inclure "title"');
console.log('');

console.log('🔍 CAUSE 2: Données existantes corrompues');
console.log('   • Candidatures créées avec jobId null ou invalide');
console.log('   • Résultat: app.jobId pointe vers un job inexistant');
console.log('   • Solution: Vérifier les données en base');
console.log('');

console.log('🔍 CAUSE 3: Modèle Job sans champ title');
console.log('   • Le modèle Job n\'a pas de champ "title"');
console.log('   • Résultat: Même avec populate, title n\'existe pas');
console.log('   • Solution: Ajouter le champ title au modèle');
console.log('');

console.log('🔍 CAUSE 4: Backend non redémarré');
console.log('   • Modifications du populate pas encore actives');
console.log('   • Résultat: Ancien code encore en mémoire');
console.log('   • Solution: Redémarrer le backend');
console.log('');

// 4. Tests de diagnostic
console.log('📋 4. TESTS DE DIAGNOSTIC');
console.log('=========================');

console.log('🧪 Test A: Vérifiez les données API');
console.log('   1. Ouvrez F12 → Network dans le navigateur');
console.log('   2. Allez dans Admin → Candidatures');
console.log('   3. Regardez la requête GET /api/applications');
console.log('   4. Vérifiez la structure des données reçues:');
console.log('      - app.jobId existe ?');
console.log('      - app.jobId.title existe ?');
console.log('      - app.jobId._id existe ?');
console.log('');

console.log('🧪 Test B: Vérifiez la console backend');
console.log('   1. Regardez la console où tourne le backend');
console.log('   2. Cherchez des erreurs de populate');
console.log('   3. Vérifiez les logs de requêtes');
console.log('');

console.log('🧪 Test C: Testez avec une nouvelle candidature');
console.log('   1. Créez une nouvelle candidature sur une offre');
console.log('   2. Vérifiez si le nom s\'affiche pour la nouvelle');
console.log('   3. Si oui = problème avec anciennes données');
console.log('   4. Si non = problème de configuration');
console.log('');

// 5. Solutions selon les cas
console.log('📋 5. SOLUTIONS SELON LES CAS');
console.log('=============================');

console.log('🔧 Si populate incorrect:');
console.log('   → Modifier backend/routes/application.js');
console.log('   → Ligne: .populate(\'jobId\', \'title location type\')');
console.log('   → Vérifier que "title" est bien inclus');
console.log('   → Redémarrer le backend');
console.log('');

console.log('🔧 Si modèle Job sans title:');
console.log('   → Vérifier backend/models/Job.js');
console.log('   → Ajouter le champ title si manquant');
console.log('   → Redémarrer le backend');
console.log('');

console.log('🔧 Si données corrompues:');
console.log('   → Supprimer les anciennes candidatures de test');
console.log('   → Créer de nouvelles candidatures');
console.log('   → Vérifier que les nouvelles fonctionnent');
console.log('');

console.log('🔧 Si backend pas redémarré:');
console.log('   → cd backend');
console.log('   → npm start');
console.log('   → Attendre le message "Server running"');
console.log('   → Tester à nouveau');
console.log('');

// 6. Commandes de vérification
console.log('📋 6. COMMANDES DE VÉRIFICATION');
console.log('===============================');

console.log('🔍 Vérifier les données en base (si MongoDB):');
console.log('   db.applications.find().populate("jobId")');
console.log('');

console.log('🔍 Tester l\'API directement:');
console.log('   GET http://localhost:5000/api/applications');
console.log('   → Vérifier la structure JSON retournée');
console.log('');

console.log('🔍 Vérifier les logs backend:');
console.log('   → Regarder la console du backend');
console.log('   → Chercher des erreurs de populate');
console.log('');

// 7. Solution rapide
console.log('📋 7. SOLUTION RAPIDE À TESTER');
console.log('==============================');

console.log('💡 ÉTAPES IMMÉDIATES:');
console.log('1. Redémarrez le backend (cd backend && npm start)');
console.log('2. Rafraîchissez le navigateur (Ctrl+F5)');
console.log('3. Créez une nouvelle candidature sur une offre');
console.log('4. Vérifiez si le nom s\'affiche pour la nouvelle');
console.log('');

console.log('💡 SI ÇA NE MARCHE TOUJOURS PAS:');
console.log('1. Ouvrez F12 → Network');
console.log('2. Regardez la réponse de GET /api/applications');
console.log('3. Vérifiez la structure: app.jobId.title existe ?');
console.log('4. Si non, le problème est dans le backend');
console.log('5. Si oui, le problème est dans le frontend');

console.log('\n🎯 PROCHAINE ÉTAPE:');
console.log('Vérifiez les données API dans F12 pour identifier la cause exacte !');

console.log('\n🔧 DEBUG EN COURS...');
console.log('Le nom de l\'offre devrait s\'afficher après correction.');