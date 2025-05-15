import MemoryCard from '@/components/MemoryCard';
import { getAllMockMemories } from '@/lib/mockData';
import Link from 'next/link';

export default function Home() {
  // In production, this would be fetched from a real database
  const memories = getAllMockMemories();
  
  return (
    <div style={{ 
      position: 'relative',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <section style={{
        textAlign: 'center',
        padding: '2rem 0',
        maxWidth: '800px',
        margin: '0 auto 2.5rem auto'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontFamily: 'Georgia, Times New Roman, serif',
          fontWeight: 'bold',
          color: '#8C5E58',
          marginBottom: '1rem'
        }}>
          Welcome to Your Digital Memory Box
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'rgba(44, 44, 44, 0.8)',
          marginBottom: '1.5rem'
        }}>
          A collection of cherished memories for our dear friend.
          Browse through the memories below or create your own contribution.
        </p>
        <Link 
          href="/editor" 
          style={{
            display: 'inline-block',
            backgroundColor: '#5B8C85',
            color: 'white',
            fontFamily: 'Georgia, Times New Roman, serif',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.2s'
          }}
        >
          Create a Memory
        </Link>
      </section>
      
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontFamily: 'Georgia, Times New Roman, serif',
          fontWeight: 'bold',
          color: '#8C5E58',
          marginBottom: '1.5rem'
        }}>
          Recent Memories
        </h2>
        
        <div className="memory-card-grid">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
        
        <div style={{
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <Link 
            href="/memories" 
            style={{
              display: 'inline-block',
              border: '1px solid #F1E3BE',
              backgroundColor: '#FCF9F1',
              fontFamily: 'Courier New, Courier, monospace',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem',
              transition: 'background-color 0.2s'
            }}
          >
            View All Memories
          </Link>
        </div>
      </section>
    </div>
  );
}
