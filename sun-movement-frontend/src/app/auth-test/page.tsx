'use client';

import CustomerLogin from '@/components/auth/CustomerLogin';
import CustomerRegister from '@/components/auth/CustomerRegister';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthTestPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Authentication Test</h1>
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded ${mode === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Register
            </button>
          </div>
        </div>

        {mode === 'login' ? (
          <CustomerLogin onSwitchToRegister={() => setMode('register')} />
        ) : (
          <CustomerRegister onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}
