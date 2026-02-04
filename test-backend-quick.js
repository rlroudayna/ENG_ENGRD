// Quick backend test
const http = require('http');

console.log('🔍 Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/jobs',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend responding: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jobs = JSON.parse(data);
      console.log(`📊 Found ${jobs.length} jobs in database`);
      console.log('🎉 Backend is working correctly!');
    } catch (e) {
      console.log('📄 Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Backend connection failed: ${e.message}`);
  console.log('💡 Make sure backend is running on port 5000');
});

req.end();