import { Suspense } from 'react';
import { getMockMemoryBySlug } from '@/lib/mockData';
import { Memory } from '@/types';
import { notFound } from 'next/navigation';
import MemoryDetailClient from './MemoryDetailClient';

// This is now a server component
export default async function MemoryDetailPage({ params }: { 
  params: { slug: string } 
}) {
  // Access params safely on the server side
  const slug = params.slug;
  
  // In a real app, this would make a database call
  const memory = getMockMemoryBySlug(slug);
  
  if (!memory) {
    notFound();
  }
  
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
      <MemoryDetailClient memory={memory} />
    </Suspense>
  );
} 