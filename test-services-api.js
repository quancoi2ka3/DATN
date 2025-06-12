// Test script to check Services API image URLs
const fetch = require('node-fetch');

async function testServicesAPI() {
    console.log('Testing Services API...');
    
    try {
        // Test services endpoint
        const response = await fetch('http://localhost:5001/api/services');
        
        if (!response.ok) {
            console.error('API request failed:', response.status, response.statusText);
            return;
        }
        
        const services = await response.json();
        console.log(`Found ${services.length} services`);
        
        if (services.length === 0) {
            console.log('No services found in the database');
            return;
        }
        
        console.log('\n=== Services Image URL Analysis ===');
        services.forEach((service, index) => {
            console.log(`\nService ${index + 1}:`);
            console.log(`  Name: ${service.name}`);
            console.log(`  Type: ${service.type}`);
            console.log(`  ImageUrl: "${service.imageUrl || 'null/empty'}"`);
            console.log(`  IsActive: ${service.isActive}`);
            
            if (service.imageUrl) {
                if (service.imageUrl.startsWith('http://') || service.imageUrl.startsWith('https://')) {
                    console.log(`  ✅ Image URL is absolute (${service.imageUrl.includes('localhost:5001') ? 'correctly pointing to backend' : 'external'})`);
                } else {
                    console.log(`  ❌ Image URL is relative: ${service.imageUrl}`);
                }
            } else {
                console.log(`  ⚠️  No image URL provided`);
            }
        });
        
        // Test individual service endpoint
        if (services.length > 0) {
            const firstService = services[0];
            console.log(`\n=== Testing individual service endpoint ===`);
            console.log(`Testing /api/services/${firstService.id}`);
            
            const singleResponse = await fetch(`http://localhost:5001/api/services/${firstService.id}`);
            if (singleResponse.ok) {
                const singleService = await singleResponse.json();
                console.log(`Single service ImageUrl: "${singleService.imageUrl || 'null/empty'}"`);
                
                if (singleService.imageUrl) {
                    if (singleService.imageUrl.startsWith('http://') || singleService.imageUrl.startsWith('https://')) {
                        console.log(`✅ Single service image URL is absolute`);
                    } else {
                        console.log(`❌ Single service image URL is relative: ${singleService.imageUrl}`);
                    }
                }
            } else {
                console.log(`❌ Failed to fetch individual service: ${singleResponse.status}`);
            }
        }
        
    } catch (error) {
        console.error('Error testing Services API:', error.message);
    }
}

// Run the test
testServicesAPI();
