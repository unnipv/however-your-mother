'use client';

import React, { useState, useEffect } from 'react';
// import Image from 'next/image'; // Ensure this is removed or commented out if not used elsewhere
import { formatDate, DEFAULT_THUMBNAIL_URL } from '@/lib/utils';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import RichTextRenderer from '@/components/RichTextRenderer';
import PasswordProtection from '@/components/PasswordProtection';
import { Memory } from '@/types';
import styles from './MemoryDetailClient.module.css';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas'; // Import html2canvas

interface MemoryDetailClientProps {
  memory: Memory;
}

const QR_CODE_ID = "memoryQrCode"; // ID for the SVG element
const QR_CARD_DOWNLOAD_ID = "qrMemoryCardToDownload"; // ID for the div to download

export default function MemoryDetailClient({ memory }: MemoryDetailClientProps) {
  const [isPasswordVerified, setIsPasswordVerified] = useState(!memory.password);
  const [showQrModal, setShowQrModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);

  useEffect(() => {
    // Ensure window.location.href is accessed only on the client side
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleDownloadCard = async () => {
    const cardElement = document.getElementById(QR_CARD_DOWNLOAD_ID);
    if (cardElement) {
      setIsDownloadingCard(true);
      try {
        const canvas = await html2canvas(cardElement, {
          allowTaint: true, // Important if images are from other domains (like Supabase storage)
          useCORS: true,    // Also for cross-origin images
          backgroundColor: null, // Use transparent background for canvas if element has it
          scale: 2, // Increase scale for better resolution
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${memory.slug || 'memory'}-card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating card image:", error);
        alert("Sorry, there was an error generating the card image.");
      } finally {
        setIsDownloadingCard(false);
      }
    }
  };

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
                  <SpotifyEmbed spotifyLinkOrId={memory.spotify_playlist_id} />
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
              <div className={styles.shareQrButtonContainer}>
                <button onClick={() => setShowQrModal(true)} className={styles.shareQrButton}>
                  Share memory as QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className={styles.richTextWrapper}>
        <RichTextRenderer 
          content={typeof memory.content === 'string' ? memory.content : JSON.stringify(memory.content)}
        />
      </div>

      {/* QR Code Modal - Enhanced */}
      {showQrModal && currentUrl && (
        <div className={styles.qrModalOverlay} onClick={() => setShowQrModal(false)}>
          <div className={styles.qrModalContent} onClick={(e) => e.stopPropagation()}>
            
            <div id={QR_CARD_DOWNLOAD_ID} className={styles.qrMemoryCardPreview}>
              {/* Thumbnail acts as background */}
              {memory.thumbnail_url && (
                <img 
                    src={memory.thumbnail_url} 
                    alt="Memory background" 
                    className={styles.qrMemoryThumbnailPreview} /* This will be styled like .backgroundImage */
                />
              )}
              {/* New Overlay for text and QR code */}
              <div className={styles.qrMemoryCardOverlay}> 
                <div className={styles.qrMemoryCardHeader}>
                  <h3 className={styles.qrMemoryTitle}>{memory.title}</h3>
                  {memory.creator_names && (
                    <p className={styles.qrMemoryCreator}>By {memory.creator_names}</p>
                  )}
                  <p className={styles.qrMemoryDate}>
                    {formatDate(memory.memory_date || memory.created_at)}
                  </p>
                </div>
                
                {/* Area for QR code, centered within the overlay */}
                <div className={styles.qrImageAndCodeArea}> 
                  <div className={styles.qrCodeContainer}>
                    <QRCodeSVG value={currentUrl} size={128} includeMargin={true} id={QR_CODE_ID} /> {/* Adjusted size */} 
                  </div>
                </div>
              </div>
            </div>

            <p className={styles.qrModalUrl}>{currentUrl}</p>
            <div className={styles.qrModalActions}>
                <button 
                  onClick={handleDownloadCard} 
                  className={styles.qrModalDownloadButton}
                  disabled={isDownloadingCard}
                >
                  {isDownloadingCard ? 'Downloading...' : 'Download Card'}
                </button>
                <button onClick={() => setShowQrModal(false)} className={styles.qrModalCloseButton}>
                    Close
                </button>
            </div>
          </div>
        </div>
      )}
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