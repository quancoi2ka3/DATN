"use client";

import { useState } from 'react';

export default function TestOrderPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testOrder = async (orderId: string) => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing order:', orderId);
      
      // Test direct backend
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        setResult(`Error ${response.status}: ${errorText}`);
        return;
      }
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('Error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Order API</h1>
      
      <div className="space-y-4">
        <button 
          onClick={() => testOrder('37')}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Testing...' : 'Test Order 37'}
        </button>
        
        <button 
          onClick={() => testOrder('34')}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300 ml-2"
        >
          {loading ? 'Testing...' : 'Test Order 34'}
        </button>
      </div>
      
      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
