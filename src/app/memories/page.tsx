import MemoryCard from '@/components/MemoryCard';
// import { getAllMockMemories } from '@/lib/mockData'; // Remove mock
import { getAllMemories } from '@/lib/data'; // Add this
import { Memory } from '@/types'; // Ensure Memory type is imported
import styles from './memories.module.css'; // Import CSS Modules

export default async function MemoriesPage() { // Make async
  let memories: Memory[] = [];
  let fetchError: string | null = null;

  try {
    memories = await getAllMemories();
  } catch (error) {
    console.error("Memories page - fetch error:", error);
    fetchError = "Could not load memories. Please try again later.";
  }

  // gridContainerStyle removed as it's no longer used
  
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        All Memories
      </h1>
      
      {fetchError ? (
        <p className={styles.fetchError}>{fetchError}</p>
      ) : memories.length === 0 ? (
        <p className={styles.noMemoriesMessage}>No memories yet. Create one!</p>
      ) : (
        <div className="memory-card-grid"> {/* Ensure this class matches global or local styles */}
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      )}
    </div>
  );
} 