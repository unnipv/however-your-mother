import MemoryCard from '@/components/MemoryCard';
// import { getAllMockMemories } from '@/lib/mockData'; // Remove mock
import { getAllMemories } from '@/lib/data'; // Add this
import Link from 'next/link';
import { Memory } from '@/types'; // Ensure Memory type is imported
import styles from './page.module.css'; // Import CSS Modules
import OnThisDayMemoryCard from '@/components/OnThisDayMemoryCard'; // Import the new component
import YourMomJokePanel from '@/components/YourMomJokePanel'; // Import the new joke panel
import { headers } from 'next/headers'; // Import headers

async function getOnThisDayMemory(): Promise<Memory | null> {
  try {
    const host = headers().get('host'); // Get host
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'; // Determine protocol
    const res = await fetch(`${protocol}://${host}/api/memories/on-this-day`, { // Construct full URL
      cache: 'no-store', // Fetch fresh data every time for this feature
    });
    if (!res.ok) {
      if (res.status === 404) {
        // console.log("No 'On This Day' memory found.");
        return null; // Expected if no memory matches
      }
      throw new Error(`Failed to fetch 'On This Day' memory: ${res.statusText} (status: ${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching 'On This Day' memory:", error);
    return null; // Return null on error so the page can still render
  }
}

export default async function Home() {
  let allRecentMemories: Memory[] = [];
  let fetchError: string | null = null;
  let onThisDayMemoryData: Memory | null = null;

  try {
    [allRecentMemories, onThisDayMemoryData] = await Promise.all([
      getAllMemories(), // Fetches all memories, ordered by creation date
      getOnThisDayMemory(),
    ]);
  } catch (error) {
    console.error("Home page - fetch error:", error);
    fetchError = "Could not load memories. Please try again later.";
  }

  // Prepare memories for the right column (2x2 grid)
  // Exclude the "On This Day" memory if it exists and is also in recent memories
  const rightColumnMemories = allRecentMemories
    .filter(mem => !onThisDayMemoryData || mem.id !== onThisDayMemoryData.id)
    .slice(0, 4); // Take up to 4 for the 2x2 grid

  return (
    <div className={styles.pageContainer}>
      {/* Title for the entire grid section if desired, or keep specific titles */} 
      {/* <h2 className={styles.mainGridTitle}>Spotlight & Recent</h2> */}

      {fetchError && <p className={styles.fetchError}>{fetchError}</p>}

      {!fetchError && (
        <div className={styles.mainColumnsContainer}> {/* New two-column container */} 
          {/* Left Column */}
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

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {rightColumnMemories.length > 0 ? (
              <div className={styles.memoriesGridRight}> {/* 2x2 grid for memories */}
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

      {/* View All Memories link - shown if there are any memories at all and no fetch error */} 
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
      
      {/* Message if absolutely no memories and no error */}
      {!fetchError && allRecentMemories.length === 0 && !onThisDayMemoryData && (
         <p className={styles.noMemoriesMessage}>No memories yet. Be the first to create one!</p>
      )}
    </div>
  );
}
