import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Memory } from '@/types';
import styles from './OnThisDayMemoryCard.module.css';
import { formatDate, calculateYearsAgo, DEFAULT_THUMBNAIL_URL } from '@/lib/utils';

interface OnThisDayMemoryCardProps {
  memory: Memory;
}

const OnThisDayMemoryCard: React.FC<OnThisDayMemoryCardProps> = ({ memory }) => {
  const yearsAgo = memory.memory_date 
    ? calculateYearsAgo(memory.memory_date) 
    : calculateYearsAgo(memory.created_at);

  const displayDate = memory.memory_date ? memory.memory_date : memory.created_at;

  const displayImageUrl = (memory.thumbnail_url && memory.thumbnail_url.trim() !== '') 
    ? memory.thumbnail_url 
    : DEFAULT_THUMBNAIL_URL;

  return (
    <article className={styles.card}>
      <Image 
        src={displayImageUrl} 
        alt={memory.title || 'Memory image background'} 
        fill 
        className={styles.backgroundImage}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
      <Link href={`/memories/${memory.slug}`} className={styles.cardLink}>
        <div className={styles.overlay}>
          <div>
            <h2 className={styles.cardCategoryTitle}>On This Day</h2>
            <p className={styles.yearsAgo}>{yearsAgo}</p>
          </div>
          <div className={styles.content}>
            <h3 className={styles.memoryTitle}>{memory.title}</h3>
            {memory.short_description && (
              <p className={styles.description}>{memory.short_description}</p>
            )}
            <div className={styles.meta}>
              {memory.creator_names && (
                <span className={styles.creator}>By: {memory.creator_names}</span>
              )}
              <span className={styles.date}>Originally from: {formatDate(displayDate)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default OnThisDayMemoryCard; 