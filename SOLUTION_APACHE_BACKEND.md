# 🔧 SOLUTION COMPLÈTE - APACHE + BACKEND + MONGODB

## 🚨 PROBLÈMES IDENTIFIÉS

1. ❌ **Apache pointe vers le port 3000** mais le backend tourne sur le port **5000**
2. ❌ **404 sur /api/news** - Apache ne trouve pas le backend
3. ❌ **WebSocket échoue** - Mauvais port configuré
4. ❌ **CSP bloque les WebSockets** - Politique de sécurité trop stricte

---

## ✅ SOLUTION ÉTAPE PAR ÉTAPE

### ÉTAPE 1: CORRIGER LA CONFIGURATION APACHE

```bash
# Sur le VPS, éditer la config Apache
sudo nano /etc/apache2/sites-available/engineering-rnd-le-ssl.conf
```

**Remplacer TOUT le contenu par:**

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName engineering-rnd.com
    ServerAlias www.engineering-rnd.com

    # Activer les modules nécessaires
    ProxyPreserveHost On
    ProxyRequests Off

    # ============================================
    # BACKEND API (PORT 5000 - PAS 3000!)
    # ============================================
    ProxyPass        "/api" "http://127.0.0.1:5000/api"
    ProxyPassReverse "/api" "http://127.0.0.1:5000/api"

    # ============================================
    # WEBSOCKET (PORT 5000 - PAS 3000!)
    # ============================================
    ProxyPass        "/ws"  "ws://127.0.0.1:5000/ws"
    ProxyPassReverse "/ws"  "ws://127.0.0.1:5000/ws"

    # ============================================
    # UPLOADS (Fichiers statiques)
    # ============================================
    ProxyPass        "/uploads" "http://127.0.0.1:5000/uploads"
    ProxyPassReverse "/uploads" "http://127.0.0.1:5000/uploads"

    # ============================================
    # FRONTEND REACT (Fichiers statiques)
    # ============================================
    DocumentRoot /var/www/ENG-RD/ENG_ENGRD-main/eng-rd-clean/build

    <Directory /var/www/ENG-RD/ENG_ENGRD-main/eng-rd-clean/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # React Router - Rediriger toutes les routes vers index.html
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

    # ============================================
    # HEADERS DE SÉCURITÉ (CSP corrigé)
    # ============================================
    Header always set Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss://engineering-rnd.com https://engineering-rnd.com; frame-ancestors 'none';"
    
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
```

**Sauvegarder:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

### ÉTAPE 2: ACTIVER LES MODULES APACHE NÉCESSAIRES

```bash
# Activer les modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
```

---

### ÉTAPE 3: TESTER LA CONFIGURATION APACHE

```bash
# Vérifier qu'il n'y a pas d'erreurs de syntaxe
sudo apache2ctl configtest
```

**Tu dois voir:** `Syntax OK`

---

### ÉTAPE 4: REDÉMARRER APACHE

```bash
sudo systemctl restart apache2
```

---

### ÉTAPE 5: VÉRIFIER QUE LE BACKEND TOURNE SUR LE PORT 5000

```bash
# Vérifier les processus Node.js
ps aux | grep node

# Vérifier que le port 5000 est ouvert
sudo netstat -tulpn | grep 5000
```

**Tu dois voir:** `tcp ... 0.0.0.0:5000 ... node`

---

### ÉTAPE 6: SI LE BACKEND NE TOURNE PAS, LE DÉMARRER

```bash
# Aller dans le dossier backend
cd /var/www/ENG-RD/ENG_ENGRD-main/backend

# Vérifier le fichier .env
cat .env

# Doit contenir:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/engrd

# Démarrer avec PM2
pm2 delete backend 2>/dev/null || true
pm2 start server.js --name backend
pm2 save
pm2 startup
```

---

### ÉTAPE 7: VÉRIFIER QUE MONGODB EST DÉMARRÉ

```bash
sudo systemctl status mongod
```

**Si pas démarré:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

### ÉTAPE 8: CRÉER LES COLLECTIONS MONGODB

```bash
cd /var/www/ENG-RD/ENG_ENGRD-main
./fix-backend-complete.sh
```

---

### ÉTAPE 9: VÉRIFIER QUE TOUT FONCTIONNE

```bash
# Test 1: Backend répond
curl http://localhost:5000/api/news

# Test 2: Apache proxy fonctionne
curl https://engineering-rnd.com/api/news

# Test 3: Voir les logs du backend
pm2 logs backend --lines 50
```

---

## 🔥 FIREWALL (UFW) - FERMER LE PORT 3000

Le port 3000 ne devrait PAS être ouvert publiquement:

```bash
# Supprimer la règle pour le port 3000
sudo ufw delete allow 3000

# Vérifier
sudo ufw status
```

**Configuration UFW correcte:**
```
22022/tcp    ALLOW    Anywhere  (SSH)
443/tcp      ALLOW    Anywhere  (HTTPS)
80/tcp       ALLOW    Anywhere  (HTTP)
```

---

## 📊 VÉRIFICATION FINALE

### Test 1: API News
```bash
curl https://engineering-rnd.com/api/news
```
**Résultat attendu:** JSON avec les actualités

### Test 2: API Jobs
```bash
curl https://engineering-rnd.com/api/jobs
```
**Résultat attendu:** JSON avec les offres

### Test 3: Page d'accueil
```bash
curl https://engineering-rnd.com/
```
**Résultat attendu:** HTML de React

---

## 🐛 DÉPANNAGE

### Problème: "502 Bad Gateway"
```bash
# Vérifier que le backend tourne
pm2 status

# Redémarrer le backend
pm2 restart backend

# Voir les logs
pm2 logs backend
```

### Problème: "404 Not Found"
```bash
# Vérifier la config Apache
sudo apache2ctl configtest

# Redémarrer Apache
sudo systemctl restart apache2
```

### Problème: "Connection refused"
```bash
# Vérifier que MongoDB tourne
sudo systemctl status mongod

# Vérifier que le backend écoute sur 5000
sudo netstat -tulpn | grep 5000
```

### Problème: "Empty response"
```bash
# Vérifier les logs Apache
sudo tail -f /var/log/apache2/error.log

# Vérifier les logs du backend
pm2 logs backend
```

---

## 📝 RÉSUMÉ DES CHANGEMENTS

| Avant | Après |
|-------|-------|
| Apache → Port 3000 ❌ | Apache → Port 5000 ✅ |
| Backend pas démarré ❌ | Backend sur PM2 ✅ |
| MongoDB pas initialisé ❌ | Collections créées ✅ |
| Port 3000 ouvert ❌ | Port 3000 fermé ✅ |
| CSP bloque WebSocket ❌ | CSP autorise WebSocket ✅ |

---

## ✅ CHECKLIST FINALE

- [ ] Apache configuré sur port 5000
- [ ] Modules Apache activés (proxy, rewrite, headers)
- [ ] Apache redémarré sans erreur
- [ ] Backend tourne sur port 5000 (PM2)
- [ ] MongoDB démarré et collections créées
- [ ] Port 3000 fermé dans UFW
- [ ] API /api/news répond
- [ ] Site accessible sur https://engineering-rnd.com

---

**Date:** $(date)
**Statut:** ✅ Prêt à déployer
