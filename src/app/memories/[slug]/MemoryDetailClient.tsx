'use client';

import React, { useState } from 'react';
// import Image from 'next/image'; // Ensure this is removed or commented out if not used elsewhere
import { formatDate, DEFAULT_THUMBNAIL_URL } from '@/lib/utils';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import RichTextRenderer from '@/components/RichTextRenderer';
import PasswordProtection from '@/components/PasswordProtection';
import { Memory } from '@/types';
import styles from './MemoryDetailClient.module.css';

interface MemoryDetailClientProps {
  memory: Memory;
}

export default function MemoryDetailClient({ memory }: MemoryDetailClientProps) {
  const [isPasswordVerified, setIsPasswordVerified] = useState(!memory.password);

  const renderMainContent = () => (
    <div className={styles.memoryDetailCard}>
      <header className={styles.header}>
        <div className={styles.headerTopRow}>
          <div className={styles.headerMainContent}>
            <h1 className={styles.title}>{memory.title}</h1>
            <div className={styles.metaInfo}>
              {memory.creator_names && (
                <span className={styles.creatorName}>By {memory.creator_names}</span>
              )}
              <span className={styles.creationDate}>
                {formatDate(memory.memory_date || memory.created_at)}
              </span>
            </div>
            {memory.short_description && (
              <p className={styles.shortDescription}>{memory.short_description}</p>
            )}
          </div>

          {(memory.spotify_playlist_id || memory.thumbnail_url) && (
            <div className={styles.headerSideContent}>
              {memory.spotify_playlist_id && (
                <div className={styles.spotifyEmbedWrapper}>
                  <SpotifyEmbed playlistId={memory.spotify_playlist_id} />
                </div>
              )}
              {!memory.spotify_playlist_id && (
                <div className={styles.thumbnailEmbedWrapper}>
                  <img
                    src={(memory.thumbnail_url && memory.thumbnail_url.trim() !== '') ? memory.thumbnail_url : DEFAULT_THUMBNAIL_URL}
                    alt={`${memory.title} thumbnail`}
                    className={styles.thumbnailImageInsideWrapper}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className={styles.richTextWrapper}>
        <RichTextRenderer 
          content={typeof memory.content === 'string' ? memory.content : JSON.stringify(memory.content)}
        />
      </div>
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      {isPasswordVerified ? renderMainContent() : (
        <PasswordProtection 
          memoryId={memory.id} 
          onVerified={() => setIsPasswordVerified(true)}
        />
      )}
    </div>
  );
} 