'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import styles from './RightSidebar.module.css';
import { Lore } from '@/types';

async function fetchAllApprovedLores(): Promise<Lore[]> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      console.error("fetchAllApprovedLores: NEXT_PUBLIC_APP_URL is not defined.");
      return [];
    }
    const response = await fetch(`${appUrl}/api/lores/all`, { cache: 'no-store' });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Failed to fetch all approved lores:', response.status, errorBody);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : []; // Ensure it returns an array
  } catch (error) {
    console.error('Error fetching all lores:', error);
    return [];
  }
}

const JoeBobbyLore: React.FC = () => {
  const [lores, setLores] = useState<Lore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLores = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedLores = await fetchAllApprovedLores();
        setLores(fetchedLores);
      } catch (e) {
        console.error("Error in loadLores:", e);
        setError('Could not load lore at this time.');
      }
      setIsLoading(false);
    };

    loadLores();
  }, []);

  if (isLoading) {
    return <p className={styles.loreItem}>Loading lore...</p>;
  }

  if (error) {
    return <p className={styles.loreItemError}>{error}</p>;
  }

  return (
    <div className={styles.loreSection}>
      <h3 className={styles.loreTitle}>Joe Bobby Lore</h3>
      {lores.length > 0 ? (
        <div className={styles.loresListContainer}> {/* Added for scrolling */}
          {lores.map((loreEntry) => (
            <p key={loreEntry.id} className={styles.loreItem}>
              {loreEntry.content}
            </p>
          ))}
        </div>
      ) : (
        <p className={styles.loreItem}>No lore available at the moment. Be the first to contribute!</p>
      )}
      <Link href="/lore/submit" className={styles.submitLoreLink}>
        Contribute to Lore
      </Link>
    </div>
  );
};

const RightSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Suspense fallback={<p className={styles.loreItem}>Loading lore section...</p>}>
        <JoeBobbyLore />
      </Suspense>
      {/* Other sidebar content can go here */}
    </aside>
  );
};

export default RightSidebar; 