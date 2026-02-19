#!/usr/bin/env node

/**
 * Script de test pour vérifier les problèmes CSS avant le build
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification des fichiers CSS...\n');

// Fonction pour trouver tous les fichiers CSS
function findCSSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('build')) {
      findCSSFiles(filePath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Patterns problématiques
const problematicPatterns = [
  {
    name: 'RGB avec slash (syntaxe moderne)',
    regex: /rgb\s*\(\s*\d+\s+\d+\s+\d+\s*\/\s*[\d.]+\s*\)/g,
    fix: 'Utiliser rgba(r, g, b, a) au lieu de rgb(r g b / a)'
  },
  {
    name: 'Division mathématique hors calc()',
    regex: /:\s*[^c][^a][^l][^c].*\d+\s*\/\s*\d+(?!.*\))/g,
    fix: 'Utiliser calc() pour les divisions: calc(100px / 2)'
  }
];

let hasErrors = false;
const cssFiles = findCSSFiles('./eng-rd-clean/src');

console.log(`📁 ${cssFiles.length} fichiers CSS trouvés\n`);

cssFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  problematicPatterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    
    if (matches) {
      hasErrors = true;
      console.log(`❌ ${path.relative('.', file)}`);
      console.log(`   Problème: ${pattern.name}`);
      console.log(`   Solution: ${pattern.fix}`);
      
      matches.forEach(match => {
        const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
        console.log(`   Ligne ${lineNumber}: ${match.trim()}`);
      });
      
      console.log('');
    }
  });
});

if (!hasErrors) {
  console.log('✅ Aucun problème CSS détecté!\n');
  console.log('Vous pouvez maintenant lancer: npm run build\n');
} else {
  console.log('⚠️  Des problèmes ont été détectés. Corrigez-les avant de builder.\n');
  process.exit(1);
}
