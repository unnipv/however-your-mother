import { Memory } from '@/types';
// import { headers } from 'next/headers'; // Import headers

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!APP_URL) {
  console.error("Error: NEXT_PUBLIC_APP_URL is not defined. Please set it in your environment variables.");
  // We don't throw an error here to allow the app to build, 
  // but functions using APP_URL will fail or return empty/null if it's not set.
}

export async function getAllMemories(): Promise<Memory[]> {
  // const host = headers().get('host');
  // const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  // const appUrl = \`\${protocol}://\${host}\`;

  if (!APP_URL) {
    console.error("getAllMemories: NEXT_PUBLIC_APP_URL is not defined. Returning empty array.");
    return [];
  }

  try {
    // const res = await fetch(\`\${appUrl}/api/memories\`, { cache: 'no-store' });
    const res = await fetch(`${APP_URL}/api/memories`, { cache: 'no-store' });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Error fetching memories: ${res.status} ${res.statusText}`, errorBody);
      throw new Error(`Failed to fetch memories: ${res.status} ${errorBody}`);
    }
    const data = await res.json();
    return data.memories || [];
  } catch (error) {
    console.error("Error in getAllMemories:", error);
    return []; // Return empty array or rethrow, depending on desired error handling
  }
}

export async function getMemoryBySlug(slug: string): Promise<Memory | null> {
  // const host = headers().get('host');
  // const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  // const appUrl = \`\${protocol}://\${host}\`;

  if (!APP_URL) {
    console.error("getMemoryBySlug: NEXT_PUBLIC_APP_URL is not defined. Returning null.");
    return null;
  }

  try {
    // const res = await fetch(\`\${appUrl}/api/memories/slug/\${slug}\`, { cache: 'no-store' });
    const res = await fetch(`${APP_URL}/api/memories/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      const errorBody = await res.text();
      console.error(`Error fetching memory by slug ${slug}: ${res.status} ${res.statusText}`, errorBody);
      throw new Error(`Failed to fetch memory ${slug}: ${res.status} ${errorBody}`);
    }
    const data = await res.json();
    return data.memory;
  } catch (error) {
    console.error(`Error in getMemoryBySlug (${slug}):`, error);
    return null; // Return null or rethrow
  }
} 