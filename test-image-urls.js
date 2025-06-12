// Test script to check both Products and Services API image URLs
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPIsImageUrls() {
    console.log('Testing Products and Services API image URLs...\n');
    
    try {
        // Test Products API
        console.log('=== PRODUCTS API TEST ===');
        const productsResponse = await fetch('http://localhost:5001/api/products');
        
        if (productsResponse.ok) {
            const products = await productsResponse.json();
            console.log(`Found ${products.length} products`);
            
            if (products.length > 0) {
                products.slice(0, 3).forEach((product, index) => {
                    console.log(`\nProduct ${index + 1}:`);
                    console.log(`  Name: ${product.name}`);
                    console.log(`  Category: ${product.category}`);
                    console.log(`  ImageUrl: "${product.imageUrl || 'null/empty'}"`);
                    
                    if (product.imageUrl) {
                        if (product.imageUrl.startsWith('http://localhost:5001')) {
                            console.log(`  ✅ Image URL is absolute and points to backend`);
                        } else if (product.imageUrl.startsWith('http')) {
                            console.log(`  ⚠️  Image URL is absolute but external: ${product.imageUrl}`);
                        } else {
                            console.log(`  ❌ Image URL is relative: ${product.imageUrl}`);
                        }
                    } else {
                        console.log(`  ⚠️  No image URL provided`);
                    }
                });
            }
        } else {
            console.log(`❌ Products API failed: ${productsResponse.status}`);
        }
        
        // Test Services API
        console.log('\n=== SERVICES API TEST ===');
        const servicesResponse = await fetch('http://localhost:5001/api/services');
        
        if (servicesResponse.ok) {
            const services = await servicesResponse.json();
            console.log(`Found ${services.length} services`);
            
            if (services.length > 0) {
                services.slice(0, 3).forEach((service, index) => {
                    console.log(`\nService ${index + 1}:`);
                    console.log(`  Name: ${service.name}`);
                    console.log(`  Type: ${service.type}`);
                    console.log(`  ImageUrl: "${service.imageUrl || 'null/empty'}"`);
                    
                    if (service.imageUrl) {
                        if (service.imageUrl.startsWith('http://localhost:5001')) {
                            console.log(`  ✅ Image URL is absolute and points to backend`);
                        } else if (service.imageUrl.startsWith('http')) {
                            console.log(`  ⚠️  Image URL is absolute but external: ${service.imageUrl}`);
                        } else {
                            console.log(`  ❌ Image URL is relative: ${service.imageUrl}`);
                        }
                    } else {
                        console.log(`  ⚠️  No image URL provided`);
                    }
                });
            }
        } else {
            console.log(`❌ Services API failed: ${servicesResponse.status}`);
        }
        
        console.log('\n=== SUMMARY ===');
        console.log('✅ If image URLs start with "http://localhost:5001", the fix is working');
        console.log('❌ If image URLs are relative (like "/uploads/..."), the fix needs attention');
        console.log('⚠️  Empty/null image URLs indicate no images are stored for those items');
        
    } catch (error) {
        console.error('Error testing APIs:', error.message);
        console.log('\nMake sure:');
        console.log('1. Backend server is running on http://localhost:5001');
        console.log('2. node-fetch is installed: npm install node-fetch');
    }
}

// Run the test
testAPIsImageUrls();
