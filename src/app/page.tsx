import MemoryCard from '@/components/MemoryCard';
import { getAllMemories } from '@/lib/data';
import Link from 'next/link';
import { Memory } from '@/types';
import styles from './page.module.css';
import OnThisDayMemoryCard from '@/components/OnThisDayMemoryCard';
import YourMomJokePanel from '@/components/YourMomJokePanel';

// Helper function to fetch the "On This Day" memory
async function getOnThisDayMemory(): Promise<Memory | null> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    console.error("getOnThisDayMemory: NEXT_PUBLIC_APP_URL is not defined. Cannot fetch 'On This Day' memory.");
    return null;
  }

  try {
    const res = await fetch(`${appUrl}/api/memories/on-this-day`, {
      cache: "no-store", // Always fetch fresh data for this dynamic content
    });

    if (!res.ok) {
      const errorBodyText = await res.text();
      if (res.status === 404) {
        try {
          const errorJson = JSON.parse(errorBodyText);
          // Log the human-readable message from the API's 404 response
          console.info(`On This Day: ${errorJson.message || 'No memory found for this day.'}`);
        } catch (parseError) {
          // If parsing the 404 body fails, log a generic 404 message along with the parse error
          console.info('On This Day: No memory found for this day (could not parse API message).', parseError);
        }
      } else {
        // For other errors (500, network issues, etc.), log the full error details
        console.error(`Error fetching 'On This Day' memory: ${res.status} ${res.statusText}`, errorBodyText);
      }
      return null; // In all !res.ok cases, return null to show placeholder UI
    }
    const memoryData = await res.json();
    if (memoryData && memoryData.id) {
        return memoryData;
    }
    return null; // If not a valid memory object (e.g., {message: ...} or empty from a mishandled 404 that returned 200)
  } catch (error) {
    console.error("Error in getOnThisDayMemory:", error);
    return null; // Gracefully return null if there's an error
  }
}

export default async function Home() {
  let allRecentMemories: Memory[] = [];
  let fetchError: string | null = null;
  let onThisDayMemoryData: Memory | null = null;

  try {
    [allRecentMemories, onThisDayMemoryData] = await Promise.all([
      getAllMemories(),
      getOnThisDayMemory(),
    ]);
  } catch (error) {
    console.error("Home page - fetch error:", error);
    fetchError = "Could not load memories. Please try again later.";
  }

  const rightColumnMemories = allRecentMemories
    .filter(mem => !onThisDayMemoryData || mem.id !== onThisDayMemoryData.id)
    .slice(0, 4); // Take up to 4 for the 2x2 grid

  return (
    <div className={styles.pageContainer}>
      {/* Title for the entire grid section if desired, or keep specific titles */} 

      {fetchError && <p className={styles.fetchError}>{fetchError}</p>}

      {!fetchError && (
        <div className={styles.mainColumnsContainer}> 
          <div className={styles.leftColumn}>
            <div className={styles.jokePanelContainer}>
              <YourMomJokePanel />
            </div>
            <div className={styles.onThisDayContainer}>
              {onThisDayMemoryData ? (
                <OnThisDayMemoryCard memory={onThisDayMemoryData} />
              ) : (
                <div className={styles.noOnThisDayPlaceholder}>
                  <p>No special memory found for today.</p>
                  <Link href="/editor" className={`btn ${styles.createOneLink}`}>
                    Why not create one?
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightColumn}>
            {rightColumnMemories.length > 0 ? (
              <div className={styles.memoriesGridRight}>
                {rightColumnMemories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            ) : (
              <p className={styles.noMemoriesMessageRightCol}>
                No other recent memories to display here. Add some more!
              </p>
            )}
          </div>
        </div>
      )}

      {!fetchError && allRecentMemories.length > 0 && (
        <div className={styles.viewAllLinkWrapper}>
          <Link 
            href="/memories" 
            className={`btn ${styles.viewAllLink}`}
          >
            View All Memories
          </Link>
        </div>
      )}
      
      {!fetchError && allRecentMemories.length === 0 && !onThisDayMemoryData && (
         <p className={styles.noMemoriesMessage}>No memories yet. Be the first to create one!</p>
      )}
    </div>
  );
}
