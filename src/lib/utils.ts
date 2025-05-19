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
 * Extract Spotify ID (track or playlist) from a URL or ID string
 */
export function extractSpotifyId(input: string): string | null {
  if (!input || input.trim() === '') return null;

  // Regex for Spotify track URLs (accounts for optional internationalization segment e.g. /intl-en/)
  const trackRegex = /^https?:\/\/(?:open|play)\.spotify\.com\/(?:intl-[a-zA-Z]{2}\/)?track\/([a-zA-Z0-9]+)/;
  // Regex for Spotify playlist URLs (accounts for optional internationalization segment)
  const playlistRegex = /^https?:\/\/(?:open|play)\.spotify\.com\/(?:intl-[a-zA-Z]{2}\/)?playlist\/([a-zA-Z0-9]+)/;
  // Spotify IDs are typically 22 alphanumeric characters
  const idRegex = /^[a-zA-Z0-9]{22}$/;

  let match = input.match(trackRegex);
  if (match && match[1]) {
    return match[1]; // Return track ID
  }

  match = input.match(playlistRegex);
  if (match && match[1]) {
    return match[1]; // Return playlist ID
  }

  // If it's not a URL, check if it's just an ID that matches the typical format
  if (idRegex.test(input)) {
    return input; // Return as is, could be track or playlist ID
  }
  
  return null; // Not a recognizable Spotify URL or ID that we can extract an ID from
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