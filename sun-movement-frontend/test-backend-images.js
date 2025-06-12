const https = require('https');

async function testApi() {
  try {
    // Create agent that ignores self-signed certificate errors
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    
    const response = await fetch('https://localhost:5001/api/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      agent: agent
    });
    
    if (response.ok) {
      const products = await response.json();
      console.log('Number of products:', products.length);
      if (products.length > 0) {
        console.log('\nFirst 3 products image URLs:');
        for (let i = 0; i < Math.min(3, products.length); i++) {
          const product = products[i];
          console.log(`${i + 1}. ${product.name}`);
          console.log(`   ImageUrl: "${product.imageUrl}"`);
          console.log(`   Category: ${product.category}`);
          console.log(`   IsActive: ${product.isActive}`);
          console.log('');
        }
      }
    } else {
      console.log('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testApi();
