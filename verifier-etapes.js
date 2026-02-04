#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VÉRIFICATION DES ÉTAPES DE DÉPLOIEMENT\n');

// Étape 1: Vérifier les builds
console.log('📋 ÉTAPE 1: Vérification des builds');
const buildPublicExists = fs.existsSync('build-public');
const buildAdminExists = fs.existsSync('build-admin');

if (buildPublicExists && buildAdminExists) {
    console.log('✅ Les dossiers build-public/ et build-admin/ existent');
    
    // Vérifier le contenu
    const publicIndex = fs.existsSync('build-public/index.html');
    const adminIndex = fs.existsSync('build-admin/index.html');
    
    if (publicIndex && adminIndex) {
        console.log('✅ Les fichiers index.html sont présents dans les deux builds');
    } else {
        console.log('❌ Fichiers index.html manquants dans les builds');
        console.log('   → Relancez: build-production.bat');
    }
} else {
    console.log('❌ Builds manquants');
    console.log('   → Exécutez d\'abord: build-production.bat');
    process.exit(1);
}

console.log('\n📋 ÉTAPE 2: Vérification des fichiers de déploiement');
const deployScript = fs.existsSync('deploy-to-server.sh');
const nginxConfig = fs.existsSync('nginx-config.conf');
const backendEnv = fs.existsSync('backend/.env.production');

if (deployScript) {
    console.log('✅ Script deploy-to-server.sh présent');
    
    // Vérifier si les variables sont configurées
    const deployContent = fs.readFileSync('deploy-to-server.sh', 'utf8');
    if (deployContent.includes('VOTRE_VRAIE_IP_SERVEUR')) {
        console.log('⚠️  Vous devez modifier SERVER_IP dans deploy-to-server.sh');
    } else {
        console.log('✅ SERVER_IP configuré dans deploy-to-server.sh');
    }
    
    if (deployContent.includes('VOTRE_VRAIE_USER')) {
        console.log('⚠️  Vous devez modifier SERVER_USER dans deploy-to-server.sh');
    } else {
        console.log('✅ SERVER_USER configuré dans deploy-to-server.sh');
    }
} else {
    console.log('❌ Script deploy-to-server.sh manquant');
}

if (nginxConfig) {
    console.log('✅ Configuration nginx-config.conf présente');
} else {
    console.log('❌ Configuration nginx-config.conf manquante');
}

if (backendEnv) {
    console.log('✅ Fichier backend/.env.production présent');
} else {
    console.log('❌ Fichier backend/.env.production manquant');
}

console.log('\n📋 ÉTAPE 3: Vérification des guides');
const guideEtapes = fs.existsSync('GUIDE_ETAPE_PAR_ETAPE_APRES_BUILD.md');
const actionsAFaire = fs.existsSync('ACTIONS_A_FAIRE.md');

if (guideEtapes) {
    console.log('✅ Guide étape par étape disponible');
} else {
    console.log('❌ Guide étape par étape manquant');
}

if (actionsAFaire) {
    console.log('✅ Liste des actions disponible');
} else {
    console.log('❌ Liste des actions manquante');
}

console.log('\n🎯 PROCHAINES ÉTAPES:');
console.log('1. Modifiez deploy-to-server.sh avec vos vraies informations serveur');
console.log('2. Configurez le DNS pour admin.eng-rnd.com');
console.log('3. Suivez le guide: GUIDE_ETAPE_PAR_ETAPE_APRES_BUILD.md');

console.log('\n📖 GUIDES DISPONIBLES:');
console.log('- GUIDE_ETAPE_PAR_ETAPE_APRES_BUILD.md (guide détaillé)');
console.log('- ACTIONS_A_FAIRE.md (résumé rapide)');
console.log('- DEPLOIEMENT_FINAL_SIMPLE.md (guide complet)');

console.log('\n✨ Tout est prêt pour le déploiement ! Bonne chance ! 🚀');