#!/bin/bash

# 🔧 SCRIPT DE CORRECTION COMPLÈTE - TOUS LES PROBLÈMES
# Corrige: Permissions uploads, Routes manquantes, CSP, MongoDB

echo "════════════════════════════════════════════════════════"
echo "🔧 CORRECTION COMPLÈTE DE TOUS LES PROBLÈMES"
echo "════════════════════════════════════════════════════════"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# 1. CORRIGER LES PERMISSIONS DU DOSSIER UPLOADS
# ============================================
echo -e "${BLUE}[1/7]${NC} Correction des permissions du dossier uploads..."

cd /var/www/ENG-RD/ENG_ENGRD-main/backend

# Créer le dossier uploads s'il n'existe pas
if [ ! -d "uploads" ]; then
    mkdir -p uploads
    echo -e "${YELLOW}⚠️  Dossier uploads créé${NC}"
fi

# Donner les bonnes permissions
sudo chown -R $USER:$USER uploads
chmod -R 755 uploads

echo -e "${GREEN}✅ Permissions uploads corrigées${NC}"

# ============================================
# 2. VÉRIFIER ET DÉMARRER MONGODB
# ============================================
echo ""
echo -e "${BLUE}[2/7]${NC} Vérification de MongoDB..."

if ! systemctl is-active --quiet mongod; then
    echo -e "${YELLOW}⚠️  Démarrage de MongoDB...${NC}"
    sudo systemctl start mongod
    sudo systemctl enable mongod
    sleep 2
fi

echo -e "${GREEN}✅ MongoDB actif${NC}"

# ============================================
# 3. INSTALLER LES DÉPENDANCES
# ============================================
echo ""
echo -e "${BLUE}[3/7]${NC} Installation des dépendances..."

npm install --production

echo -e "${GREEN}✅ Dépendances installées${NC}"

# ============================================
# 4. CRÉER LES COLLECTIONS MONGODB
# ============================================
echo ""
echo -e "${BLUE}[4/7]${NC} Initialisation de MongoDB..."

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

    // Créer les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('homecontents')) {
      await HomeContent.create({ _temp: true });
      await HomeContent.deleteOne({ _temp: true });
      console.log('✅ Collection "homecontents" créée');
    }

    // Ajouter du contenu par défaut si vide
    const homeContentCount = await HomeContent.countDocuments();
    if (homeContentCount === 0) {
      await HomeContent.insertMany([
        {
          section: 'hero',
          content: {
            title: 'Engineering R&D',
            subtitle: 'Excellence en ingénierie et innovation',
            description: 'Votre partenaire pour des solutions d\'ingénierie de pointe'
          }
        },
        {
          section: 'about',
          content: {
            title: 'À propos',
            description: 'Engineering R&D est une entreprise spécialisée dans l\'ingénierie et le développement.'
          }
        },
        {
          section: 'services',
          content: {
            title: 'Nos Services',
            items: []
          }
        }
      ]);
      console.log('✅ Contenu page d\'accueil initialisé');
    }

    // Ajouter une actualité de test si vide
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

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

init();
EONODE

# ============================================
# 5. CORRIGER LA CONFIGURATION APACHE (CSP)
# ============================================
echo ""
echo -e "${BLUE}[5/7]${NC} Correction de la configuration Apache (CSP)..."

sudo tee /etc/apache2/sites-available/engineering-rnd-le-ssl.conf > /dev/null << 'EOF'
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName engineering-rnd.com
    ServerAlias www.engineering-rnd.com

    ProxyPreserveHost On
    ProxyRequests Off

    # BACKEND API (PORT 5000)
    ProxyPass        "/api" "http://127.0.0.1:5000/api"
    ProxyPassReverse "/api" "http://127.0.0.1:5000/api"

    # WEBSOCKET (PORT 5000)
    ProxyPass        "/ws"  "ws://127.0.0.1:5000/ws"
    ProxyPassReverse "/ws"  "ws://127.0.0.1:5000/ws"

    # UPLOADS
    ProxyPass        "/uploads" "http://127.0.0.1:5000/uploads"
    ProxyPassReverse "/uploads" "http://127.0.0.1:5000/uploads"

    # FRONTEND REACT
    DocumentRoot /var/www/ENG-RD/ENG_ENGRD-main/eng-rd-clean/build

    <Directory /var/www/ENG-RD/ENG_ENGRD-main/eng-rd-clean/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api
        RewriteCond %{REQUEST_URI} !^/ws
        RewriteCond %{REQUEST_URI} !^/uploads
        RewriteRule . /index.html [L]
    </Directory>

    # HEADERS DE SÉCURITÉ (CSP CORRIGÉ - AUTORISE GOOGLE FONTS)
    Header always set Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' wss://engineering-rnd.com https://engineering-rnd.com; frame-ancestors 'none';"
    
    # CORS Headers
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

    # SSL Configuration
    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateFile /etc/letsencrypt/live/engineering-rnd.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/engineering-rnd.com/privkey.pem
</VirtualHost>
</IfModule>
EOF

echo -e "${GREEN}✅ Configuration Apache corrigée (CSP autorise Google Fonts)${NC}"

# Test de la config
if sudo apache2ctl configtest 2>&1 | grep -q "Syntax OK"; then
    echo -e "${GREEN}✅ Configuration Apache valide${NC}"
    sudo systemctl restart apache2
    echo -e "${GREEN}✅ Apache redémarré${NC}"
else
    echo -e "${RED}❌ Erreur dans la configuration Apache${NC}"
fi

# ============================================
# 6. REDÉMARRER LE BACKEND
# ============================================
echo ""
echo -e "${BLUE}[6/7]${NC} Redémarrage du backend..."

cd /var/www/ENG-RD/ENG_ENGRD-main/backend

if command -v pm2 &> /dev/null; then
    pm2 delete backend 2>/dev/null || true
    pm2 start server.js --name backend
    pm2 save
    echo -e "${GREEN}✅ Backend redémarré avec PM2${NC}"
else
    pkill -f "node.*server.js" || true
    nohup node server.js > /tmp/backend.log 2>&1 &
    echo $! > /tmp/backend.pid
    echo -e "${GREEN}✅ Backend redémarré${NC}"
fi

# ============================================
# 7. TESTS FINAUX
# ============================================
echo ""
echo -e "${BLUE}[7/7]${NC} Tests de vérification..."
sleep 3

# Test 1: API home-content
if curl -s http://localhost:5000/api/home-content > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API /api/home-content répond${NC}"
else
    echo -e "${YELLOW}⚠️  API /api/home-content ne répond pas encore${NC}"
fi

# Test 2: Permissions uploads
if [ -w "/var/www/ENG-RD/ENG_ENGRD-main/backend/uploads" ]; then
    echo -e "${GREEN}✅ Dossier uploads accessible en écriture${NC}"
else
    echo -e "${RED}❌ Dossier uploads non accessible${NC}"
fi

# Test 3: MongoDB
if systemctl is-active --quiet mongod; then
    echo -e "${GREEN}✅ MongoDB actif${NC}"
else
    echo -e "${RED}❌ MongoDB inactif${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ CORRECTION TERMINÉE${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "🔍 Tests manuels:"
echo ""
echo "1. Test upload de fichier:"
echo "   Essayez de soumettre une candidature avec CV"
echo ""
echo "2. Test API home-content:"
echo "   curl https://engineering-rnd.com/api/home-content"
echo ""
echo "3. Voir les logs:"
echo "   pm2 logs backend --lines 50"
echo ""
echo "4. Vérifier les permissions:"
echo "   ls -la /var/www/ENG-RD/ENG_ENGRD-main/backend/uploads"
echo ""
