import { Memory } from '@/types';
import { headers } from 'next/headers'; // Import headers

// Base URL for the API, works for server-side fetching within the same app
// const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Remove this

export async function getAllMemories(): Promise<Memory[]> {
  try {
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = `${protocol}://${host}/api/memories`;

    const response = await fetch(apiUrl, {
      cache: 'no-store', // Ensure fresh data, or use revalidation strategies
    });

    if (!response.ok) {
      // Log error details or throw a more specific error
      const errorData = await response.text();
      console.error("Failed to fetch memories:", response.status, errorData);
      throw new Error('Failed to fetch memories');
    }
    const memories = await response.json();
    return memories as Memory[];
  } catch (error) {
    console.error("Error in getAllMemories:", error);
    // In a real app, you might want to return an empty array or handle this more gracefully
    // For now, re-throwing to make it visible during development
    throw error;
  }
}

export async function getMemoryBySlug(slug: string): Promise<Memory | null> {
  try {
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = `${protocol}://${host}/api/memories/slug/${slug}`;

    const response = await fetch(apiUrl, { 
      cache: 'no-store',
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.text();
      console.error(`Failed to fetch memory by slug ${slug}:`, response.status, errorData);
      throw new Error(`Failed to fetch memory by slug ${slug}`);
    }
    const memory = await response.json();
    return memory as Memory;
  } catch (error) {
    console.error(`Error in getMemoryBySlug for slug ${slug}:`, error);
    throw error;
  }
} 