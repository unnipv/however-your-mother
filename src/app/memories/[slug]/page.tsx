import { getMemoryBySlug } from '@/lib/data';
import MemoryDetailClient from './MemoryDetailClient';
import { notFound } from 'next/navigation';
import { Memory } from '@/types';
import MemoryTitleSetter from '@/components/MemoryTitleSetter';

interface MemoryDetailPageProps {
  params: { slug: string };
}

export default async function MemoryDetailPage({ params }: MemoryDetailPageProps) {
  const { slug } = params;
  let memory: Memory | null = null;
  let fetchError: string | null = null;

  try {
    memory = await getMemoryBySlug(slug);
  } catch (error) {
    console.error(`Error fetching memory with slug ${slug}:`, error);
    fetchError = "Could not load memory details. It might not exist or there was a server error.";
    // We could call notFound() here directly if preferred, or let the UI handle fetchError
  }

  if (fetchError || !memory) {
    // If you want to show a custom error message on the page:
    // return <div className="text-center mt-8 text-vintage-red">{fetchError || "Memory not found."}</div>;
    // Or, to redirect to the standard 404 page:
    notFound();
  }

  return (
    <>
      <MemoryTitleSetter title={memory.title} />
      <MemoryDetailClient memory={memory} />
    </>
  );
} 