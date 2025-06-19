const https = require('https');

// Disable SSL verification for localhost testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Test login with correct credentials
const loginData = {
  email: 'nguyenmanhan17072003@gmail.com',
  password: 'ManhQuan2003@'
};

const postData = JSON.stringify(loginData);

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing login with correct credentials...');
console.log('Email:', loginData.email);
console.log('Password:', loginData.password);
console.log('');

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  console.log('');
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (res.statusCode === 200) {
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('User:', response.user.firstName, response.user.lastName);
        console.log('Email:', response.user.email);
        console.log('Roles:', response.user.roles.join(', '));
        console.log('Token:', response.token.substring(0, 20) + '...');
      } else {
        console.log('❌ LOGIN FAILED:');
        console.log('Message:', response.message || data);
      }
    } catch (error) {
      console.log('❌ ERROR PARSING RESPONSE:');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ REQUEST ERROR:', error.message);
});

req.write(postData);
req.end();
