# 🎯 GUIDE ÉTAPE PAR ÉTAPE - APRÈS LE BUILD

## 📋 **PRÉREQUIS AVANT DE COMMENCER**
- ✅ Vous avez exécuté `build-production.bat` avec succès
- ✅ Les dossiers `build-public/` et `build-admin/` sont créés
- ✅ Vous avez accès à votre serveur (SSH)
- ✅ Vous avez les droits admin sur votre domaine

---

## 🚀 **ÉTAPE 1 : VÉRIFIER LES BUILDS (2 min)**

### **1.1 - Vérifiez que les builds sont créés :**
```bash
dir build-public
dir build-admin
```

**Vous devriez voir :**
- `build-public/` avec index.html, static/, etc.
- `build-admin/` avec index.html, static/, etc.

### **1.2 - Si les builds ne sont pas là :**
```bash
# Relancez le build
build-production.bat
```

---

## 🌐 **ÉTAPE 2 : CONFIGURER LE DNS (5 min)**

### **2.1 - Connectez-vous à votre fournisseur de domaine**
(OVH, Gandi, Cloudflare, etc.)

### **2.2 - Ajoutez ces enregistrements DNS :**
```
Type: A
Nom: admin.eng-rnd.com
Valeur: [IP_DE_VOTRE_SERVEUR]
TTL: 300 (ou minimum)
```

### **2.3 - Vérifiez la propagation :**
```bash
# Testez dans 5-10 minutes
nslookup admin.eng-rnd.com
```

---

## 📤 **ÉTAPE 3 : PRÉPARER LE DÉPLOIEMENT (3 min)**

### **3.1 - Modifiez le script de déploiement :**
```bash
# Ouvrez deploy-to-server.sh
notepad deploy-to-server.sh
```

### **3.2 - Remplacez ces valeurs :**
```bash
SERVER_IP="VOTRE_VRAIE_IP_SERVEUR"     # Ex: 51.210.123.45
SERVER_USER="VOTRE_VRAIE_USER"         # Ex: ubuntu, root, admin
```

### **3.3 - Sauvegardez le fichier**

---

## 🚛 **ÉTAPE 4 : DÉPLOYER LES FICHIERS (10 min)**

### **4.1 - Option A : Script automatique (recommandé)**
```bash
# Rendez le script exécutable
chmod +x deploy-to-server.sh

# Lancez le déploiement
./deploy-to-server.sh
```

### **4.2 - Option B : Manuel (si script ne marche pas)**
```bash
# Créez les dossiers sur le serveur
ssh user@server "sudo mkdir -p /var/www/eng-rnd/{public,admin,backend}"

# Uploadez les fichiers
scp -r build-public/* user@server:/var/www/eng-rnd/public/
scp -r build-admin/* user@server:/var/www/eng-rnd/admin/
scp -r backend/ user@server:/var/www/eng-rnd/
scp nginx-config.conf user@server:/tmp/
```

---

## ⚙️ **ÉTAPE 5 : CONFIGURER NGINX (8 min)**

### **5.1 - Connectez-vous au serveur :**
```bash
ssh user@votre-serveur
```

### **5.2 - Installez Nginx (si pas déjà fait) :**
```bash
sudo apt update
sudo apt install nginx -y
```

### **5.3 - Configurez le site :**
```bash
# Copiez la config
sudo cp /tmp/nginx-config.conf /etc/nginx/sites-available/eng-rnd

# Activez le site
sudo ln -sf /etc/nginx/sites-available/eng-rnd /etc/nginx/sites-enabled/

# Désactivez le site par défaut
sudo rm -f /etc/nginx/sites-enabled/default

# Testez la config
sudo nginx -t
```

### **5.4 - Si le test est OK :**
```bash
sudo systemctl reload nginx
```

---

## 🔒 **ÉTAPE 6 : CONFIGURER SSL (5 min)**

### **6.1 - Installez Certbot :**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### **6.2 - Générez les certificats SSL :**
```bash
sudo certbot --nginx -d eng-rnd.com -d admin.eng-rnd.com
```

### **6.3 - Suivez les instructions :**
- Entrez votre email
- Acceptez les conditions
- Choisissez "2" pour rediriger HTTP vers HTTPS

---

## 🖥️ **ÉTAPE 7 : CONFIGURER LE BACKEND (10 min)**

### **7.1 - Allez dans le dossier backend :**
```bash
cd /var/www/eng-rnd/backend
```

### **7.2 - Installez Node.js (si pas déjà fait) :**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **7.3 - Configurez l'environnement :**
```bash
# Copiez le fichier d'environnement
cp .env.production .env

# Modifiez les variables importantes
nano .env
```

### **7.4 - Modifiez ces valeurs dans .env :**
```bash
JWT_SECRET=votre_secret_super_securise_ici
EMAIL_PASS=votre_mot_de_passe_email_app
ADMIN_EMAIL=votre@email.com
```

### **7.5 - Installez les dépendances :**
```bash
npm install
```

### **7.6 - Installez PM2 :**
```bash
sudo npm install -g pm2
```

### **7.7 - Démarrez le backend :**
```bash
pm2 start server.js --name eng-rnd-backend
pm2 save
pm2 startup
```

---

## 🛡️ **ÉTAPE 8 : SÉCURISER L'ADMIN (3 min)**

### **8.1 - Trouvez votre IP publique :**
```bash
curl ifconfig.me
```

### **8.2 - Modifiez la config Nginx :**
```bash
sudo nano /etc/nginx/sites-available/eng-rnd
```

### **8.3 - Trouvez cette section et décommentez :**
```nginx
# Dans la section admin.eng-rnd.com
location / {
    allow VOTRE_IP_ICI;  # Remplacez par votre vraie IP
    deny all;
    # ... reste de la config
}
```

### **8.4 - Rechargez Nginx :**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ **ÉTAPE 9 : TESTER TOUT (5 min)**

### **9.1 - Testez le site public :**
- Ouvrez https://eng-rnd.com
- Vérifiez que tout s'affiche bien
- Testez le formulaire de contact

### **9.2 - Testez l'admin :**
- Ouvrez https://admin.eng-rnd.com
- Connectez-vous avec vos identifiants
- Vérifiez que vous pouvez ajouter/modifier du contenu

### **9.3 - Testez depuis une autre IP :**
- Demandez à quelqu'un d'essayer d'accéder à admin.eng-rnd.com
- Il devrait être bloqué (erreur 403)

---

## 🎉 **FÉLICITATIONS ! VOTRE SITE EST EN LIGNE !**

### **📊 Monitoring et maintenance :**
```bash
# Voir les logs du backend
pm2 logs eng-rnd-backend

# Voir les logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Redémarrer le backend si besoin
pm2 restart eng-rnd-backend
```

---

## 🆘 **EN CAS DE PROBLÈME**

### **Si le site ne s'affiche pas :**
1. Vérifiez les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
2. Vérifiez que les fichiers sont bien uploadés : `ls -la /var/www/eng-rnd/public/`
3. Testez la config Nginx : `sudo nginx -t`

### **Si l'admin ne marche pas :**
1. Vérifiez les logs du backend : `pm2 logs`
2. Vérifiez que le backend tourne : `pm2 status`
3. Testez l'API : `curl http://localhost:5000/api/health`

### **Si les emails ne partent pas :**
1. Vérifiez le fichier .env
2. Vérifiez que EMAIL_PASS est correct
3. Testez depuis l'admin

---

## 📞 **BESOIN D'AIDE ?**

**Contactez-moi avec :**
- L'étape où vous êtes bloqué
- Le message d'erreur exact
- Les logs pertinents

**🚀 TEMPS TOTAL ESTIMÉ : 45-60 MINUTES**

**✨ BONNE CHANCE ! VOTRE PLATEFORME ENG RND VA ÊTRE PARFAITE ! ✨**