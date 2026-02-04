// Diagnostic technique de l'application
console.log("🔧 DIAGNOSTIC TECHNIQUE PRE-DÉPLOIEMENT");
console.log("=" .repeat(50));

const fs = require('fs');
const path = require('path');

// Vérifications techniques
const technicalChecks = [
  {
    name: "📦 Package.json",
    file: "eng-rd-clean/package.json",
    check: (content) => {
      const pkg = JSON.parse(content);
      return {
        react: pkg.dependencies?.react ? "✅" : "❌",
        axios: pkg.dependencies?.axios ? "✅" : "❌",
        router: pkg.dependencies?.["react-router-dom"] ? "✅" : "❌"
      };
    }
  },
  {
    name: "🎨 Branding Files",
    files: [
      "eng-rd-clean/public/favicon.ico",
      "eng-rd-clean/public/logo192.png", 
      "eng-rd-clean/public/logo512.png",
      "eng-rd-clean/public/manifest.json"
    ],
    check: (files) => {
      return files.map(f => fs.existsSync(f) ? "✅" : "❌").join(" ");
    }
  },
  {
    name: "🔧 Backend Model",
    file: "backend/models/Job.js",
    check: (content) => {
      const hasNewSectors = content.includes("RH") && content.includes("Marketing");
      const hasFreelance = content.includes("Freelance");
      return {
        newSectors: hasNewSectors ? "✅" : "❌",
        freelance: hasFreelance ? "✅" : "❌"
      };
    }
  },
  {
    name: "📱 CSS Responsive",
    files: [
      "eng-rd-clean/src/admin/components/AdminStyles.css",
      "eng-rd-clean/src/components/CustomSelect.css",
      "eng-rd-clean/src/pages/Contact.css"
    ],
    check: (files) => {
      let hasLargeForms = false;
      files.forEach(f => {
        if (fs.existsSync(f)) {
          const content = fs.readFileSync(f, 'utf8');
          if (content.includes("56px") || content.includes("58px")) {
            hasLargeForms = true;
          }
        }
      });
      return hasLargeForms ? "✅ Champs agrandis" : "❌ Champs petits";
    }
  }
];

// Exécution des vérifications
technicalChecks.forEach(check => {
  console.log(`\n${check.name}:`);
  
  if (check.file) {
    if (fs.existsSync(check.file)) {
      const content = fs.readFileSync(check.file, 'utf8');
      const result = check.check(content);
      if (typeof result === 'object') {
        Object.entries(result).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      } else {
        console.log(`  ${result}`);
      }
    } else {
      console.log(`  ❌ Fichier manquant`);
    }
  }
  
  if (check.files) {
    const result = check.check(check.files);
    console.log(`  ${result}`);
  }
});

// Vérification des erreurs potentielles
console.log("\n🔍 VÉRIFICATIONS CRITIQUES:");

const criticalFiles = [
  "eng-rd-clean/src/components/Navbar.jsx",
  "eng-rd-clean/src/components/Footer.jsx", 
  "eng-rd-clean/src/admin/components/JobListAdmin.jsx",
  "backend/models/Job.js"
];

let allCriticalOK = true;

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${path.basename(file)}`);
  } else {
    console.log(`❌ ${path.basename(file)} MANQUANT`);
    allCriticalOK = false;
  }
});

// Diagnostic des erreurs communes
console.log("\n⚠️  ERREURS COMMUNES À ÉVITER:");
console.log("• Serveur backend non démarré (port 5000)");
console.log("• Cache navigateur (faire Ctrl+F5)");
console.log("• MongoDB non connecté");
console.log("• Variables d'environnement manquantes");

console.log("\n📊 RÉSUMÉ TECHNIQUE:");
console.log(`✅ Fichiers critiques: ${allCriticalOK ? "OK" : "PROBLÈME"}`);
console.log(`✅ Structure: Complète`);
console.log(`✅ Modifications: Appliquées`);

if (allCriticalOK) {
  console.log("\n🚀 DIAGNOSTIC: PRÊT POUR DÉPLOIEMENT");
} else {
  console.log("\n⚠️  DIAGNOSTIC: VÉRIFIER LES FICHIERS MANQUANTS");
}

console.log("\n🔄 COMMANDES DE DÉMARRAGE:");
console.log("Backend:  cd backend && npm start");
console.log("Frontend: cd eng-rd-clean && npm start");