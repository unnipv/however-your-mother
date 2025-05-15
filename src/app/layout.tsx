import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'HOWEVER-YOUR-MOTHER | A Box of Memories',
  description: 'A digital box of memories for our friend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        backgroundColor: '#FCF9F1',
        color: '#2C2C2C',
        minHeight: '100vh'
      }}>
        <Header />
        <main style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
          position: 'relative',
          zIndex: 10
        }}>
          {children}
        </main>
        <footer style={{
          marginTop: 'auto',
          padding: '1.5rem 0',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'rgba(44, 44, 44, 0.6)',
          fontFamily: 'Courier New, Courier, monospace'
        }}>
          <p>Built with ❤️ by friends</p>
        </footer>
      </body>
    </html>
  );
}
