# 🚀 DÉPLOIEMENT FINAL ENG RND - GUIDE SIMPLIFIÉ

## ✅ TOUT EST PRÊT ! Suivez ces étapes dans l'ordre :

---

## 📋 ÉTAPE 1: BUILDS DE PRODUCTION (2 min)

```bash
# Exécuter le script de build
build-production.bat
```

**Résultat attendu :**
- ✅ Dossier `build-public/` créé
- ✅ Dossier `build-admin/` créé

---

## 🌐 ÉTAPE 2: CONFIGURATION DNS (5 min)

**Chez votre fournisseur de domaine, ajoutez :**
```
Type A: admin.eng-rnd.com → IP_DE_VOTRE_SERVEUR
```

**Vérification :**
```bash
nslookup admin.eng-rnd.com
```

---

## 🖥️ ÉTAPE 3: PRÉPARATION SERVEUR (10 min)

### **Connexion au serveur :**
```bash
ssh votre_user@IP_SERVEUR
```

### **Installation rapide :**
```bash
# Mise à jour
sudo apt update

# Nginx + Certbot
sudo apt install nginx certbot python3-certbot-nginx

# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# PM2 pour le backend
sudo npm install -g pm2

# MongoDB (si pas installé)
sudo apt install mongodb

# Création des dossiers
sudo mkdir -p /var/www/eng-rnd/{public,admin,backend,uploads}
sudo chown -R $USER:$USER /var/www/eng-rnd
```

---

## 📤 ÉTAPE 4: UPLOAD DES FICHIERS (5 min)

### **Depuis votre machine locale :**

```bash
# Variables (modifiez avec vos vraies valeurs)
SERVER="votre_user@IP_SERVEUR"

# Upload site public
scp -r build-public/* $SERVER:/var/www/eng-rnd/public/

# Upload admin
scp -r build-admin/* $SERVER:/var/www/eng-rnd/admin/

# Upload backend
scp -r backend/ $SERVER:/var/www/eng-rnd/

# Upload configuration Nginx
scp nginx-config.conf $SERVER:/tmp/

# Upload script de démarrage backend
scp start-backend-production.sh $SERVER:/tmp/
```

---

## ⚙️ ÉTAPE 5: CONFIGURATION NGINX (3 min)

### **Sur le serveur :**
```bash
# Configuration Nginx
sudo cp /tmp/nginx-config.conf /etc/nginx/sites-available/eng-rnd
sudo ln -sf /etc/nginx/sites-available/eng-rnd /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Redémarrage
sudo systemctl reload nginx
```

---

## 🔐 ÉTAPE 6: CERTIFICATS SSL (2 min)

```bash
sudo certbot --nginx -d eng-rnd.com -d www.eng-rnd.com -d admin.eng-rnd.com
```

---

## 🔧 ÉTAPE 7: BACKEND EN PRODUCTION (5 min)

```bash
# Rendre le script exécutable
chmod +x /tmp/start-backend-production.sh

# Exécuter le script
sudo /tmp/start-backend-production.sh
```

**Le script va :**
- ✅ Installer les dépendances
- ✅ Créer le fichier .env
- ✅ Tester MongoDB
- ✅ Démarrer avec PM2

### **Configuration .env :**
```bash
cd /var/www/eng-rnd/backend
nano .env
```

**Modifiez ces valeurs importantes :**
```env
JWT_SECRET=VOTRE_CLE_SECRETE_FORTE_UNIQUE
MONGODB_URI=mongodb://localhost:27017/eng-rnd-production
EMAIL_USER=contact@eng-rnd.com
EMAIL_PASS=VOTRE_MOT_DE_PASSE_EMAIL
```

---

## 🛡️ ÉTAPE 8: SÉCURISATION IP (2 min)

### **Modifier les restrictions IP :**
```bash
sudo nano /etc/nginx/sites-available/eng-rnd
```

**Décommentez et modifiez :**
```nginx
# Dans la section admin.eng-rnd.com
allow 41.248.XXX.XXX;    # Votre vraie IP
deny all;
```

**Redémarrer :**
```bash
sudo systemctl reload nginx
```

---

## ✅ ÉTAPE 9: TESTS FINAUX (3 min)

### **Tests automatiques :**
```bash
# Test site public
curl -I https://eng-rnd.com

# Test admin (depuis IP autorisée)
curl -I https://admin.eng-rnd.com

# Test API
curl https://eng-rnd.com/api/jobs

# Test backend
pm2 status
```

### **Tests manuels :**
- 🌐 Ouvrir https://eng-rnd.com
- 🔒 Ouvrir https://admin.eng-rnd.com
- 📝 Tester le login admin
- 📧 Tester le formulaire de contact

---

## 🎉 FÉLICITATIONS !

### **Votre plateforme ENG RND est déployée :**

- 🌐 **Site public** : https://eng-rnd.com
- 🔒 **Interface admin** : https://admin.eng-rnd.com
- 🛡️ **Sécurité** : SSL + IP restrictions + JWT
- 📊 **Backend** : PM2 + MongoDB + Logs

---

## 📞 COMMANDES DE MAINTENANCE

```bash
# Logs backend
pm2 logs eng-rnd-backend

# Redémarrer backend
pm2 restart eng-rnd-backend

# Logs Nginx
sudo tail -f /var/log/nginx/admin.access.log

# Backup base de données
mongodump --db eng-rnd-production --out /backup/$(date +%Y%m%d)
```

---

## 🚨 EN CAS DE PROBLÈME

### **Site ne s'affiche pas :**
1. `sudo nginx -t` - Vérifier config
2. `sudo systemctl status nginx` - Vérifier service
3. `nslookup eng-rnd.com` - Vérifier DNS

### **Admin inaccessible :**
1. Vérifier votre IP : `curl ifconfig.me`
2. Modifier Nginx avec la bonne IP
3. `sudo systemctl reload nginx`

### **Backend ne répond pas :**
1. `pm2 status` - Vérifier statut
2. `pm2 logs eng-rnd-backend` - Voir erreurs
3. `sudo systemctl status mongodb` - Vérifier DB

---

**🎯 VOTRE PLATEFORME ENG RND EST MAINTENANT EN PRODUCTION !**

**Temps total estimé : 30-40 minutes**