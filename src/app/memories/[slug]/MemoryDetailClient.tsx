'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import RichTextRenderer from '@/components/RichTextRenderer';
import PasswordProtection from '@/components/PasswordProtection';
import { Memory } from '@/types';

interface MemoryDetailClientProps {
  memory: Memory;
}

export default function MemoryDetailClient({ memory }: MemoryDetailClientProps) {
  const [isPasswordVerified, setIsPasswordVerified] = useState(!memory.password);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Only show content if password is verified or no password exists */}
      {isPasswordVerified ? (
        <>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontFamily: 'Georgia, Times New Roman, serif',
              fontWeight: 'bold',
              color: '#8C5E58',
              marginBottom: '0.75rem'
            }}>
              {memory.title}
            </h1>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem', 
              alignItems: 'center',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {memory.creator_names && (
                <span style={{
                  color: '#8C5E58',
                  fontFamily: 'Courier New, Courier, monospace'
                }}>
                  By {memory.creator_names}
                </span>
              )}
              <span style={{
                color: 'rgba(44, 44, 44, 0.6)',
                fontFamily: 'Courier New, Courier, monospace'
              }}>
                {formatDate(memory.created_at)}
              </span>
            </div>
            
            {memory.short_description && (
              <p style={{
                fontSize: '1.125rem',
                color: 'rgba(44, 44, 44, 0.8)',
                marginBottom: '1.5rem'
              }}>
                {memory.short_description}
              </p>
            )}
          </header>
          
          {/* Spotify Embed - If exists */}
          {memory.spotify_playlist_id && (
            <SpotifyEmbed playlistId={memory.spotify_playlist_id} />
          )}
          
          {/* Memory Content */}
          <div style={{
            backgroundColor: '#FCF9F1',
            border: '1px solid #F1E3BE',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Display thumbnail if available */}
            {memory.thumbnail_url && (
              <div style={{
                marginBottom: '1.5rem',
                position: 'relative',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)'
              }}>
                <Image 
                  src={memory.thumbnail_url} 
                  alt={memory.title}
                  width={800}
                  height={400}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            )}
            
            {/* Render the rich text content */}
            <RichTextRenderer content={memory.content} />
          </div>
        </>
      ) : (
        <PasswordProtection 
          memoryId={memory.id} 
          onPasswordVerified={() => setIsPasswordVerified(true)} 
        />
      )}
    </div>
  );
} 