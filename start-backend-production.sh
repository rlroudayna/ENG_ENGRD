#!/bin/bash
# Script de démarrage backend ENG RND en production

echo "🚀 DÉMARRAGE BACKEND ENG RND - PRODUCTION"
echo "========================================"

# Variables
BACKEND_DIR="/var/www/eng-rnd/backend"
APP_NAME="eng-rnd-backend"

echo ""
echo "📁 Dossier backend: $BACKEND_DIR"

# Vérifier que le dossier existe
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Dossier backend non trouvé: $BACKEND_DIR"
    exit 1
fi

# Aller dans le dossier backend
cd $BACKEND_DIR

echo "📦 Installation des dépendances..."
npm install --production

echo "🔧 Vérification de la configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant, création depuis le template..."
    cp .env.production .env
    echo "✏️  IMPORTANT: Modifiez le fichier .env avec vos vraies valeurs !"
    echo "   nano .env"
fi

echo "🔍 Test de connexion MongoDB..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eng-rnd-production')
  .then(() => { console.log('✅ MongoDB connecté'); process.exit(0); })
  .catch(err => { console.log('❌ Erreur MongoDB:', err.message); process.exit(1); });
"

if [ $? -ne 0 ]; then
    echo "❌ Impossible de se connecter à MongoDB"
    echo "Vérifiez votre configuration dans .env"
    exit 1
fi

echo "🔄 Arrêt de l'ancienne instance (si elle existe)..."
pm2 delete $APP_NAME 2>/dev/null || true

echo "🚀 Démarrage avec PM2..."
pm2 start server.js --name $APP_NAME --env production

echo "💾 Sauvegarde de la configuration PM2..."
pm2 save

echo "🔧 Configuration du démarrage automatique..."
pm2 startup

echo ""
echo "✅ BACKEND DÉMARRÉ AVEC SUCCÈS !"
echo ""
echo "📊 Commandes utiles:"
echo "pm2 status                 - Voir le statut"
echo "pm2 logs $APP_NAME         - Voir les logs"
echo "pm2 restart $APP_NAME      - Redémarrer"
echo "pm2 stop $APP_NAME         - Arrêter"
echo ""
echo "🌐 API disponible sur: http://localhost:5000"
echo "🔍 Test: curl http://localhost:5000/api/jobs"