'use client';

import { useEffect } from 'react';
import { usePageTitle } from '@/context/PageTitleContext';

interface MemoryTitleSetterProps {
  title: string | null; // Allow null if title might not be available
}

const MemoryTitleSetter: React.FC<MemoryTitleSetterProps> = ({ title }) => {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    if (title) {
      setPageTitle(title);
    }
    // Optional: Clear title on unmount if navigating away from this specific context
    // return () => setPageTitle(null); 
    // However, the Header's useEffect will set a new title based on pathname on navigation,
    // which might be sufficient.
  }, [title, setPageTitle]);

  return null; // This component does not render anything itself
};

export default MemoryTitleSetter; 