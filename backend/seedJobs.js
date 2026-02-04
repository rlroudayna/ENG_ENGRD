// backend/seedJobs.js
const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const sampleJobs = [
  {
    title: "Ingénieur Logiciel Embarqué",
    description: "Développement de logiciels embarqués pour l'industrie automobile. Maîtrise des systèmes temps réel et des protocoles de communication.",
    location: "Casablanca, Maroc",
    type: "CDI",
    sector: "Automobile",
    salary: "Selon profil",
    skills: ["C/C++", "Embedded Systems", "CAN Bus", "AUTOSAR"],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
  },
  {
    title: "Ingénieur Systèmes Avioniques",
    description: "Conception et validation de systèmes avioniques pour l'aéronautique civile et militaire.",
    location: "Rabat, Maroc",
    type: "CDI",
    sector: "Aéronautique",
    salary: "45000 - 60000 MAD",
    skills: ["DO-178C", "ARINC 429", "Matlab/Simulink", "Ada"],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 jours
  },
  {
    title: "Développeur Full Stack",
    description: "Développement d'applications web modernes avec React et Node.js pour des projets innovants.",
    location: "Casablanca, Maroc",
    type: "CDD",
    sector: "IT",
    salary: "35000 - 50000 MAD",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 jours
  },
  {
    title: "Ingénieur Ferroviaire",
    description: "Conception et maintenance des systèmes de signalisation ferroviaire et de contrôle des trains.",
    location: "Tanger, Maroc",
    type: "CDI",
    sector: "Ferroviaire",
    salary: "Selon expérience",
    skills: ["ERTMS", "ETCS", "Signalisation", "Sécurité Ferroviaire"],
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 jours
  },
  {
    title: "Ingénieur Biomédical",
    description: "Développement et maintenance d'équipements médicaux de pointe pour les hôpitaux.",
    location: "Casablanca, Maroc",
    type: "Stage",
    sector: "Santé",
    salary: "Stage rémunéré",
    skills: ["Électronique Médicale", "Normes IEC", "Matlab", "LabVIEW"],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 jours
  }
];

async function seedJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert sample jobs
    for (const jobData of sampleJobs) {
      const job = await Job.create(jobData);
      console.log(`Created job: ${job.title} (${job.sector})`);
    }

    console.log('Job seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();