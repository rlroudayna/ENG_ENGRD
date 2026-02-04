#!/usr/bin/env node

const axios = require('axios');

async function checkBackend() {
  console.log('🔍 Checking backend health...');
  
  try {
    // Test basic connection
    const response = await axios.get('http://localhost:5000', { timeout: 5000 });
    console.log('✅ Backend is responding');
    
    // Test API endpoints
    const endpoints = [
      '/api/jobs',
      '/api/news',
      '/api/home-content'
    ];
    
    for (const endpoint of endpoints) {
      try {
        await axios.get(`http://localhost:5000${endpoint}`, { timeout: 5000 });
        console.log(`✅ ${endpoint} - OK`);
      } catch (error) {
        console.log(`❌ ${endpoint} - ERROR: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Backend is not responding');
    console.log('💡 Make sure to start the backend:');
    console.log('   cd backend && npm start');
    return false;
  }
  
  return true;
}

checkBackend();
