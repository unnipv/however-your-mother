'use client';
import styles from './SpotifyEmbed.module.css';

interface SpotifyEmbedProps {
  spotifyLinkOrId: string; // Changed from playlistId
}

export default function SpotifyEmbed({ spotifyLinkOrId }: SpotifyEmbedProps) {
  let embedUrl = '';
  let title = 'Spotify Embed';

  const spotifyTrackRegex = /^https?:\/\/open\.spotify\.com\/(?:intl-[a-zA-Z]{2}\/)?track\/([a-zA-Z0-9]+)/;
  const spotifyPlaylistRegex = /^https?:\/\/open\.spotify\.com\/(?:intl-[a-zA-Z]{2}\/)?playlist\/([a-zA-Z0-9]+)/;
  // Basic regex for what looks like a Spotify ID (alphanumeric)
  const spotifyIdRegex = /^[a-zA-Z0-9]+$/;

  let id = '';

  const trackMatch = spotifyLinkOrId.match(spotifyTrackRegex);
  const playlistMatch = spotifyLinkOrId.match(spotifyPlaylistRegex);

  if (trackMatch && trackMatch[1]) {
    id = trackMatch[1];
    embedUrl = `https://open.spotify.com/embed/track/${id}`;
    title = `Spotify Track ${id}`;
  } else if (playlistMatch && playlistMatch[1]) {
    id = playlistMatch[1];
    embedUrl = `https://open.spotify.com/embed/playlist/${id}`;
    title = `Spotify Playlist ${id}`;
  } else if (spotifyLinkOrId.match(spotifyIdRegex)) {
    // Assuming raw ID without URL is a playlist (can be refined later if needed)
    id = spotifyLinkOrId;
    embedUrl = `https://open.spotify.com/embed/playlist/${id}`;
    title = `Spotify Playlist ${id}`;
  } else {
    // Invalid or unrecognised link/ID format
    console.warn('Invalid Spotify link or ID provided to SpotifyEmbed:', spotifyLinkOrId);
    // Optionally, render nothing or an error message
    return <div className={styles.embedContainer}><p>Invalid Spotify link/ID.</p></div>;
  }
  
  return (
    <div className={styles.embedContainer}>
      <iframe 
        className={styles.spotifyIframe}
        src={embedUrl}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={title}
      ></iframe>
    </div>
  );
} 