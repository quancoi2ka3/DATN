'use client'

import { useEffect, useState } from 'react'
import { initMixpanel, trackPageView, trackSearch, trackProductView, testMixpanelConnection } from '@/services/analytics'

export default function DebugAnalytics() {
  const [logs, setLogs] = useState<string[]>([])
  const [mixpanelStatus, setMixpanelStatus] = useState('Not tested')

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp}: ${message}`])
    console.log(message)
  }

  useEffect(() => {
    addLog('🚀 Debug Analytics Page Loaded')
    initMixpanel()
    addLog('🎯 Mixpanel initialization attempted')
  }, [])

  const testConnection = async () => {
    addLog('🔍 Testing Mixpanel connection...')
    const result = await testMixpanelConnection()
    setMixpanelStatus(result ? 'Connected' : 'Failed')
    addLog(result ? '✅ Connection test passed' : '❌ Connection test failed')
  }

  const testPageView = async () => {
    addLog('📄 Testing page view tracking...')
    try {
      await trackPageView('Debug Analytics Page')
      addLog('✅ Page view tracked')
    } catch (error) {
      addLog('❌ Page view failed: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const testSearch = async () => {
    addLog('🔍 Testing search tracking...')
    try {
      await trackSearch('debug-user', 'test search query', 5)
      addLog('✅ Search tracked')
    } catch (error) {
      addLog('❌ Search failed: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const testProductView = async () => {
    addLog('👁️ Testing product view tracking...')
    try {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        category: 'Electronics'
      }
      await trackProductView('debug-user', mockProduct)
      addLog('✅ Product view tracked')
    } catch (error) {
      addLog('❌ Product view failed: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Analytics Debug Console</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Control Panel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="space-y-3">
            <div>
              <strong>Mixpanel Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                mixpanelStatus === 'Connected' ? 'bg-green-100 text-green-800' :
                mixpanelStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {mixpanelStatus}
              </span>
            </div>
            
            <button 
              onClick={testConnection}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              🔍 Test Connection
            </button>
            
            <button 
              onClick={testPageView}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              📄 Test Page View
            </button>
            
            <button 
              onClick={testSearch}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              🔍 Test Search
            </button>
            
            <button 
              onClick={testProductView}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              👁️ Test Product View
            </button>
            
            <button 
              onClick={() => window.open('http://localhost:5000/Admin/MixpanelTest', '_blank')}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🔧 Open Backend Test Console
            </button>
            
            <button 
              onClick={clearLogs}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              🧹 Clear Logs
            </button>
          </div>
        </div>

        {/* Log Panel */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Event Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500">No logs yet...</div>
            )}
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">🔧 Environment Info</h3>
        <div className="text-sm space-y-1">
          <div><strong>Token:</strong> {process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ? 
            process.env.NEXT_PUBLIC_MIXPANEL_TOKEN.substring(0, 8) + '...' : 
            'Not configured'}</div>
          <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
          <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</div>
        </div>
      </div>
    </div>
  )
}
