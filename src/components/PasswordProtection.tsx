'use client';

import { useState } from 'react';
import styles from './PasswordProtection.module.css'; // Import CSS module

interface PasswordProtectionProps {
  onVerified: () => void;
  memoryId: string;
  // memoryTitle: string; // Removed as it's not used
}

export default function PasswordProtection({ 
  onVerified,
  memoryId,
  // memoryTitle // Removed as it's not used
}: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // console.log('Memory ID for password check:', memoryId); // Can remove this now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/memories/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId, password }), // Use memoryId here
      });
      
      const result = await response.json();

      if (response.ok && result.verified) {
        onVerified();
      } else {
        setError(result.message || 'Incorrect password or verification failed.');
      }
    } catch (err) {
      console.error('Password verification request failed:', err);
      setError('Failed to verify password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.protectionWrapper}>
      <h2 className={styles.title}>
        This memory is password protected
      </h2>
      
      <p className={styles.promptText}>
        Please enter the password to view this memory.
      </p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={styles.inputField}
          required
        />
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Verifying...' : 'Unlock Memory'}
          </button>
        </div>
      </form>
    </div>
  );
} 