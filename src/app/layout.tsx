import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
// import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { PageTitleProvider } from "@/context/PageTitleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Joe Bobby - A man of multiple interests',
  description: 'A digital box of memories for our friend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <ThemeProvider>
          <PageTitleProvider>
            <Header />
            <div className={styles.layoutGrid}>
              <main className={styles.mainContent}>
                {children}
              </main>
              <RightSidebar />
            </div>
            <footer className={styles.footer}>
              <p>oh happy bday joe</p>
              <a 
                href="https://github.com/unnipv/however-your-mother/issues/new" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.footerLink}
              >
                Report Bug / Suggest Feature
              </a>
            </footer>
          </PageTitleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
