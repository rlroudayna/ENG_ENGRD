// Script pour copier le logo ENG RND vers le dossier public
const fs = require('fs');
const path = require('path');

console.log("🎨 Copie du logo ENG RND vers le dossier public");

const sourceLogo = path.join(__dirname, 'eng-rd-clean', 'src', 'assets', 'Logo.png');
const publicDir = path.join(__dirname, 'eng-rd-clean', 'public');

// Destinations pour les différentes tailles d'icônes
const destinations = [
  { file: 'favicon.ico', desc: 'Favicon (sera converti)' },
  { file: 'logo192.png', desc: 'Logo PWA 192x192' },
  { file: 'logo512.png', desc: 'Logo PWA 512x512' },
  { file: 'logo-original.png', desc: 'Logo original de référence' }
];

try {
  // Vérifier que le logo source existe
  if (!fs.existsSync(sourceLogo)) {
    console.error("❌ Logo source non trouvé:", sourceLogo);
    process.exit(1);
  }

  console.log("✅ Logo source trouvé:", sourceLogo);
  
  // Copier le logo vers chaque destination
  destinations.forEach(dest => {
    const destPath = path.join(publicDir, dest.file);
    
    try {
      // Pour favicon.ico, on copie d'abord en .png puis on devra convertir manuellement
      if (dest.file === 'favicon.ico') {
        const faviconPngPath = path.join(publicDir, 'favicon-temp.png');
        fs.copyFileSync(sourceLogo, faviconPngPath);
        console.log(`✅ ${dest.desc}: ${faviconPngPath}`);
        console.log("   ⚠️  Convertir favicon-temp.png en favicon.ico manuellement");
      } else {
        fs.copyFileSync(sourceLogo, destPath);
        console.log(`✅ ${dest.desc}: ${destPath}`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la copie vers ${dest.file}:`, error.message);
    }
  });

  console.log("\n🎯 ÉTAPES SUIVANTES:");
  console.log("1. ✅ Logos copiés dans public/");
  console.log("2. 🔄 Redimensionner si nécessaire:");
  console.log("   - logo192.png → 192x192 pixels");
  console.log("   - logo512.png → 512x512 pixels");
  console.log("3. 🔄 Convertir favicon-temp.png en favicon.ico");
  console.log("4. 🚀 Redémarrer l'application pour voir les changements");

  console.log("\n💡 OUTILS RECOMMANDÉS:");
  console.log("- favicon.io pour convertir en favicon.ico");
  console.log("- Tout éditeur d'image pour redimensionner");

  console.log("\n✅ COPIE TERMINÉE !");

} catch (error) {
  console.error("❌ Erreur générale:", error.message);
  process.exit(1);
}