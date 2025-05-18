'use client';
import styles from './SpotifyEmbed.module.css';

interface SpotifyEmbedProps {
  playlistId: string;
  // height prop is removed as CSS will control it via parent
}

export default function SpotifyEmbed({ playlistId }: SpotifyEmbedProps) {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
  
  return (
    <div className={styles.embedContainer}>
      <iframe 
        className={styles.spotifyIframe}
        src={embedUrl}
        allowFullScreen={true} // Spotify recommended
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" // Spotify recommended
        loading="lazy"
        title={`Spotify Playlist ${playlistId}`} // Added for accessibility
      ></iframe>
    </div>
  );
} 