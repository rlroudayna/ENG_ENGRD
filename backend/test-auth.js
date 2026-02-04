// backend/test-auth.js
const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing login...');
    
    // Test login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/admin/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login response:', loginResponse.data);
    
    if (loginResponse.data.success) {
      const token = loginResponse.data.token;
      console.log('Token received:', token.substring(0, 50) + '...');
      
      // Test protected route
      console.log('Testing protected route...');
      const messagesResponse = await axios.get('http://localhost:5000/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Messages response:', messagesResponse.data.length, 'messages found');
      console.log('Authentication test successful!');
    }
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAuth();