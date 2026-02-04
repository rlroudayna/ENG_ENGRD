// Script pour nettoyer les candidatures avec des références jobId corrompues
console.log('🧹 NETTOYAGE CANDIDATURES CORROMPUES');
console.log('====================================\n');

console.log('📋 CE SCRIPT VA:');
console.log('================');
console.log('1. 🔍 Identifier les candidatures avec jobId invalide');
console.log('2. 🧹 Les convertir en candidatures spontanées (jobId = null)');
console.log('3. ✅ Préserver toutes les autres données');
console.log('4. 📊 Afficher un rapport des modifications');
console.log('');

console.log('⚠️ ATTENTION:');
console.log('=============');
console.log('Ce script modifie la base de données !');
console.log('Assurez-vous d\'avoir une sauvegarde si nécessaire.');
console.log('');

console.log('🚀 POUR EXÉCUTER CE NETTOYAGE:');
console.log('==============================');
console.log('1. Arrêtez le backend (Ctrl+C)');
console.log('2. Créez un fichier cleanup-db.js dans le dossier backend:');
console.log('');

console.log('--- CONTENU DU FICHIER cleanup-db.js ---');
console.log(`
const mongoose = require('mongoose');
const Application = require('./models/application');
require('dotenv').config();

async function cleanupCorruptedApplications() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Trouver toutes les candidatures
    const applications = await Application.find().populate('jobId');
    console.log(\`📊 Trouvé \${applications.length} candidatures\`);
    
    let cleanedCount = 0;
    
    for (const app of applications) {
      // Si jobId existe mais n'a pas de title (référence cassée)
      if (app.jobId && !app.jobId.title) {
        console.log(\`🧹 Nettoyage candidature \${app._id}: jobId invalide\`);
        
        // Convertir en candidature spontanée
        await Application.findByIdAndUpdate(app._id, { 
          $unset: { jobId: 1 } // Supprime le champ jobId
        });
        
        cleanedCount++;
      }
    }
    
    console.log(\`✅ Nettoyage terminé: \${cleanedCount} candidatures converties en spontanées\`);
    
    // Vérification finale
    const finalApplications = await Application.find().populate('jobId');
    const validCount = finalApplications.filter(app => !app.jobId || app.jobId.title).length;
    
    console.log(\`📊 Résultat final: \${validCount}/\${finalApplications.length} candidatures valides\`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

cleanupCorruptedApplications();
`);

console.log('--- FIN DU FICHIER ---');
console.log('');

console.log('3. Exécutez le nettoyage:');
console.log('   cd backend');
console.log('   node cleanup-db.js');
console.log('');

console.log('4. Redémarrez le backend:');
console.log('   npm start');
console.log('');

console.log('📋 ALTERNATIVE PLUS SIMPLE:');
console.log('===========================');
console.log('Si vous préférez une solution plus simple:');
console.log('');
console.log('1. 🗑️ Supprimez toutes les candidatures de test actuelles');
console.log('   → Via l\'interface admin');
console.log('   → Gardez seulement les vraies candidatures');
console.log('');
console.log('2. 🧪 Créez une nouvelle candidature de test');
console.log('   → Allez sur une offre existante (ingénieur, RH, etc.)');
console.log('   → Postulez avec des données de test');
console.log('   → Vérifiez que le nom s\'affiche correctement');
console.log('');

console.log('💡 RECOMMANDATION:');
console.log('==================');
console.log('Pour éviter ce problème à l\'avenir:');
console.log('1. ✅ Ne supprimez jamais une offre qui a des candidatures');
console.log('2. ✅ Ou convertissez les candidatures en spontanées avant suppression');
console.log('3. ✅ Testez toujours avec de vraies données cohérentes');
console.log('');

console.log('🎯 RÉSULTAT ATTENDU:');
console.log('====================');
console.log('Après nettoyage:');
console.log('✅ Plus de debug info rouge');
console.log('✅ Candidatures pour offres → Nom visible');
console.log('✅ Candidatures spontanées → Badge "Spontanée"');
console.log('✅ Données cohérentes et propres');

console.log('\n🧹 NETTOYAGE PRÊT À ÊTRE EXÉCUTÉ !');