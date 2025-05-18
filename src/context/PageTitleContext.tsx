'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PageTitleContextType {
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
  headerBannerTitle: string; // This will be derived and used by Header
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export const PageTitleProvider = ({ children }: { children: ReactNode }) => {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  // We can add logic here to combine with pathname-based titles if needed as a fallback
  // For now, headerBannerTitle will primarily reflect what's set by pages via setPageTitle
  // Or a default if nothing is set.
  const headerBannerTitle = pageTitle || "Digital Memory Box"; // Default if pageTitle is null

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle, headerBannerTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
}; 