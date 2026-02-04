// backend/updateExistingJobs.js
const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

async function updateExistingJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all existing jobs
    const existingJobs = await Job.find();
    console.log(`Found ${existingJobs.length} existing jobs`);

    // Update jobs that don't have a sector
    for (const job of existingJobs) {
      if (!job.sector) {
        // Assign a default sector based on title or randomly
        let defaultSector = 'IT'; // Default fallback
        
        const title = job.title.toLowerCase();
        if (title.includes('auto') || title.includes('véhicule')) {
          defaultSector = 'Automobile';
        } else if (title.includes('aéro') || title.includes('avion')) {
          defaultSector = 'Aéronautique';
        } else if (title.includes('train') || title.includes('ferro')) {
          defaultSector = 'Ferroviaire';
        } else if (title.includes('spatial') || title.includes('satellite')) {
          defaultSector = 'Spatial';
        } else if (title.includes('militaire') || title.includes('défense')) {
          defaultSector = 'Militaire';
        } else if (title.includes('énergie') || title.includes('électrique')) {
          defaultSector = 'Énergie';
        } else if (title.includes('santé') || title.includes('médical')) {
          defaultSector = 'Santé';
        }

        await Job.findByIdAndUpdate(job._id, { 
          sector: defaultSector,
          skills: job.skills || [],
          salary: job.salary || 'Selon profil'
        });
        console.log(`Updated job "${job.title}" with sector: ${defaultSector}`);
      }
    }

    // Add some test jobs with sectors
    const testJobs = [
      {
        title: "Ingénieur Logiciel Embarqué Automobile",
        description: "Développement de logiciels embarqués pour l'industrie automobile. Maîtrise des systèmes temps réel et des protocoles de communication.",
        location: "Casablanca, Maroc",
        type: "CDI",
        sector: "Automobile",
        salary: "45000 - 60000 MAD",
        skills: ["C/C++", "Embedded Systems", "CAN Bus", "AUTOSAR"],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Ingénieur Systèmes Avioniques",
        description: "Conception et validation de systèmes avioniques pour l'aéronautique civile et militaire.",
        location: "Rabat, Maroc",
        type: "CDI",
        sector: "Aéronautique",
        salary: "50000 - 70000 MAD",
        skills: ["DO-178C", "ARINC 429", "Matlab/Simulink", "Ada"],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Développeur Full Stack React/Node",
        description: "Développement d'applications web modernes avec React et Node.js pour des projets innovants dans le secteur IT.",
        location: "Casablanca, Maroc",
        type: "CDD",
        sector: "IT",
        salary: "35000 - 50000 MAD",
        skills: ["React", "Node.js", "MongoDB", "TypeScript"],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      }
    ];

    // Check if test jobs already exist
    for (const testJob of testJobs) {
      const existing = await Job.findOne({ title: testJob.title });
      if (!existing) {
        const newJob = await Job.create(testJob);
        console.log(`Created test job: ${newJob.title} (${newJob.sector})`);
      } else {
        console.log(`Test job already exists: ${testJob.title}`);
      }
    }

    // Display all jobs with their sectors
    const allJobs = await Job.find();
    console.log('\n=== ALL JOBS IN DATABASE ===');
    allJobs.forEach(job => {
      console.log(`- ${job.title} | Secteur: ${job.sector} | Type: ${job.type}`);
    });

    console.log('\nUpdate completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating jobs:', error);
    process.exit(1);
  }
}

updateExistingJobs();