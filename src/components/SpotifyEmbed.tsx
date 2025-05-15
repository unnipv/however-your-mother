'use client';

interface SpotifyEmbedProps {
  playlistId: string;
  height?: number;
}

export default function SpotifyEmbed({ playlistId, height = 380 }: SpotifyEmbedProps) {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
  
  return (
    <div className="spotify-embed my-6 rounded-lg overflow-hidden shadow-vintage-lg">
      <iframe 
        src={embedUrl}
        width="100%" 
        height={height}
        frameBorder="0" 
        allowTransparency={true} 
        allow="encrypted-media"
        loading="lazy"
      ></iframe>
    </div>
  );
} 