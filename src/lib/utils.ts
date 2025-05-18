import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
  
  // If the title doesn't produce a valid slug, use a UUID
  if (!baseSlug) {
    return uuidv4();
  }
  
  return baseSlug;
}

/**
 * Format a date as a readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract Spotify playlist ID from a URL or ID string
 */
export function extractSpotifyPlaylistId(input: string): string | null {
  // If it's already just an ID, return it
  if (/^[a-zA-Z0-9]{22}$/.test(input)) {
    return input;
  }
  
  try {
    const url = new URL(input);
    if (url.hostname.includes('spotify.com')) {
      const pathParts = url.pathname.split('/');
      const playlistIndex = pathParts.findIndex(part => part === 'playlist');
      if (playlistIndex !== -1 && pathParts.length > playlistIndex + 1) {
        return pathParts[playlistIndex + 1];
      }
    }
  } catch {
    // Not a valid URL
  }
  
  return null;
}

/**
 * Get a placeholder thumbnail if none is provided
 */
export function getPlaceholderThumbnail(): string {
  return 'https://images.unsplash.com/photo-1505681425200-32e192a7a6e4?w=600&h=400&crop=center&auto=format';
}

/**
 * Calculate the number of years ago from a given date string.
 * Returns a string like "X years ago" or "This year" or "Last year".
 */
export function calculateYearsAgo(dateString: string | number | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();
  // Adjust if the anniversary hasn't occurred yet this year
  if (now.getMonth() < date.getMonth() || (now.getMonth() === date.getMonth() && now.getDate() < date.getDate())) {
    years--;
  }
  if (years < 0) years = 0; // Should not happen with past dates, but good sanity check
  return years === 0 ? "This year" : `${years} year${years === 1 ? '' : 's'} ago`;
}

export const DEFAULT_THUMBNAIL_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpMWTPrysjGzrbAmgfzfAvviAdr-_4LgMWgQ&s"; 