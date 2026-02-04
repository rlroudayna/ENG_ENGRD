# 🧪 GUIDE DE TEST MANUEL PRE-DÉPLOIEMENT

## 🚀 Tests à effectuer avant déploiement

### 1. **🎨 BRANDING (2 min)**
- [ ] Onglet navigateur affiche "ENG RND" avec logo ENG RND
- [ ] Footer affiche "© 2025 ENG RND"
- [ ] Navbar affiche "ENG RND Admin" dans l'admin

### 2. **🏠 NAVIGATION PUBLIQUE (3 min)**
- [ ] Navbar cliquable (tous les liens fonctionnent)
- [ ] Footer cliquable (liens email, navigation)
- [ ] Dropdowns navbar s'ouvrent correctement
- [ ] Responsive sur mobile (hamburger menu)

### 3. **📄 PAGES PUBLIQUES (5 min)**
- [ ] **Accueil** : Hero, secteurs, valeurs s'affichent
- [ ] **Jobs** : Liste des offres + filtres fonctionnels
- [ ] **Actualités** : Liste des news
- [ ] **Contact** : Formulaire avec nouvelle adresse

### 4. **💼 FORMULAIRES PUBLICS (3 min)**
- [ ] **Contact** : Champs agrandis (56px), validation OK
- [ ] **Candidature** : Champs agrandis, upload fichier
- [ ] **Filtres Jobs** : 20 secteurs + 4 types de contrats

### 5. **🔧 INTERFACE ADMIN (5 min)**
- [ ] **Login** : Authentification fonctionne
- [ ] **Offres** : Création avec secteur RH/Marketing
- [ ] **Statistiques** : 4 cartes (CDI, CDD, Freelance, Stages)
- [ ] **Filtres admin** : Recherche + secteurs + types
- [ ] **Messages** : Cartes sans déformation (textes longs)

### 6. **📱 RESPONSIVE (2 min)**
- [ ] Mobile : Navigation hamburger
- [ ] Tablette : Grilles adaptées
- [ ] Desktop : Layout complet

### 7. **🔍 FONCTIONNALITÉS CRITIQUES (3 min)**
- [ ] **Secteurs nouveaux** : RH, Marketing, Finance créent des offres
- [ ] **Champs agrandis** : Tous les formulaires (56px min)
- [ ] **Emails** : Liens mailto fonctionnels
- [ ] **Validation** : Messages d'erreur s'affichent

---

## ⚡ TEST RAPIDE (5 min max)

### **Frontend** :
1. Ouvrir http://localhost:3000
2. Vérifier titre "ENG RND" + logo
3. Tester navbar/footer cliquables
4. Aller sur /jobs → tester filtres
5. Aller sur /contact → tester formulaire

### **Admin** :
1. Aller sur /admin/login
2. Se connecter
3. Créer une offre secteur "RH"
4. Vérifier statistiques (4 cartes)
5. Tester filtres admin

---

## ✅ CRITÈRES DE VALIDATION

### **🟢 PRÊT SI :**
- Branding ENG RND partout
- Navigation cliquable
- Formulaires agrandis
- Nouveaux secteurs fonctionnels
- Pas d'erreurs console

### **🔴 PAS PRÊT SI :**
- Encore "React App" quelque part
- Navbar/footer non cliquables
- Erreur création offre RH
- Champs trop petits
- Erreurs JavaScript

---

## 🎯 POINTS DE CONTRÔLE FINAL

- [ ] **Titre** : ENG RND (pas React App)
- [ ] **Logo** : ENG RND (pas React)
- [ ] **Adresse** : 49, Rue Jean Jaurès, Quartier Gauthier
- [ ] **Email** : contact@eng-rnd.com
- [ ] **Secteurs** : 20 disponibles (RH, Marketing, etc.)
- [ ] **Contrats** : 4 types (CDI, CDD, Freelance, Stage)
- [ ] **Champs** : 56px minimum
- [ ] **Navigation** : Tout cliquable

**✅ Si tous les points sont OK → PRÊT POUR DÉPLOIEMENT**