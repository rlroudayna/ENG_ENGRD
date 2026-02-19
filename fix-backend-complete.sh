#!/bin/bash

# 🔧 SCRIPT DE RÉPARATION COMPLÈTE DU BACKEND
# Ce script répare TOUT: MongoDB, Backend, Collections, Données

echo "════════════════════════════════════════════════════════"
echo "🔧 RÉPARATION COMPLÈTE DU BACKEND"
echo "════════════════════════════════════════════════════════"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. VÉRIFIER ET DÉMARRER MONGODB
echo -e "${BLUE}[1/8]${NC} Vérification de MongoDB..."
if ! systemctl is-active --quiet mongod; then
    echo -e "${YELLOW}⚠️  MongoDB n'est pas démarré${NC}"
    echo "Démarrage de MongoDB..."
    sudo systemctl start mongod
    sudo systemctl enable mongod
    sleep 3
    
    if systemctl is-active --quiet mongod; then
        echo -e "${GREEN}✅ MongoDB démarré${NC}"
    else
        echo -e "${RED}❌ Échec du démarrage de MongoDB${NC}"
        echo "Vérifiez les logs: sudo journalctl -u mongod -n 50"
        exit 1
    fi
else
    echo -e "${GREEN}✅ MongoDB est déjà démarré${NC}"
fi

# 2. ALLER DANS LE BON DOSSIER
echo ""
echo -e "${BLUE}[2/8]${NC} Navigation vers le dossier backend..."
cd /var/www/ENG-RD/ENG_ENGRD-main/backend || {
    echo -e "${RED}❌ Dossier backend introuvable${NC}"
    exit 1
}
echo -e "${GREEN}✅ Dans le dossier: $(pwd)${NC}"

# 3. INSTALLER LES DÉPENDANCES
echo ""
echo -e "${BLUE}[3/8]${NC} Installation des dépendances..."
npm install --production
echo -e "${GREEN}✅ Dépendances installées${NC}"

# 4. VÉRIFIER LE FICHIER .env
echo ""
echo -e "${BLUE}[4/8]${NC} Vérification du fichier .env..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Fichier .env manquant, création...${NC}"
    cat > .env << 'EOF'
PORT=5000
MONGO_URI=mongodb://localhost:27017/engrd
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_production
NODE_ENV=production
EOF
    echo -e "${GREEN}✅ Fichier .env créé${NC}"
else
    echo -e "${GREEN}✅ Fichier .env existe${NC}"
fi

# Afficher la config MongoDB
echo "Configuration MongoDB:"
grep MONGO_URI .env || echo "MONGO_URI=mongodb://localhost:27017/engrd"

# 5. TESTER LA CONNEXION MONGODB
echo ""
echo -e "${BLUE}[5/8]${NC} Test de connexion MongoDB..."
node << 'EONODE'
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/engrd';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('\x1b[32m✅ Connexion MongoDB réussie\x1b[0m');
    console.log('Base de données:', mongoose.connection.db.databaseName);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('\x1b[31m❌ Erreur de connexion MongoDB:\x1b[0m', err.message);
    process.exit(1);
  });
EONODE

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Impossible de se connecter à MongoDB${NC}"
    exit 1
fi

# 6. CRÉER LES COLLECTIONS ET INITIALISER LES DONNÉES
echo ""
echo -e "${BLUE}[6/8]${NC} Création des collections et initialisation..."
cd /var/www/ENG-RD/ENG_ENGRD-main
node << 'EONODE'
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const Job = require('./backend/models/Job');
const News = require('./backend/models/News');
const Application = require('./backend/models/application');
const Message = require('./backend/models/Message');
const HomeContent = require('./backend/models/HomeContent');

async function init() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/engrd';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Créer les collections si elles n'existent pas
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('jobs')) {
      await Job.create({ _temp: true });
      await Job.deleteOne({ _temp: true });
      console.log('✅ Collection "jobs" créée');
    }

    if (!collectionNames.includes('news')) {
      await News.create({ _temp: true });
      await News.deleteOne({ _temp: true });
      console.log('✅ Collection "news" créée');
    }

    if (!collectionNames.includes('applications')) {
      await Application.create({ _temp: true });
      await Application.deleteOne({ _temp: true });
      console.log('✅ Collection "applications" créée');
    }

    if (!collectionNames.includes('messages')) {
      await Message.create({ _temp: true });
      await Message.deleteOne({ _temp: true });
      console.log('✅ Collection "messages" créée');
    }

    if (!collectionNames.includes('homecontents')) {
      await HomeContent.create({ _temp: true });
      await HomeContent.deleteOne({ _temp: true });
      console.log('✅ Collection "homecontents" créée');
    }

    // Ajouter des données de test si vide
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.create({
        title: 'Bienvenue sur Engineering R&D',
        content: 'Nous sommes ravis de vous accueillir sur notre plateforme.',
        status: 'published',
        publishedAt: new Date()
      });
      console.log('✅ Actualité de test créée');
    }

    const homeContentCount = await HomeContent.countDocuments();
    if (homeContentCount === 0) {
      await HomeContent.create({
        section: 'hero',
        content: {
          title: 'Engineering R&D',
          subtitle: 'Excellence en ingénierie'
        }
      });
      console.log('✅ Contenu page d\'accueil créé');
    }

    console.log('\n📊 Résumé:');
    console.log('- Jobs:', await Job.countDocuments());
    console.log('- News:', await News.countDocuments());
    console.log('- Applications:', await Application.countDocuments());
    console.log('- Messages:', await Message.countDocuments());
    console.log('- HomeContents:', await HomeContent.countDocuments());

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

init();
EONODE

# 7. ARRÊTER L'ANCIEN BACKEND
echo ""
echo -e "${BLUE}[7/8]${NC} Arrêt de l'ancien backend..."
pkill -f "node.*server.js" || echo "Aucun processus backend à arrêter"
sleep 2

# 8. DÉMARRER LE BACKEND
echo ""
echo -e "${BLUE}[8/8]${NC} Démarrage du backend..."
cd /var/www/ENG-RD/ENG_ENGRD-main/backend

# Vérifier si PM2 est installé
if command -v pm2 &> /dev/null; then
    echo "Utilisation de PM2..."
    pm2 delete backend 2>/dev/null || true
    pm2 start server.js --name backend
    pm2 save
    echo -e "${GREEN}✅ Backend démarré avec PM2${NC}"
else
    echo "Démarrage en arrière-plan..."
    nohup node server.js > /tmp/backend.log 2>&1 &
    echo $! > /tmp/backend.pid
    echo -e "${GREEN}✅ Backend démarré (PID: $(cat /tmp/backend.pid))${NC}"
fi

sleep 3

# VÉRIFICATION FINALE
echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ RÉPARATION TERMINÉE${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "🔍 Vérifications:"
echo ""

# Test de l'API
echo "Test de l'API /api/news..."
curl -s http://localhost:5000/api/news > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API répond correctement${NC}"
else
    echo -e "${YELLOW}⚠️  API ne répond pas encore (attendez 10 secondes)${NC}"
fi

echo ""
echo "📝 Commandes utiles:"
echo "  - Voir les logs: tail -f /tmp/backend.log"
echo "  - Statut PM2: pm2 status"
echo "  - Redémarrer: pm2 restart backend"
echo "  - Tester l'API: curl http://localhost:5000/api/news"
echo ""
