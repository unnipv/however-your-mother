'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Check if the current path is active
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <header style={{ 
      backgroundColor: '#F8F1DE',
      borderBottom: '1px solid #F1E3BE',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <Link href="/" style={{
              fontSize: '1.5rem',
              fontFamily: 'Georgia, Times New Roman, serif',
              fontWeight: 'bold',
              color: '#8C5E58'
            }}>
              HOWEVER-YOUR-MOTHER
            </Link>
          </div>
          
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <Link 
              href="/" 
              style={{
                fontFamily: 'Courier New, Courier, monospace',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isActive('/') ? '#4A6FA5' : '#2C2C2C',
                fontWeight: isActive('/') ? 'bold' : 'normal'
              }}
            >
              Home
            </Link>
            <Link 
              href="/memories" 
              style={{
                fontFamily: 'Courier New, Courier, monospace',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isActive('/memories') ? '#4A6FA5' : '#2C2C2C',
                fontWeight: isActive('/memories') ? 'bold' : 'normal'
              }}
            >
              Memories
            </Link>
            <Link 
              href="/editor" 
              style={{
                fontFamily: 'Courier New, Courier, monospace',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isActive('/editor') ? '#4A6FA5' : '#2C2C2C',
                fontWeight: isActive('/editor') ? 'bold' : 'normal'
              }}
            >
              Create Memory
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 