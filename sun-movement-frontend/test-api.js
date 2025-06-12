const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🔍 Checking environment configuration...');

// Check .env.local file
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  console.log('✅ .env.local file exists:');
  console.log(envContent);
} else {
  console.log('❌ .env.local file not found');
}

// Test API endpoints
async function testAPI() {
  console.log('\n🔗 Testing API endpoints...');
  
  const endpoints = [
    '/api/products',
    '/api/products/category/supplements',
    '/api/products/category/sportswear'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: https://localhost:5001${endpoint}`);
      
      const options = {
        hostname: 'localhost',
        port: 5001,
        path: endpoint,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        rejectUnauthorized: false // Disable SSL verification for development
      };      await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                const jsonData = JSON.parse(data);
                console.log(`✅ ${endpoint} - Success (${jsonData.length} items)`);
              } catch {
                console.log(`✅ ${endpoint} - Success (response received)`);
              }
            } else {
              console.log(`❌ ${endpoint} - Failed (${res.statusCode})`);
            }
            resolve();
          });
        });

        req.on('error', (error) => {
          console.log(`❌ ${endpoint} - Error: ${error.message}`);
          resolve();
        });

        req.setTimeout(5000, () => {
          console.log(`❌ ${endpoint} - Timeout`);
          req.destroy();
          resolve();
        });

        req.end();
      });

    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

testAPI();
