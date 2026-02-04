# 📝 AIDE-MÉMOIRE - COMMANDES IMPORTANTES

## 🚀 **COMMANDES LOCALES (sur votre PC)**

### **Vérifier l'état :**
```bash
# Vérifier que tout est prêt
node verifier-etapes.js

# Voir les builds créés
dir build-public
dir build-admin
```

### **Déploiement :**
```bash
# Modifier le script de déploiement
notepad deploy-to-server.sh

# Déployer (après avoir modifié les variables)
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

---

## 🖥️ **COMMANDES SERVEUR (via SSH)**

### **Connexion :**
```bash
ssh user@votre-serveur
```

### **Nginx :**
```bash
# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx

# Redémarrer Nginx
sudo systemctl restart nginx

# Voir les logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### **SSL avec Certbot :**
```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Générer les certificats
sudo certbot --nginx -d eng-rnd.com -d admin.eng-rnd.com

# Renouveler (automatique, mais pour tester)
sudo certbot renew --dry-run
```

### **Backend avec PM2 :**
```bash
# Aller dans le dossier backend
cd /var/www/eng-rnd/backend

# Installer les dépendances
npm install

# Démarrer avec PM2
pm2 start server.js --name eng-rnd-backend

# Voir le statut
pm2 status

# Voir les logs
pm2 logs eng-rnd-backend

# Redémarrer
pm2 restart eng-rnd-backend

# Sauvegarder la config PM2
pm2 save

# Auto-démarrage au boot
pm2 startup
```

### **Gestion des fichiers :**
```bash
# Voir les permissions
ls -la /var/www/eng-rnd/

# Changer les permissions si besoin
sudo chown -R www-data:www-data /var/www/eng-rnd/
sudo chmod -R 755 /var/www/eng-rnd/
```

---

## 🔧 **COMMANDES DE DIAGNOSTIC**

### **Tester les services :**
```bash
# Tester Nginx
curl -I http://localhost

# Tester le backend
curl http://localhost:5000/api/health

# Tester les domaines
curl -I https://eng-rnd.com
curl -I https://admin.eng-rnd.com
```

### **Voir les processus :**
```bash
# Voir les processus Node.js
ps aux | grep node

# Voir les processus Nginx
ps aux | grep nginx

# Voir les ports utilisés
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :5000
```

---

## 🛡️ **SÉCURITÉ**

### **Trouver votre IP :**
```bash
# Votre IP publique
curl ifconfig.me
```

### **Configurer les restrictions IP :**
```bash
# Modifier la config Nginx
sudo nano /etc/nginx/sites-available/eng-rnd

# Ajouter dans la section admin :
# allow VOTRE_IP;
# deny all;

# Recharger
sudo systemctl reload nginx
```

---

## 📊 **MONITORING**

### **Logs en temps réel :**
```bash
# Backend
pm2 logs eng-rnd-backend --lines 50

# Nginx accès
sudo tail -f /var/log/nginx/access.log

# Nginx erreurs
sudo tail -f /var/log/nginx/error.log

# Système
sudo journalctl -f -u nginx
```

### **Espace disque :**
```bash
# Voir l'espace utilisé
df -h

# Voir la taille des dossiers
du -sh /var/www/eng-rnd/*
```

---

## 🆘 **COMMANDES D'URGENCE**

### **Redémarrer tout :**
```bash
# Redémarrer le backend
pm2 restart eng-rnd-backend

# Redémarrer Nginx
sudo systemctl restart nginx

# Redémarrer le serveur (en dernier recours)
sudo reboot
```

### **Restaurer une sauvegarde :**
```bash
# Sauvegarder avant modifications
sudo cp -r /var/www/eng-rnd /var/www/eng-rnd.backup

# Restaurer si problème
sudo rm -rf /var/www/eng-rnd
sudo mv /var/www/eng-rnd.backup /var/www/eng-rnd
```

---

## 📞 **INFORMATIONS UTILES**

### **Chemins importants :**
- Site public : `/var/www/eng-rnd/public/`
- Interface admin : `/var/www/eng-rnd/admin/`
- Backend : `/var/www/eng-rnd/backend/`
- Config Nginx : `/etc/nginx/sites-available/eng-rnd`
- Logs Nginx : `/var/log/nginx/`
- Certificats SSL : `/etc/letsencrypt/live/eng-rnd.com/`

### **Ports utilisés :**
- HTTP : 80
- HTTPS : 443
- Backend : 5000 (local seulement)

### **Fichiers de configuration :**
- Backend : `/var/www/eng-rnd/backend/.env`
- Nginx : `/etc/nginx/sites-available/eng-rnd`
- PM2 : `~/.pm2/`

---

**💡 CONSEIL : Gardez cet aide-mémoire ouvert pendant le déploiement !**