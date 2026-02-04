// Debug script to check jobs in database
const axios = require('axios');

async function debugJobs() {
  try {
    console.log('🔍 Fetching all jobs from API...');
    const response = await axios.get('http://localhost:5000/api/jobs');
    const jobs = response.data;
    
    console.log(`📊 Found ${jobs.length} jobs in database:`);
    console.log('='.repeat(50));
    
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Secteur: ${job.sector || 'UNDEFINED'}`);
      console.log(`   Type: ${job.type}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   ID: ${job._id}`);
      console.log('   ---');
    });
    
    // Test creating a new job with sector
    console.log('\n🧪 Testing job creation with sector...');
    const testJob = {
      title: "Test Job avec Secteur",
      description: "Ceci est un test pour vérifier le secteur",
      location: "Test City",
      type: "CDI",
      sector: "Automobile"
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/jobs', testJob);
    console.log('✅ Job created successfully:');
    console.log(`   Title: ${createResponse.data.title}`);
    console.log(`   Sector: ${createResponse.data.sector}`);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend server is not running!');
      console.log('   Please start the backend with: cd backend && npm start');
    }
  }
}

debugJobs();