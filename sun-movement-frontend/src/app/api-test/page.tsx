"use client";

import { useState, useEffect } from 'react';

export default function APITestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string, isError = false) => {
    setResults(prev => [...prev, `${isError ? '❌' : '✅'} ${message}`]);
  };

  const testAPIs = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      // Test 1: Environment variables
      addResult(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
      addResult(`NODE_ENV: ${process.env.NODE_ENV}`);
      
      // Test 2: Direct API call
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      addResult(`Testing API at: ${apiUrl}`);
      
      // Test 3: Published articles
      try {
        const response = await fetch(`${apiUrl}/api/articles/published`);
        addResult(`Published articles response: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          addResult(`Found ${data.length} published articles`);
        } else {
          addResult(`Failed to fetch published articles: ${response.status}`, true);
        }
      } catch (error) {
        addResult(`Error fetching published articles: ${(error as Error).message}`, true);
      }
      
      // Test 4: Search API
      try {
        const searchResponse = await fetch(`${apiUrl}/api/articles/search?q=yoga`);
        addResult(`Search API response: ${searchResponse.status} ${searchResponse.statusText}`);
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          addResult(`Search found ${searchData.length} yoga articles`);
        } else {
          addResult(`Search API failed: ${searchResponse.status}`, true);
        }
      } catch (error) {
        addResult(`Error in search API: ${(error as Error).message}`, true);
      }
      
      // Test 5: Featured articles
      try {
        const featuredResponse = await fetch(`${apiUrl}/api/articles/featured`);
        addResult(`Featured articles response: ${featuredResponse.status} ${featuredResponse.statusText}`);
        
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          addResult(`Found ${featuredData.length} featured articles`);
        } else {
          addResult(`Featured API failed: ${featuredResponse.status}`, true);
        }
      } catch (error) {
        addResult(`Error fetching featured articles: ${(error as Error).message}`, true);
      }
      
    } catch (error) {
      addResult(`General error: ${(error as Error).message}`, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run tests on component mount
    testAPIs();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>NextJS API Test Page</h1>
      <p>This page tests the article APIs directly from within the NextJS application.</p>
      
      <button 
        onClick={testAPIs} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          marginBottom: '20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Run API Tests'}
      </button>
      
      <div style={{ 
        border: '1px solid #ccc', 
        padding: '15px', 
        backgroundColor: '#f9f9f9',
        minHeight: '300px',
        whiteSpace: 'pre-wrap'
      }}>
        {results.length === 0 ? 'No results yet...' : results.join('\n')}
      </div>
    </div>
  );
}
