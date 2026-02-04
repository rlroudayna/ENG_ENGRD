#!/bin/bash
# Script de déploiement ENG RND - Sous-domaines sécurisés

echo "🚀 DÉPLOIEMENT ENG RND - PRODUCTION SÉCURISÉE"
echo "=============================================="

# Variables à configurer
SERVER_IP="VOTRE_IP_SERVEUR"
SERVER_USER="VOTRE_USER"
DOMAIN_PUBLIC="eng-rnd.com"
DOMAIN_ADMIN="admin.eng-rnd.com"

echo ""
echo "📋 Configuration:"
echo "Serveur: $SERVER_USER@$SERVER_IP"
echo "Public:  https://$DOMAIN_PUBLIC"
echo "Admin:   https://$DOMAIN_ADMIN"
echo ""

# Vérification des builds
if [ ! -d "build-public" ]; then
    echo "❌ Build public manquant. Exécutez d'abord build-production.bat"
    exit 1
fi

if [ ! -d "build-admin" ]; then
    echo "❌ Build admin manquant. Exécutez d'abord build-production.bat"
    exit 1
fi

echo "✅ Builds trouvés"

# Étape 1: Créer les dossiers sur le serveur
echo ""
echo "📁 Étape 1: Création des dossiers serveur..."
ssh $SERVER_USER@$SERVER_IP "
    sudo mkdir -p /var/www/eng-rnd/public
    sudo mkdir -p /var/www/eng-rnd/admin
    sudo chown -R $SERVER_USER:$SERVER_USER /var/www/eng-rnd
"

# Étape 2: Upload du site public
echo ""
echo "🌐 Étape 2: Upload site public..."
rsync -avz --delete build-public/ $SERVER_USER@$SERVER_IP:/var/www/eng-rnd/public/

# Étape 3: Upload de l'interface admin
echo ""
echo "🔒 Étape 3: Upload interface admin..."
rsync -avz --delete build-admin/ $SERVER_USER@$SERVER_IP:/var/www/eng-rnd/admin/

# Étape 4: Configuration Nginx
echo ""
echo "⚙️ Étape 4: Configuration Nginx..."
scp nginx-config.conf $SERVER_USER@$SERVER_IP:/tmp/eng-rnd.conf

ssh $SERVER_USER@$SERVER_IP "
    sudo cp /tmp/eng-rnd.conf /etc/nginx/sites-available/eng-rnd
    sudo ln -sf /etc/nginx/sites-available/eng-rnd /etc/nginx/sites-enabled/
    sudo nginx -t
"

# Étape 5: Certificats SSL
echo ""
echo "🔐 Étape 5: Configuration SSL..."
ssh $SERVER_USER@$SERVER_IP "
    sudo certbot --nginx -d $DOMAIN_PUBLIC -d www.$DOMAIN_PUBLIC -d $DOMAIN_ADMIN --non-interactive --agree-tos --email contact@eng-rnd.com
"

# Étape 6: Redémarrage services
echo ""
echo "🔄 Étape 6: Redémarrage services..."
ssh $SERVER_USER@$SERVER_IP "
    sudo systemctl reload nginx
    sudo systemctl status nginx
"

# Étape 7: Vérification
echo ""
echo "✅ Étape 7: Vérification déploiement..."
echo "🌐 Site public: https://$DOMAIN_PUBLIC"
echo "🔒 Admin: https://$DOMAIN_ADMIN"

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurer DNS: $DOMAIN_ADMIN → $SERVER_IP"
echo "2. Tester accès: https://$DOMAIN_PUBLIC"
echo "3. Tester admin: https://$DOMAIN_ADMIN"
echo "4. Configurer restrictions IP dans nginx-config.conf"
echo "5. Démarrer le backend sur le serveur"