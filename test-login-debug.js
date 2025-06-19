// Test script to debug login issue
const https = require('https');

// Test data - replace with actual user credentials that were registered
const testCredentials = {
  email: "test@example.com", // Replace with actual registered email
  password: "Test@123"       // Replace with actual password used during registration
};

async function testLogin() {
  console.log('🔍 Testing login with credentials:', testCredentials.email);
  
  const postData = JSON.stringify(testCredentials);
  
  const options = {
    hostname: 'localhost',
    port: 5001, // Adjust port if different
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    rejectUnauthorized: false // For self-signed certificates
  };

  const req = https.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response Body:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ Login successful!');
        try {
          const jsonData = JSON.parse(data);
          console.log('🎟️ Token received:', jsonData.token ? 'Yes' : 'No');
          console.log('👤 User data:', jsonData.user);
        } catch (e) {
          console.log('⚠️ Response is not valid JSON');
        }
      } else {
        console.log('❌ Login failed!');
        try {
          const errorData = JSON.parse(data);
          console.log('💥 Error details:', errorData);
        } catch (e) {
          console.log('💥 Error response (not JSON):', data);
        }
      }
    });
  });

  req.on('error', (error) => {
    console.error('🚫 Request failed:', error);
  });

  req.write(postData);
  req.end();
}

// Also test if user exists
async function testUserExists() {
  console.log('\n🔍 Testing if user exists in database...');
  
  // This would require database access, so we'll skip for now
  console.log('⏭️ Skipping database check - would need direct DB access');
}

console.log('🚀 Starting login debug test...');
console.log('📝 Make sure backend is running on https://localhost:5001');
console.log('📝 Update testCredentials with actual registered user details\n');

testLogin().then(() => {
  testUserExists();
}).catch(console.error);
