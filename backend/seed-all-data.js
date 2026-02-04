#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/engrd')
  .then(() => {
    console.log('✅ MongoDB connected');
    seedAllData();
  })
  .catch(err => {
    console.log('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

async function seedAllData() {
  try {
    // Clear existing data
    await mongoose.connection.db.collection('applications').deleteMany({});
    await mongoose.connection.db.collection('news').deleteMany({});
    await mongoose.connection.db.collection('contacts').deleteMany({});
    await mongoose.connection.db.collection('homecontents').deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Seed Applications (Candidatures)
    const applications = [
      {
        jobId: '68ef7cb4ca46fa73a9b3d941',
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        phone: '0123456789',
        cv: 'cv_jean_dupont.pdf',
        coverLetter: 'lettre_jean_dupont.pdf',
        status: 'nouveau',
        appliedAt: new Date('2025-01-05')
      },
      {
        jobId: '68ef9cd6ca46fa73a9b3da15',
        name: 'Marie Martin',
        email: 'marie.martin@email.com',
        phone: '0987654321',
        cv: 'cv_marie_martin.pdf',
        status: 'lu',
        appliedAt: new Date('2025-01-06')
      },
      {
        jobId: '68efa150ca46fa73a9b3da43',
        name: 'Pierre Durand',
        email: 'pierre.durand@email.com',
        phone: '0147258369',
        cv: 'cv_pierre_durand.pdf',
        coverLetter: 'lettre_pierre_durand.pdf',
        status: 'nouveau',
        appliedAt: new Date('2025-01-07')
      }
    ];

    await mongoose.connection.db.collection('applications').insertMany(applications);
    console.log('✅ Seeded applications (candidatures)');

    // Seed News (Actualités)
    const news = [
      {
        title: 'Nouvelle certification ISO 9001',
        content: 'ENG RND a obtenu la certification ISO 9001 pour la qualité de ses services d\'ingénierie.',
        imageUrl: '/images/iso-certification.jpg',
        publishDate: new Date('2025-01-01'),
        status: 'published',
        author: 'Admin'
      },
      {
        title: 'Expansion internationale',
        content: 'Ouverture de notre nouveau bureau à Londres pour servir nos clients européens.',
        imageUrl: '/images/london-office.jpg',
        publishDate: new Date('2025-01-03'),
        status: 'published',
        author: 'Admin'
      },
      {
        title: 'Partenariat technologique',
        content: 'Signature d\'un partenariat stratégique avec une entreprise leader en IA.',
        imageUrl: '/images/partnership.jpg',
        publishDate: new Date('2025-01-05'),
        status: 'published',
        author: 'Admin'
      }
    ];

    await mongoose.connection.db.collection('news').insertMany(news);
    console.log('✅ Seeded news (actualités)');

    // Seed Messages (Contacts)
    const messages = [
      {
        name: 'Sophie Leblanc',
        email: 'sophie.leblanc@entreprise.com',
        subject: 'Demande de devis',
        message: 'Bonjour, nous aimerions obtenir un devis pour un projet d\'ingénierie automobile.',
        status: 'nouveau',
        receivedAt: new Date('2025-01-04')
      },
      {
        name: 'Thomas Bernard',
        email: 'thomas.bernard@startup.fr',
        subject: 'Partenariat possible',
        message: 'Nous sommes une startup et cherchons un partenaire technique pour notre projet.',
        status: 'lu',
        receivedAt: new Date('2025-01-06')
      },
      {
        name: 'Claire Moreau',
        email: 'claire.moreau@gmail.com',
        subject: 'Question technique',
        message: 'J\'ai une question concernant vos services de modélisation 3D.',
        status: 'nouveau',
        receivedAt: new Date('2025-01-07')
      }
    ];

    await mongoose.connection.db.collection('contacts').insertMany(messages);
    console.log('✅ Seeded messages (contacts)');

    // Seed Home Content
    const homeContent = {
      heroTitle: 'ENG RND - Excellence en Ingénierie',
      heroDescription: 'Votre partenaire de confiance pour tous vos projets d\'ingénierie automobile, systèmes embarqués et innovation technologique.',
      aboutSection: 'Avec plus de 10 ans d\'expérience, ENG RND accompagne les entreprises dans leurs défis techniques les plus complexes.',
      servicesSection: 'Nos services couvrent la conception, la modélisation, la validation et l\'optimisation de systèmes techniques.',
      lastUpdated: new Date()
    };

    await mongoose.connection.db.collection('homecontents').insertOne(homeContent);
    console.log('✅ Seeded home content');

    console.log('\\n🎉 ALL DATA SEEDED SUCCESSFULLY!');
    console.log('\\n📊 Summary:');
    console.log('- 3 candidatures créées');
    console.log('- 3 actualités créées');
    console.log('- 3 messages de contact créés');
    console.log('- Contenu de la page d\'accueil créé');
    console.log('\\n✨ L\'admin devrait maintenant afficher du contenu !');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}