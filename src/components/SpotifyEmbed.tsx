'use client';
import styles from './SpotifyEmbed.module.css';

interface SpotifyEmbedProps {
  spotifyLinkOrId: string;
  linkType?: 'track' | 'playlist';
}

export default function SpotifyEmbed({ spotifyLinkOrId, linkType }: SpotifyEmbedProps) {
  let embedUrl = '';
  let title = 'Spotify Embed';

  const spotifyTrackRegex = /^https?:\/\/open\.spotify\.com\/(?:intl-[a-zA-Z]{2}\/)?track\/([a-zA-Z0-9]+)/;
  const spotifyPlaylistRegex = /^https?:\/\/open\.spotify\.com\/(?:intl-[a-zA-Z]{2}\/)?playlist\/([a-zA-Z0-9]+)/;
  const spotifyIdRegex = /^[a-zA-Z0-9]{22}$/;

  let id = spotifyLinkOrId;
  let determinedType = linkType;

  if (!determinedType) {
    const trackMatch = spotifyLinkOrId.match(spotifyTrackRegex);
    const playlistMatch = spotifyLinkOrId.match(spotifyPlaylistRegex);
    if (trackMatch && trackMatch[1]) {
      id = trackMatch[1];
      determinedType = 'track';
    } else if (playlistMatch && playlistMatch[1]) {
      id = playlistMatch[1];
      determinedType = 'playlist';
    }
  } else {
    const trackMatch = spotifyLinkOrId.match(spotifyTrackRegex);
    const playlistMatch = spotifyLinkOrId.match(spotifyPlaylistRegex);
    if (determinedType === 'track' && trackMatch && trackMatch[1]) id = trackMatch[1];
    else if (determinedType === 'playlist' && playlistMatch && playlistMatch[1]) id = playlistMatch[1];
  }

  if (id.match(spotifyIdRegex)) {
    if (determinedType === 'track') {
      embedUrl = `https://open.spotify.com/embed/track/${id}`;
      title = `Spotify Track ${id}`;
    } else {
      embedUrl = `https://open.spotify.com/embed/playlist/${id}`;
      title = `Spotify Playlist ${id}`;
    }
  } else {
    console.warn('Invalid Spotify ID provided to SpotifyEmbed after processing:', spotifyLinkOrId, 'Resolved ID:', id);
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