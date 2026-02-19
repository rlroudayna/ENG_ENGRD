#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VÉRIFICATION ET INITIALISATION MONGODB
 * 
 * Ce script:
 * 1. Vérifie la connexion MongoDB
 * 2. Liste les collections existantes
 * 3. Crée les collections manquantes
 * 4. Initialise les données de base si nécessaire
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const Job = require('./backend/models/Job');
const News = require('./backend/models/News');
const Application = require('./backend/models/application');
const Message = require('./backend/models/Message');
const HomeContent = require('./backend/models/HomeContent');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

// Collections attendues
const expectedCollections = [
  { name: 'jobs', model: Job, description: 'Offres d\'emploi' },
  { name: 'news', model: News, description: 'Actualités' },
  { name: 'applications', model: Application, description: 'Candidatures' },
  { name: 'messages', model: Message, description: 'Messages de contact' },
  { name: 'homecontents', model: HomeContent, description: 'Contenu page d\'accueil' }
];

async function checkMongoDBConnection() {
  log.title('🔌 VÉRIFICATION DE LA CONNEXION MONGODB');
  
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!mongoUri) {
    log.error('Variable MONGO_URI ou MONGODB_URI non trouvée dans .env');
    log.info('Exemple: MONGO_URI=mongodb://localhost:27017/engrd');
    process.exit(1);
  }
  
  log.info(`URI MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
  
  try {
    await mongoose.connect(mongoUri);
    log.success('Connexion MongoDB établie!');
    
    const dbName = mongoose.connection.db.databaseName;
    log.info(`Base de données: ${dbName}`);
    
    return true;
  } catch (error) {
    log.error(`Échec de connexion: ${error.message}`);
    log.warning('Vérifiez que MongoDB est démarré: sudo systemctl status mongod');
    process.exit(1);
  }
}

async function listExistingCollections() {
  log.title('📋 COLLECTIONS EXISTANTES');
  
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      log.warning('Aucune collection trouvée dans la base de données');
      return [];
    }
    
    log.info(`${collections.length} collection(s) trouvée(s):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    return collections.map(col => col.name);
  } catch (error) {
    log.error(`Erreur lors de la liste des collections: ${error.message}`);
    return [];
  }
}

async function createMissingCollections(existingCollections) {
  log.title('🔧 CRÉATION DES COLLECTIONS MANQUANTES');
  
  let created = 0;
  let existing = 0;
  
  for (const collection of expectedCollections) {
    if (existingCollections.includes(collection.name)) {
      log.info(`Collection "${collection.name}" existe déjà`);
      existing++;
    } else {
      try {
        // Créer la collection en insérant puis supprimant un document temporaire
        await collection.model.create({ _temp: true });
        await collection.model.deleteOne({ _temp: true });
        
        log.success(`Collection "${collection.name}" créée (${collection.description})`);
        created++;
      } catch (error) {
        log.error(`Erreur création "${collection.name}": ${error.message}`);
      }
    }
  }
  
  log.title('📊 RÉSUMÉ');
  log.info(`Collections existantes: ${existing}`);
  log.success(`Collections créées: ${created}`);
  
  return { created, existing };
}

async function checkCollectionCounts() {
  log.title('📈 NOMBRE DE DOCUMENTS PAR COLLECTION');
  
  const counts = {};
  
  for (const collection of expectedCollections) {
    try {
      const count = await collection.model.countDocuments();
      counts[collection.name] = count;
      
      if (count === 0) {
        log.warning(`${collection.name}: ${count} documents`);
      } else {
        log.success(`${collection.name}: ${count} documents`);
      }
    } catch (error) {
      log.error(`Erreur comptage "${collection.name}": ${error.message}`);
    }
  }
  
  return counts;
}

async function initializeHomeContent() {
  log.title('🏠 INITIALISATION DU CONTENU PAGE D\'ACCUEIL');
  
  try {
    const existingContent = await HomeContent.countDocuments();
    
    if (existingContent > 0) {
      log.info(`Contenu page d'accueil déjà initialisé (${existingContent} sections)`);
      return;
    }
    
    log.info('Création du contenu par défaut...');
    
    const defaultContent = [
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
          items: [
            { name: 'Conseil en ingénierie', description: 'Expertise technique' },
            { name: 'Développement R&D', description: 'Innovation et recherche' },
            { name: 'Formation', description: 'Montée en compétences' }
          ]
        }
      }
    ];
    
    await HomeContent.insertMany(defaultContent);
    log.success(`${defaultContent.length} sections créées pour la page d'accueil`);
    
  } catch (error) {
    log.error(`Erreur initialisation contenu: ${error.message}`);
  }
}

async function showNextSteps(counts) {
  log.title('🚀 PROCHAINES ÉTAPES');
  
  if (counts.jobs === 0) {
    log.warning('Aucune offre d\'emploi');
    log.info('Exécutez: node backend/seedJobs.js');
  }
  
  if (counts.news === 0) {
    log.warning('Aucune actualité');
    log.info('Ajoutez des actualités via l\'interface admin');
  }
  
  if (counts.homecontents === 0) {
    log.warning('Contenu page d\'accueil vide');
    log.info('Exécutez: node backend/seedHomeContent.js');
  }
  
  log.success('Base de données prête!');
  log.info('Démarrez le backend: cd backend && npm start');
}

async function main() {
  try {
    console.log('\n');
    log.title('🔍 VÉRIFICATION ET INITIALISATION MONGODB');
    
    // 1. Vérifier la connexion
    await checkMongoDBConnection();
    
    // 2. Lister les collections existantes
    const existingCollections = await listExistingCollections();
    
    // 3. Créer les collections manquantes
    await createMissingCollections(existingCollections);
    
    // 4. Compter les documents
    const counts = await checkCollectionCounts();
    
    // 5. Initialiser le contenu de base
    await initializeHomeContent();
    
    // 6. Afficher les prochaines étapes
    await showNextSteps(counts);
    
    log.title('✅ VÉRIFICATION TERMINÉE');
    
  } catch (error) {
    log.error(`Erreur fatale: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    log.info('Connexion MongoDB fermée');
  }
}

// Exécuter le script
main();
