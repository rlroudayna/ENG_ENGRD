// JWT_SECRET personnalisés générés spécialement pour votre projet
console.log('🔑 VOS JWT_SECRET PERSONNALISÉS');
console.log('==============================\n');

// Générateur de JWT_SECRET sécurisé
function generateSecureJWTSecret(length) {
    const chars = 'abcdef0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Générer des secrets uniques
const devSecret = generateSecureJWTSecret(64);
const prodSecret = generateSecureJWTSecret(80);
const backupSecret = generateSecureJWTSecret(96);

console.log('🎯 POUR DÉVELOPPEMENT (backend/.env):');
console.log('=====================================');
console.log('JWT_SECRET=' + devSecret);
console.log('');

console.log('🚀 POUR PRODUCTION (backend/.env.production):');
console.log('==============================================');
console.log('JWT_SECRET=' + prodSecret);
console.log('');

console.log('💾 SECRET DE SAUVEGARDE (optionnel):');
console.log('====================================');
console.log('JWT_SECRET=' + backupSecret);
console.log('');

console.log('📋 CONFIGURATION COMPLÈTE RECOMMANDÉE');
console.log('=====================================');

console.log('📝 Fichier backend/.env:');
console.log('------------------------');
console.log('# Configuration développement');
console.log('ADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD=VotreMotDePasse2024!');
console.log('JWT_SECRET=' + devSecret);
console.log('MONGO_URI=mongodb://localhost:27017/engrd');
console.log('PORT=5000');
console.log('');

console.log('📝 Fichier backend/.env.production:');
console.log('-----------------------------------');
console.log('# Configuration production');
console.log('ADMIN_USERNAME=admin_prod');
console.log('ADMIN_PASSWORD=MotDePasseProdTresFort2024!@#');
console.log('JWT_SECRET=' + prodSecret);
console.log('MONGO_URI=mongodb://votre-url-mongodb-production');
console.log('PORT=5000');
console.log('');

console.log('✅ INSTRUCTIONS D\'UTILISATION:');
console.log('==============================');
console.log('1. Copiez le JWT_SECRET de développement dans backend/.env');
console.log('2. Copiez le JWT_SECRET de production dans backend/.env.production');
console.log('3. Changez les mots de passe par les vôtres');
console.log('4. Redémarrez le backend: pm2 restart all');
console.log('');

console.log('🔐 SÉCURITÉ:');
console.log('============');
console.log('✅ Secrets générés aléatoirement');
console.log('✅ Longueur suffisante pour la sécurité');
console.log('✅ Différents pour dev et production');
console.log('✅ Uniques à votre projet');
console.log('');

console.log('⚠️ IMPORTANT:');
console.log('=============');
console.log('• Ne partagez JAMAIS ces secrets');
console.log('• Gardez-les confidentiels');
console.log('• Utilisez des mots de passe différents');
console.log('• Sauvegardez ces informations en sécurité');

console.log('\n🎉 VOS JWT_SECRET SONT PRÊTS À UTILISER !');