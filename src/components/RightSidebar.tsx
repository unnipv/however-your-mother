import { headers } from 'next/headers'; // Import headers
import Link from 'next/link'; // For the button
import styles from './RightSidebar.module.css';

interface LoreEntry {
  id: string;
  content: string;
  created_at: string;
}

async function getRandomLores(): Promise<LoreEntry[]> {
  try {
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = `${protocol}://${host}/api/lores/random`;

    const response = await fetch(apiUrl, {
      cache: 'no-store', // Ensure fresh lore on each load
    });

    if (!response.ok) {
      console.error("Failed to fetch random lores:", response.status, await response.text());
      return []; // Return empty array on error
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getRandomLores:", error);
    return [];
  }
}

export default async function RightSidebar() {
  const lores = await getRandomLores();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Joe Bobby Lore</h2>
      
      {lores.length > 0 ? (
        lores.map((lore) => (
          <div key={lore.id} className={styles.loreEntry}>
            <p>{lore.content}</p>
          </div>
        ))
      ) : (
        <p className={styles.noLoresMessage}>No lore to display yet. Be the first to contribute!</p>
      )}

      <div className={styles.contributeButtonContainer}>
        {/* TODO: Link this button to a lore submission page/modal */}
        <Link href="/contribute-lore" className={styles.contributeButton}>
          Contribute to Lore
        </Link>
      </div>
    </aside>
  );
} 