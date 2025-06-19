// Test environment variables in Next.js
console.log('=== ENVIRONMENT VARIABLES TEST ===');
console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test API URL construction
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
console.log('Constructed API URL:', apiUrl);
console.log('Login endpoint:', `${apiUrl}/api/auth/login`);

// Test fetch with correct URL
async function testFrontendAPI() {
    try {
        console.log('\n=== TESTING FRONTEND API CALL ===');
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'nguyenmanhan17072003@gmail.com',
                password: 'ManhQuan2003@'
            })
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ SUCCESS: Login worked from frontend!');
            console.log('User:', data.user.firstName, data.user.lastName);        } else {
            const errorText = await response.text();
            console.log('❌ FAILED:', errorText);
        }
    } catch (error) {
        console.log('❌ ERROR:', error instanceof Error ? error.message : String(error));
    }
}

// Run test if in browser
if (typeof window !== 'undefined') {
    testFrontendAPI();
}

export default function EnvTestPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Environment Variables Test</h1>
            <p><strong>NEXT_PUBLIC_API_BASE_URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}</p>
            <p><strong>Constructed API URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}</p>
            <p><strong>Login endpoint:</strong> {(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000') + '/api/auth/login'}</p>
            
            <button onClick={() => testFrontendAPI()}>Test API Call</button>
            
            <p style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
                Check browser console for test results
            </p>
        </div>
    );
}
