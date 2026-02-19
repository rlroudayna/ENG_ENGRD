# 🚀 GUIDE COMPLET - SETUP MONGODB

## 📋 ÉTAPE 1: VÉRIFIER QUE MONGODB EST DÉMARRÉ

```bash
# Sur le VPS, vérifie le statut
sudo systemctl status mongod
```

**Si MongoDB n'est pas démarré:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## 📋 ÉTAPE 2: VÉRIFIER LA CONFIGURATION

```bash
# Va dans le dossier du projet
cd /var/www/engrd

# Vérifie que le fichier .env existe
cat backend/.env
```

**Le fichier doit contenir:**
```env
MONGO_URI=mongodb://localhost:27017/engrd
PORT=5000
JWT_SECRET=ton_secret_jwt_ici
```

**Si le fichier n'existe pas, crée-le:**
```bash
cp backend/.env.example backend/.env
nano backend/.env
```

---

## 📋 ÉTAPE 3: EXÉCUTER LE SCRIPT DE VÉRIFICATION

```bash
# Depuis la racine du projet
node check-and-init-mongodb.js
```

**Ce script va:**
- ✅ Vérifier la connexion MongoDB
- ✅ Lister les collections existantes
- ✅ Créer les collections manquantes:
  - `jobs` (Offres d'emploi)
  - `news` (Actualités)
  - `applications` (Candidatures)
  - `messages` (Messages de contact)
  - `homecontents` (Contenu page d'accueil)
- ✅ Initialiser le contenu de base

---

## 📋 ÉTAPE 4: VÉRIFIER LES RÉSULTATS

**Tu devrais voir:**
```
✅ Connexion MongoDB établie!
ℹ️  Base de données: engrd

📋 COLLECTIONS EXISTANTES
   - jobs
   - news
   - applications
   - messages
   - homecontents

✅ Collection "jobs" existe déjà
✅ Collection "news" existe déjà
...

📈 NOMBRE DE DOCUMENTS PAR COLLECTION
✅ jobs: 5 documents
✅ news: 3 documents
⚠️  applications: 0 documents
⚠️  messages: 0 documents
✅ homecontents: 3 documents
```

---

## 📋 ÉTAPE 5: PEUPLER LA BASE DE DONNÉES (OPTIONNEL)

**Si tu veux ajouter des données de test:**

```bash
# Ajouter des offres d'emploi
cd backend
node seedJobs.js

# Ajouter du contenu pour la page d'accueil
node seedHomeContent.js

# Ajouter toutes les données de test
node seed-all-data.js
```

---

## 🔧 COMMANDES UTILES MONGODB

### Vérifier MongoDB
```bash
# Statut
sudo systemctl status mongod

# Démarrer
sudo systemctl start mongod

# Redémarrer
sudo systemctl restart mongod

# Voir les logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Se connecter à MongoDB
```bash
# Ouvrir le shell MongoDB
mongosh

# Dans le shell:
use engrd                    # Utiliser la base de données
show collections             # Lister les collections
db.jobs.find().pretty()      # Voir les offres d'emploi
db.news.find().pretty()      # Voir les actualités
db.applications.countDocuments()  # Compter les candidatures
exit                         # Quitter
```

### Commandes de diagnostic
```bash
# Vérifier les collections
mongosh engrd --eval "db.getCollectionNames()"

# Compter les documents
mongosh engrd --eval "db.jobs.countDocuments()"
mongosh engrd --eval "db.news.countDocuments()"
mongosh engrd --eval "db.applications.countDocuments()"
```

---

## ❌ RÉSOLUTION DES PROBLÈMES

### Problème: "MongoServerError: Authentication failed"

**Solution:**
```bash
# Éditer la config MongoDB
sudo nano /etc/mongod.conf

# Commenter ou désactiver l'authentification:
# security:
#   authorization: disabled

# Redémarrer
sudo systemctl restart mongod
```

### Problème: "Connection refused"

**Solution:**
```bash
# Vérifier que MongoDB écoute sur le bon port
sudo netstat -tulpn | grep 27017

# Si rien, vérifier la config
sudo nano /etc/mongod.conf

# Doit contenir:
net:
  port: 27017
  bindIp: 127.0.0.1

# Redémarrer
sudo systemctl restart mongod
```

### Problème: "Database not found"

**Solution:**
```bash
# MongoDB crée automatiquement la base de données
# Exécute simplement le script:
node check-and-init-mongodb.js
```

### Problème: "Cannot find module 'mongoose'"

**Solution:**
```bash
# Installer les dépendances
cd backend
npm install
```

---

## ✅ VÉRIFICATION FINALE

**Pour vérifier que tout fonctionne:**

```bash
# 1. MongoDB est démarré
sudo systemctl status mongod

# 2. Les collections existent
node check-and-init-mongodb.js

# 3. Le backend se connecte
cd backend
node test-mongo.js

# 4. Démarrer le backend
npm start
```

**Tu devrais voir:**
```
Server running on port 5000
MongoDB connected
```

---

## 🎯 RÉSUMÉ RAPIDE

```bash
# Sur le VPS, exécute ces commandes dans l'ordre:

# 1. Vérifier MongoDB
sudo systemctl status mongod

# 2. Aller dans le projet
cd /var/www/engrd

# 3. Vérifier et créer les collections
node check-and-init-mongodb.js

# 4. Peupler avec des données (optionnel)
cd backend
node seed-all-data.js

# 5. Démarrer le backend
npm start
```

---

## 📞 BESOIN D'AIDE?

Si tu vois des erreurs, envoie-moi:
1. Le message d'erreur exact
2. La sortie de `sudo systemctl status mongod`
3. La sortie de `node check-and-init-mongodb.js`

---

**Date:** $(date)
**Statut:** ✅ Prêt à utiliser
