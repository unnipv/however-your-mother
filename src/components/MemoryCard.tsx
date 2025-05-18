import Link from 'next/link';
import Image from 'next/image';
import { formatDate, DEFAULT_THUMBNAIL_URL } from '@/lib/utils';
import { Memory } from '@/types';
import styles from './MemoryCard.module.css';

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const imageUrlToUse = (memory.thumbnail_url && memory.thumbnail_url.trim() !== '') 
    ? memory.thumbnail_url 
    : DEFAULT_THUMBNAIL_URL;

  return (
    <Link href={`/memories/${memory.slug}`} className={styles.cardLink}>
      <Image
        src={imageUrlToUse}
        alt={`${memory.title} thumbnail background`}
        fill
        className={styles.backgroundImage}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={false}
      />
      <div className={styles.overlay}>
        <div className={styles.contentWrapper}>
          <h3 className={styles.title}>{memory.title}</h3>
          {memory.creator_names && (
            <p className={styles.creator}>By {memory.creator_names}</p>
          )}
          {memory.short_description && (
            <p className={styles.description}>{memory.short_description}</p>
          )}
          <p className={styles.date}>{formatDate(memory.created_at)}</p>
        </div>
      </div>
    </Link>
  );
} 