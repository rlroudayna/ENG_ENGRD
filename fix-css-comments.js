const fs = require('fs');
const path = require('path');

// Liste des fichiers CSS à nettoyer
const cssFiles = [
  'eng-rd-clean/src/App.css',
  'eng-rd-clean/src/components/ApplicationForm.css',
  'eng-rd-clean/src/components/Navbar.css',
  'eng-rd-clean/src/components/CustomSelect.css',
  'eng-rd-clean/src/components/Layout.css',
  'eng-rd-clean/src/components/Footer.css',
  'eng-rd-clean/src/components/JobCard.css',
  'eng-rd-clean/src/components/JobList.css',
  'eng-rd-clean/src/pages/Jobs.css',
  'eng-rd-clean/src/pages/Actualites.css',
  'eng-rd-clean/src/pages/Home.css',
  'eng-rd-clean/src/pages/JobDetails.css',
  'eng-rd-clean/src/pages/Contact.css',
  'eng-rd-clean/src/pages/ApplyToOffer.css',
  'eng-rd-clean/src/admin/components/AdminStyles.css'
];

console.log('🧹 Nettoyage des commentaires CSS...\n');

let totalCleaned = 0;

cssFiles.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Fichier non trouvé: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Supprimer tous les commentaires CSS /* ... */
    const cleanedContent = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Supprimer les lignes vides multiples
    const finalContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, finalContent, 'utf8');
    
    const commentCount = (content.match(/\/\*/g) || []).length;
    if (commentCount > 0) {
      console.log(`✅ ${path.basename(filePath)}: ${commentCount} commentaires supprimés`);
      totalCleaned += commentCount;
    } else {
      console.log(`✓  ${path.basename(filePath)}: Aucun commentaire trouvé`);
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Terminé! ${totalCleaned} commentaires CSS supprimés au total.`);
console.log('\n📝 Prochaine étape: Exécutez "npm run build" dans eng-rd-clean/');
