// backend/resetJobs.js - Reset all jobs and create test data
const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const testJobs = [
  {
    title: "Ingénieur Logiciel Embarqué",
    description: "Développement de logiciels embarqués pour l'industrie automobile. Maîtrise des systèmes temps réel et des protocoles de communication automobile.",
    location: "Casablanca, Maroc",
    type: "CDI",
    sector: "Automobile",
    salary: "45000 - 60000 MAD",
    skills: ["C/C++", "Embedded Systems", "CAN Bus", "AUTOSAR"],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Ingénieur Systèmes Avioniques",
    description: "Conception et validation de systèmes avioniques pour l'aéronautique civile et militaire. Expertise en normes DO-178C requise.",
    location: "Rabat, Maroc",
    type: "CDI",
    sector: "Aéronautique",
    salary: "50000 - 70000 MAD",
    skills: ["DO-178C", "ARINC 429", "Matlab/Simulink", "Ada"],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Développeur Full Stack",
    description: "Développement d'applications web modernes avec React et Node.js. Participation à des projets innovants dans le secteur IT.",
    location: "Casablanca, Maroc",
    type: "CDD",
    sector: "IT",
    salary: "35000 - 50000 MAD",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Ingénieur Ferroviaire",
    description: "Conception et maintenance des systèmes de signalisation ferroviaire. Expertise en ERTMS et sécurité ferroviaire.",
    location: "Tanger, Maroc",
    type: "CDI",
    sector: "Ferroviaire",
    salary: "Selon expérience",
    skills: ["ERTMS", "ETCS", "Signalisation", "Sécurité Ferroviaire"],
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Ingénieur Biomédical",
    description: "Développement et maintenance d'équipements médicaux de pointe. Stage dans un environnement hospitalier moderne.",
    location: "Casablanca, Maroc",
    type: "Stage",
    sector: "Santé",
    salary: "Stage rémunéré",
    skills: ["Électronique Médicale", "Normes IEC", "Matlab", "LabVIEW"],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Ingénieur Énergies Renouvelables",
    description: "Conception de systèmes photovoltaïques et éoliens. Expertise en optimisation énergétique et smart grids.",
    location: "Agadir, Maroc",
    type: "CDI",
    sector: "Énergie",
    salary: "40000 - 55000 MAD",
    skills: ["Photovoltaïque", "Éolien", "Smart Grid", "SCADA"],
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Ingénieur Systèmes Spatiaux",
    description: "Développement de satellites et systèmes de communication spatiale. Participation aux missions spatiales nationales.",
    location: "Rabat, Maroc",
    type: "CDI",
    sector: "Spatial",
    salary: "55000 - 75000 MAD",
    skills: ["Systèmes Spatiaux", "RF", "Télécommunications", "MATLAB"],
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Ingénieur Systèmes de Défense",
    description: "Conception de systèmes de défense et sécurité. Habilitation de sécurité requise pour projets militaires.",
    location: "Salé, Maroc",
    type: "CDI",
    sector: "Militaire",
    salary: "Confidentiel",
    skills: ["Systèmes de Défense", "Cryptographie", "Radar", "C4I"],
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
  }
];

async function resetJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing jobs
    const deleteResult = await Job.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing jobs`);

    // Create new test jobs
    console.log('🏗️  Creating new test jobs...');
    for (const jobData of testJobs) {
      const job = await Job.create(jobData);
      console.log(`✅ Created: ${job.title} (${job.sector})`);
    }

    // Verify all jobs were created
    const allJobs = await Job.find();
    console.log(`\n📊 Total jobs in database: ${allJobs.length}`);
    
    console.log('\n🎉 Job reset completed successfully!');
    console.log('\n📋 Summary of created jobs:');
    allJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} | ${job.sector} | ${job.type}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting jobs:', error);
    process.exit(1);
  }
}

resetJobs();