'use client';

import { useState } from 'react';

export default function HealthPage() {
  const [basicHealth, setBasicHealth] = useState(null);
  const [detailedHealth, setDetailedHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBasicHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setBasicHealth(data);
    } catch (error) {
      setBasicHealth({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkDetailedHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health/detailed');
      const data = await response.json();
      setDetailedHealth(data);
    } catch (error) {
      setDetailedHealth({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Server Health Check</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Health Check */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Health Check</h2>
            <button
              onClick={checkBasicHealth}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md mb-4"
            >
              {loading ? 'Checking...' : 'Check Basic Health'}
            </button>
            
            {basicHealth && (
              <div className="mt-4">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  basicHealth.status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Status: {basicHealth.status}
                </div>
                <pre className="mt-4 bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(basicHealth, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Detailed Health Check */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Health Check</h2>
            <button
              onClick={checkDetailedHealth}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md mb-4"
            >
              {loading ? 'Checking...' : 'Check Detailed Health'}
            </button>
            
            {detailedHealth && (
              <div className="mt-4">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  detailedHealth.status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Status: {detailedHealth.status}
                </div>
                <pre className="mt-4 bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(detailedHealth, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Endpoints</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">GET /api/health</code>
              <span className="text-gray-600">Basic health check with database connection</span>
            </div>
            <div className="flex items-center space-x-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">GET /api/health/detailed</code>
              <span className="text-gray-600">Detailed health check with system information</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 