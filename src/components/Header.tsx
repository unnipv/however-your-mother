'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css'; // Import CSS Modules
import { usePageTitle } from '@/context/PageTitleContext'; // Import usePageTitle
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher'; // Import ThemeSwitcher

export default function Header() {
  const pathname = usePathname();
  const { headerBannerTitle, setPageTitle } = usePageTitle(); // Consume context
  
  // Check if the current path is active
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  // Pathname-based title logic (can be a fallback or enhancement)
  // This useEffect will update the context if no page-specific title was set higher up.
  // This is useful for pages that don't set their own title via a MemoryTitleSetter.
  React.useEffect(() => {
    let titleBasedOnPath = null;
    if (pathname === '/') {
      titleBasedOnPath = "Recent Memories";
    } else if (pathname === '/memories') {
      titleBasedOnPath = "All Memories";
    } else if (pathname.startsWith('/memories/') && pathname.length > '/memories/'.length) {
      // Placeholder for specific memory pages - actual title will be set by MemoryTitleSetter
      // If MemoryTitleSetter hasn't run yet, this could be a brief fallback.
      titleBasedOnPath = "A Cherished Memory"; 
    } else if (pathname === '/editor') {
      titleBasedOnPath = "Create a New Memory";
    }
    // Only set if the context hasn't already received a more specific title from a page component.
    // The current logic in PageTitleContext gives precedence to what's set via setPageTitle.
    // So, this useEffect might primarily set the title for non-memory pages if they don't set one themselves.
    if (titleBasedOnPath) {
      setPageTitle(titleBasedOnPath); 
    }
    // When navigating away from a page that set a title (like a memory page),
    // we might want to clear it or let the new page set its own.
    // The current setup will have the new page (e.g. /memories) set its title via this effect.
  }, [pathname, setPageTitle]);

  return (
    <header className={styles.headerBase}>
      <div className={styles.container}>
        <div className={styles.headerTopRow}> {/* New wrapper for title and switcher */} 
          <div className={styles.titleWrapper}> 
            <Link href="/" className={styles.siteTitleLink}>
              Joseph Bobber, a man of multiple interests.
            </Link>
          </div>
          <div className={styles.themeSwitcherWrapper}> {/* Wrapper for switcher */} 
            <ThemeSwitcher />
          </div>
        </div>
          
        <nav className={styles.nav}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/memories" 
            className={`${styles.navLink} ${isActive('/memories') ? styles.navLinkActive : ''}`}
          >
            Memories
          </Link>
          <Link 
            href="/editor" 
            className={`${styles.navLink} ${isActive('/editor') ? styles.navLinkActive : ''}`}
          >
            Create Memory
          </Link>
        </nav>

        {/* Dynamic Page Title Banner - now uses headerBannerTitle from context */}
        {headerBannerTitle && (
          <div className={styles.pageTitleBanner}>
            <h2>{headerBannerTitle}</h2>
          </div>
        )}
      </div>
    </header>
  );
} 