# 🚀 GUIDE DE DÉPLOIEMENT COMPLET - ENG RND

## 📋 TOUT EST PRÊT ! Voici ce que vous devez faire :

---

## 🎯 ÉTAPE 1: PRÉPARATION LOCALE (5 min)

### **1.1 Installer les dépendances manquantes**
```bash
cd eng-rd-clean
npm install cross-env --save-dev
```

### **1.2 Remplacer package.json**
- Copiez le contenu de `package-production.json` dans `eng-rd-clean/package.json`

### **1.3 Créer les builds de production**
```bash
# Exécuter le script de build
build-production.bat
```

**Résultat attendu :**
- ✅ Dossier `build-public/` créé (site public)
- ✅ Dossier `build-admin/` créé (interface admin)

---

## 🌐 ÉTAPE 2: CONFIGURATION DNS (10 min)

### **Chez votre fournisseur DNS :**
```
Type A: eng-rnd.com      → IP_DE_VOTRE_SERVEUR
Type A: www.eng-rnd.com  → IP_DE_VOTRE_SERVEUR  
Type A: admin.eng-rnd.com → IP_DE_VOTRE_SERVEUR
```

**Vérification :**
```bash
nslookup eng-rnd.com
nslookup admin.eng-rnd.com
```

---

## 🖥️ ÉTAPE 3: PRÉPARATION SERVEUR (15 min)

### **3.1 Connexion au serveur**
```bash
ssh votre_user@IP_SERVEUR
```

### **3.2 Installation des prérequis**
```bash
# Nginx
sudo apt update
sudo apt install nginx

# Certbot pour SSL
sudo apt install certbot python3-certbot-nginx

# Node.js pour le backend
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# MongoDB (si pas déjà installé)
sudo apt install mongodb
```

### **3.3 Configuration des dossiers**
```bash
sudo mkdir -p /var/www/eng-rnd/public
sudo mkdir -p /var/www/eng-rnd/admin
sudo mkdir -p /var/log/eng-rnd
sudo chown -R $USER:$USER /var/www/eng-rnd
```

---

## 📤 ÉTAPE 4: DÉPLOIEMENT (10 min)

### **4.1 Modifier le script de déploiement**
Éditez `deploy-to-server.sh` :
```bash
SERVER_IP="VOTRE_VRAIE_IP"
SERVER_USER="VOTRE_VRAIE_USER"
```

### **4.2 Rendre le script exécutable**
```bash
chmod +x deploy-to-server.sh
```

### **4.3 Exécuter le déploiement**
```bash
./deploy-to-server.sh
```

**OU manuellement :**
```bash
# Upload site public
scp -r build-public/* user@server:/var/www/eng-rnd/public/

# Upload admin
scp -r build-admin/* user@server:/var/www/eng-rnd/admin/

# Upload config Nginx
scp nginx-config.conf user@server:/tmp/
```

---

## ⚙️ ÉTAPE 5: CONFIGURATION NGINX (5 min)

### **Sur le serveur :**
```bash
# Copier la configuration
sudo cp /tmp/nginx-config.conf /etc/nginx/sites-available/eng-rnd

# Activer le site
sudo ln -sf /etc/nginx/sites-available/eng-rnd /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl reload nginx
```

---

## 🔐 ÉTAPE 6: CERTIFICATS SSL (5 min)

```bash
sudo certbot --nginx -d eng-rnd.com -d www.eng-rnd.com -d admin.eng-rnd.com
```

**Suivez les instructions de Certbot.**

---

## 🔧 ÉTAPE 7: BACKEND EN PRODUCTION (10 min)

### **7.1 Uploader le backend**
```bash
scp -r backend/ user@server:/var/www/eng-rnd/
```

### **7.2 Configuration backend**
```bash
# Sur le serveur
cd /var/www/eng-rnd/backend

# Copier la config production
cp ../backend-production.env .env

# Modifier les valeurs dans .env
nano .env
```

**Modifiez ces valeurs :**
```env
JWT_SECRET=VOTRE_CLE_SECRETE_FORTE
MONGODB_URI=mongodb://localhost:27017/eng-rnd-production
EMAIL_USER=contact@eng-rnd.com
EMAIL_PASS=VOTRE_MOT_DE_PASSE
```

### **7.3 Installer et démarrer**
```bash
npm install
npm install -g pm2

# Démarrer avec PM2
pm2 start server.js --name "eng-rnd-backend"
pm2 startup
pm2 save
```

---

## 🛡️ ÉTAPE 8: SÉCURISATION IP (5 min)

### **Modifier nginx-config.conf sur le serveur :**
```bash
sudo nano /etc/nginx/sites-available/eng-rnd
```

**Décommentez et modifiez les lignes IP :**
```nginx
# Dans la section admin.eng-rnd.com
allow 41.248.XXX.XXX;    # Votre vraie IP
allow 192.168.1.XXX;     # IP bureau si différente
deny all;
```

**Redémarrer Nginx :**
```bash
sudo systemctl reload nginx
```

---

## ✅ ÉTAPE 9: TESTS FINAUX (5 min)

### **9.1 Tester le site public**
- Ouvrir https://eng-rnd.com
- ✅ Vérifier que le site s'affiche
- ✅ Tester la navigation
- ✅ Vérifier que /admin retourne 404

### **9.2 Tester l'interface admin**
- Ouvrir https://admin.eng-rnd.com
- ✅ Vérifier l'accès (ou restriction IP)
- ✅ Tester le login admin
- ✅ Vérifier les fonctionnalités

### **9.3 Tester le backend**
```bash
curl https://eng-rnd.com/api/jobs
curl https://admin.eng-rnd.com/api/jobs
```

---

## 🎉 FÉLICITATIONS !

### **Votre plateforme ENG RND est maintenant déployée :**

- 🌐 **Site public** : https://eng-rnd.com
- 🔒 **Interface admin** : https://admin.eng-rnd.com  
- 🛡️ **Sécurité** : SSL + Restrictions IP + JWT
- 📊 **Monitoring** : Logs séparés + PM2

---

## 📞 SUPPORT POST-DÉPLOIEMENT

### **Commandes utiles :**
```bash
# Logs Nginx
sudo tail -f /var/log/nginx/admin.access.log

# Logs Backend
pm2 logs eng-rnd-backend

# Statut services
sudo systemctl status nginx
pm2 status

# Redémarrer backend
pm2 restart eng-rnd-backend
```

### **Maintenance :**
- **Backup DB** : `mongodump --db eng-rnd-production`
- **Mise à jour** : Répéter les étapes 1-4
- **Monitoring** : Vérifier les logs régulièrement

---

## 🚨 EN CAS DE PROBLÈME

### **Site public ne s'affiche pas :**
1. Vérifier DNS : `nslookup eng-rnd.com`
2. Vérifier Nginx : `sudo nginx -t`
3. Vérifier logs : `sudo tail -f /var/log/nginx/error.log`

### **Admin inaccessible :**
1. Vérifier restrictions IP dans Nginx
2. Vérifier certificat SSL admin
3. Tester depuis IP autorisée

### **Backend ne répond pas :**
1. `pm2 status` - Vérifier si actif
2. `pm2 logs` - Voir les erreurs
3. Vérifier MongoDB : `sudo systemctl status mongodb`

---

**🎯 VOTRE PLATEFORME ENG RND EST PRÊTE POUR LA PRODUCTION !**