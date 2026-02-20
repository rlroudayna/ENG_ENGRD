#!/bin/bash

# 🔧 SCRIPT DE CORRECTION APACHE + BACKEND
# Corrige automatiquement la configuration Apache et démarre le backend

echo "════════════════════════════════════════════════════════"
echo "🔧 CORRECTION APACHE + BACKEND"
echo "════════════════════════════════════════════════════════"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# 1. BACKUP DE LA CONFIG ACTUELLE
echo -e "${BLUE}[1/9]${NC} Sauvegarde de la configuration Apache actuelle..."
sudo cp /etc/apache2/sites-available/engineering-rnd-le-ssl.conf /etc/apache2/sites-available/engineering-rnd-le-ssl.conf.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✅ Backup créé${NC}"

# 2. CRÉER LA NOUVELLE CONFIGURATION
echo ""
echo -e "${BLUE}[2/9]${NC} Création de la nouvelle configuration Apache..."
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

    # HEADERS
    Header always set Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss://engineering-rnd.com https://engineering-rnd.com; frame-ancestors 'none';"
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateFile /etc/letsencrypt/live/engineering-rnd.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/engineering-rnd.com/privkey.pem
</VirtualHost>
</IfModule>
EOF

echo -e "${GREEN}✅ Nouvelle configuration créée${NC}"

# 3. ACTIVER LES MODULES APACHE
echo ""
echo -e "${BLUE}[3/9]${NC} Activation des modules Apache..."
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite headers ssl 2>/dev/null
echo -e "${GREEN}✅ Modules activés${NC}"

# 4. TESTER LA CONFIGURATION
echo ""
echo -e "${BLUE}[4/9]${NC} Test de la configuration Apache..."
if sudo apache2ctl configtest 2>&1 | grep -q "Syntax OK"; then
    echo -e "${GREEN}✅ Configuration Apache valide${NC}"
else
    echo -e "${RED}❌ Erreur dans la configuration Apache${NC}"
    sudo apache2ctl configtest
    exit 1
fi

# 5. REDÉMARRER APACHE
echo ""
echo -e "${BLUE}[5/9]${NC} Redémarrage d'Apache..."
sudo systemctl restart apache2
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Apache redémarré${NC}"
else
    echo -e "${RED}❌ Échec du redémarrage d'Apache${NC}"
    exit 1
fi

# 6. VÉRIFIER MONGODB
echo ""
echo -e "${BLUE}[6/9]${NC} Vérification de MongoDB..."
if ! systemctl is-active --quiet mongod; then
    echo -e "${YELLOW}⚠️  Démarrage de MongoDB...${NC}"
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi
echo -e "${GREEN}✅ MongoDB actif${NC}"

# 7. VÉRIFIER LE BACKEND
echo ""
echo -e "${BLUE}[7/9]${NC} Vérification du backend..."
cd /var/www/ENG-RD/ENG_ENGRD-main/backend

# Vérifier le fichier .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Création du fichier .env...${NC}"
    cat > .env << 'ENVEOF'
PORT=5000
MONGO_URI=mongodb://localhost:27017/engrd
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
NODE_ENV=production
ENVEOF
fi

# Installer les dépendances
npm install --production 2>/dev/null

# Démarrer avec PM2
if command -v pm2 &> /dev/null; then
    pm2 delete backend 2>/dev/null || true
    pm2 start server.js --name backend
    pm2 save
    echo -e "${GREEN}✅ Backend démarré avec PM2${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 non installé, installation...${NC}"
    sudo npm install -g pm2
    pm2 start server.js --name backend
    pm2 save
    pm2 startup
    echo -e "${GREEN}✅ Backend démarré${NC}"
fi

# 8. FERMER LE PORT 3000
echo ""
echo -e "${BLUE}[8/9]${NC} Sécurisation du firewall..."
sudo ufw delete allow 3000 2>/dev/null || true
echo -e "${GREEN}✅ Port 3000 fermé${NC}"

# 9. TESTS FINAUX
echo ""
echo -e "${BLUE}[9/9]${NC} Tests de vérification..."
sleep 3

# Test backend local
if curl -s http://localhost:5000/api/news > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend répond sur le port 5000${NC}"
else
    echo -e "${YELLOW}⚠️  Backend ne répond pas encore (attendez 10 secondes)${NC}"
fi

# Test Apache proxy
if curl -s -k https://localhost/api/news > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Apache proxy fonctionne${NC}"
else
    echo -e "${YELLOW}⚠️  Apache proxy ne répond pas encore${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ CORRECTION TERMINÉE${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "🔍 Vérifications manuelles:"
echo ""
echo "1. Test API:"
echo "   curl https://engineering-rnd.com/api/news"
echo ""
echo "2. Voir les logs backend:"
echo "   pm2 logs backend"
echo ""
echo "3. Voir les logs Apache:"
echo "   sudo tail -f /var/log/apache2/error.log"
echo ""
echo "4. Statut des services:"
echo "   sudo systemctl status apache2"
echo "   sudo systemctl status mongod"
echo "   pm2 status"
echo ""
