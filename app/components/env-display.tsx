'use client';

import { useEffect, useState } from 'react';

export default function EnvDisplay() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Environment variables available on client side
    setEnvVars({
      'NEXT_PUBLIC_AI_URL': process.env.NEXT_PUBLIC_AI_URL || 'Not set',
    });
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Environment Variables (Client Side)</h3>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-mono text-sm">{key}:</span>
            <span className="font-mono text-sm bg-white px-2 py-1 rounded">
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-600">
        <p>Note: Only variables with NEXT_PUBLIC_ prefix are available on client side</p>
      </div>
    </div>
  );
} 