"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { testCases, manualTestingChecklist, TestRunner } from '@/tests/comprehensive-test-suite';

interface TestResult {
  testId: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

export function TestingDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<Map<string, TestResult>>(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const cart = useCart();
  const [testProductId] = useState(1);

  // Show in development mode only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  const runCartTest = async (testType: 'add' | 'update' | 'remove' | 'clear') => {
    const testId = `manual-${testType}`;
    setTestResults(prev => new Map(prev.set(testId, { testId, status: 'running' })));
    
    const startTime = Date.now();
    
    try {
      switch (testType) {
        case 'add':
          const success = await cart.addToCart(
            { 
              id: testProductId.toString(), 
              name: 'Test Product', 
              price: 100000, 
              imageUrl: '/test-image.jpg',
              description: 'Test product for cart testing',
              category: 'test'
            }, 
            2, 
            'M', 
            'Red'
          );
          if (!success) throw new Error('Add to cart failed');
          break;
          
        case 'update':
          if (cart.items.length === 0) throw new Error('No items in cart to update');
          const updateSuccess = await cart.updateQuantity(cart.items[0].id, 5);
          if (!updateSuccess) throw new Error('Update quantity failed');
          break;
          
        case 'remove':
          if (cart.items.length === 0) throw new Error('No items in cart to remove');
          const removeSuccess = await cart.removeFromCart(cart.items[0].id);
          if (!removeSuccess) throw new Error('Remove from cart failed');
          break;
          
        case 'clear':
          const clearSuccess = await cart.clearCart();
          if (!clearSuccess) throw new Error('Clear cart failed');
          break;
      }
      
      const duration = Date.now() - startTime;
      setTestResults(prev => new Map(prev.set(testId, { 
        testId, 
        status: 'passed', 
        duration 
      })));
      
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => new Map(prev.set(testId, { 
        testId, 
        status: 'failed', 
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      })));
    }
  };

  const runPerformanceTest = async () => {
    const testId = 'performance-test';
    setTestResults(prev => new Map(prev.set(testId, { testId, status: 'running' })));
    
    const startTime = Date.now();
    
    try {
      // Run multiple cart operations to test performance
      for (let i = 0; i < 5; i++) {
        await cart.addToCart(
          { 
            id: (testProductId + i).toString(), 
            name: `Test Product ${i}`, 
            price: 100000 + i * 10000, 
            imageUrl: '/test-image.jpg',
            description: `Test product ${i} for performance testing`,
            category: 'test'
          }, 
          1
        );
      }
      
      // Test cache performance
      const metrics = cart.getPerformanceMetrics();
      
      if (metrics.averageResponseTime > 1000) {
        throw new Error(`Average response time too high: ${metrics.averageResponseTime}ms`);
      }
      
      const duration = Date.now() - startTime;
      setTestResults(prev => new Map(prev.set(testId, { 
        testId, 
        status: 'passed', 
        duration 
      })));
      
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => new Map(prev.set(testId, { 
        testId, 
        status: 'failed', 
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      })));
    }
  };

  const runRetryTest = async () => {
    const testId = 'retry-test';
    setTestResults(prev => new Map(prev.set(testId, { testId, status: 'running' })));
    
    const startTime = Date.now();
    
    try {
      // Test retry functionality
      await cart.retryLastAction();
      
      const duration = Date.now() - startTime;
      setTestResults(prev => new Map(prev.set(testId, { 
        testId, 
        status: 'passed', 
        duration 
      })));
      
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => new Map(prev.set(testId, { 
        testId, 
        status: 'failed', 
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      })));
    }
  };

  const runAllAutomatedTests = async () => {
    setIsRunning(true);
    
    // Clear previous results
    setTestResults(new Map());
    
    // Run automated cart tests
    await runCartTest('add');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runCartTest('update');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runRetryTest();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runPerformanceTest();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runCartTest('remove');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runCartTest('clear');
    
    setIsRunning(false);
  };

  if (!isVisible) return null;

  const performanceMetrics = cart.getPerformanceMetrics();

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Testing Dashboard</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <h4 className="font-semibold mb-2">Performance Metrics</h4>
        <div className="text-sm space-y-1">
          <div>Cache Hit Rate: {performanceMetrics.totalRequests > 0 ? 
            ((performanceMetrics.cacheHits / performanceMetrics.totalRequests) * 100).toFixed(1) : '0'}%</div>
          <div>Avg Response: {performanceMetrics.averageResponseTime.toFixed(0)}ms</div>
          <div>Retries: {performanceMetrics.retryCount}</div>
          <div>Total Requests: {performanceMetrics.totalRequests}</div>
        </div>
      </div>

      {/* Cart Status */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h4 className="font-semibold mb-2">Cart Status</h4>
        <div className="text-sm">
          <div>Items: {cart.items.length}</div>
          <div>Total: {cart.totalItems}</div>
          <div>Price: {cart.totalPrice.toLocaleString()} VND</div>
          <div>Loading: {cart.isLoading ? 'Yes' : 'No'}</div>
          {cart.error && <div className="text-red-600">Error: {cart.error}</div>}
        </div>
      </div>

      {/* Test Controls */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Quick Tests</h4>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button 
              onClick={() => runCartTest('add')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              disabled={isRunning}
            >
              Add Item
            </button>
            <button 
              onClick={() => runCartTest('update')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              disabled={isRunning || cart.items.length === 0}
            >
              Update
            </button>
            <button 
              onClick={() => runCartTest('remove')}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              disabled={isRunning || cart.items.length === 0}
            >
              Remove
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => runCartTest('clear')}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              disabled={isRunning}
            >
              Clear Cart
            </button>
            <button 
              onClick={runRetryTest}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              disabled={isRunning}
            >
              Test Retry
            </button>
          </div>
          <button 
            onClick={runAllAutomatedTests}
            className="w-full px-3 py-2 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.size > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Test Results</h4>
          <div className="space-y-1 text-sm">
            {Array.from(testResults.values()).map(result => (
              <div key={result.testId} className="flex justify-between items-center">
                <span>{result.testId}</span>
                <div className="flex items-center space-x-2">
                  {result.duration && (
                    <span className="text-gray-500">{result.duration}ms</span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.status === 'passed' ? 'bg-green-100 text-green-800' :
                    result.status === 'failed' ? 'bg-red-100 text-red-800' :
                    result.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Testing Checklist */}
      <div>
        <h4 className="font-semibold mb-2">Manual Tests</h4>
        <div className="text-xs text-gray-600">
          <p>✓ Check browser console for errors</p>
          <p>✓ Test on different screen sizes</p>
          <p>✓ Verify toast notifications</p>
          <p>✓ Test network failure scenarios</p>
          <p>✓ Check cache behavior</p>
        </div>
      </div>
    </div>
  );
}
