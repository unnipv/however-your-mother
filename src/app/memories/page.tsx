import MemoryCard from '@/components/MemoryCard';
import { getAllMockMemories } from '@/lib/mockData';

export default function MemoriesPage() {
  // In production, this would be fetched from a real database
  const memories = getAllMockMemories();
  
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-vintage font-bold text-vintage-brown mb-3">
          All Memories
        </h1>
        <p className="text-lg text-ink/80">
          Browse through all the memories in our collection.
        </p>
      </header>
      
      {memories.length > 0 ? (
        <div className="memory-card-grid">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-ink/60 font-vintage">
            No memories found. Be the first to create one!
          </p>
        </div>
      )}
    </div>
  );
} 