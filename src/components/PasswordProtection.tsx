'use client';

import { useState } from 'react';

interface PasswordProtectionProps {
  onPasswordVerified: () => void;
  memoryId: string;
}

export default function PasswordProtection({ 
  onPasswordVerified, 
  memoryId 
}: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // For development, we're using a simple check
  // In production, this would make an API call to verify the password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // This is a development mock - in production, you would call a real API
      // const response = await fetch('/api/memories/verify-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id: memoryId, password }),
      // });
      
      // Mock response for development
      const mockResult = password === '1234'; // Simple mock password
      
      if (mockResult) {
        onPasswordVerified();
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Failed to verify password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-protection bg-sepia-50 border border-sepia-200 p-6 rounded-lg shadow-vintage max-w-md mx-auto my-8">
      <h2 className="text-2xl font-vintage text-ink mb-4 text-center">
        This memory is password protected
      </h2>
      
      <p className="mb-6 text-center text-ink/80">
        Please enter the password to view this memory.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded border border-sepia-300 bg-white font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 text-vintage-red text-sm text-center">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sepia-700 hover:bg-sepia-800 text-white font-vintage py-2 px-4 rounded shadow-vintage transition disabled:opacity-70"
        >
          {isLoading ? 'Verifying...' : 'Unlock Memory'}
        </button>
      </form>
    </div>
  );
} 