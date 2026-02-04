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
    console.log(`📊 Trouvé ${applications.length} candidatures`);
    
    let cleanedCount = 0;
    let deletedCount = 0;
    
    for (const app of applications) {
      // Si jobId existe mais n'a pas de title (référence cassée)
      if (app.jobId && !app.jobId.title) {
        console.log(`🧹 Candidature ${app._id}: jobId invalide détecté`);
        console.log(`   Nom: ${app.firstName} ${app.lastName}`);
        console.log(`   Email: ${app.email}`);
        
        // Option 1: Convertir en candidature spontanée
        await Application.findByIdAndUpdate(app._id, { 
          $unset: { jobId: 1 } // Supprime le champ jobId
        });
        
        console.log(`   ✅ Convertie en candidature spontanée`);
        cleanedCount++;
        
        // Option 2: Supprimer complètement (décommentez si préféré)
        // await Application.findByIdAndDelete(app._id);
        // console.log(`   🗑️ Supprimée`);
        // deletedCount++;
      }
    }
    
    console.log(`\n📊 RÉSUMÉ DU NETTOYAGE:`);
    console.log(`✅ ${cleanedCount} candidatures converties en spontanées`);
    console.log(`🗑️ ${deletedCount} candidatures supprimées`);
    
    // Vérification finale
    const finalApplications = await Application.find().populate('jobId');
    const validCount = finalApplications.filter(app => !app.jobId || (app.jobId && app.jobId.title)).length;
    const spontaneousCount = finalApplications.filter(app => !app.jobId).length;
    const withJobCount = finalApplications.filter(app => app.jobId && app.jobId.title).length;
    
    console.log(`\n📊 ÉTAT FINAL:`);
    console.log(`📋 Total: ${finalApplications.length} candidatures`);
    console.log(`✅ Valides: ${validCount} candidatures`);
    console.log(`🎯 Avec offre: ${withJobCount} candidatures`);
    console.log(`⭐ Spontanées: ${spontaneousCount} candidatures`);
    
    if (validCount === finalApplications.length) {
      console.log(`\n🎉 SUCCÈS: Toutes les candidatures sont maintenant valides !`);
    } else {
      console.log(`\n⚠️ ATTENTION: ${finalApplications.length - validCount} candidatures encore problématiques`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
    console.log('\n🚀 Vous pouvez maintenant redémarrer le backend avec: npm start');
  }
}

console.log('🧹 NETTOYAGE DES CANDIDATURES CORROMPUES');
console.log('========================================');
console.log('Ce script va convertir les candidatures avec jobId invalide en candidatures spontanées.');
console.log('Les données des candidats seront préservées.\n');

cleanupCorruptedApplications();