// Test script to create a job via API
const axios = require('axios');

const testJob = {
  title: "Ingénieur Test Secteur",
  description: "Ceci est un test pour vérifier que le secteur s'affiche correctement.",
  location: "Casablanca, Maroc",
  type: "CDI",
  sector: "Automobile",
  salary: "Test",
  skills: ["Test", "Secteur"],
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
};

async function createTestJob() {
  try {
    // First, let's try to get existing jobs
    console.log('Fetching existing jobs...');
    const getResponse = await axios.get('http://localhost:5000/api/jobs');
    console.log(`Found ${getResponse.data.length} existing jobs`);
    
    // Now create a new job
    console.log('Creating test job...');
    const response = await axios.post('http://localhost:5000/api/jobs', testJob);
    console.log('Job created successfully:', response.data);
    
    // Fetch jobs again to verify
    const updatedResponse = await axios.get('http://localhost:5000/api/jobs');
    console.log(`Now have ${updatedResponse.data.length} jobs total`);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createTestJob();