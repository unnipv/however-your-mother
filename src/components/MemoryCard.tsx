import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Memory } from '@/types';

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const { title, slug, creator_names, short_description, thumbnail_url, created_at } = memory;
  
  return (
    <Link href={`/memories/${slug}`} style={{ display: 'block', height: '100%' }}>
      <div style={{
        backgroundColor: '#FCF9F1',
        border: '1px solid #F1E3BE',
        borderRadius: '0.5rem',
        boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
      }}>
        <div style={{ position: 'relative', height: '12rem', width: '100%', flexShrink: 0 }}>
          {thumbnail_url ? (
            <Image 
              src={thumbnail_url} 
              alt={title} 
              fill 
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center top'
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F1E3BE'
            }}>
              <span style={{
                color: '#BE932A',
                fontSize: '1.125rem',
                fontFamily: 'Georgia, Times New Roman, serif'
              }}>No Image</span>
            </div>
          )}
        </div>
        
        <div style={{ padding: '1rem', flexGrow: 1 }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontFamily: 'Georgia, Times New Roman, serif',
            fontWeight: 'bold',
            color: '#2C2C2C',
            marginBottom: '0.25rem'
          }}>{title}</h3>
          
          {creator_names && (
            <p style={{
              fontSize: '0.875rem',
              color: '#8C5E58',
              fontFamily: 'Courier New, Courier, monospace',
              marginBottom: '0.5rem'
            }}>
              By {creator_names}
            </p>
          )}
          
          {short_description && (
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(44, 44, 44, 0.8)',
              marginBottom: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {short_description}
            </p>
          )}
          
          <div style={{
            fontSize: '0.75rem',
            color: '#4E6E5D',
            fontFamily: 'Courier New, Courier, monospace',
            marginTop: 'auto'
          }}>
            {formatDate(created_at)}
          </div>
        </div>
      </div>
    </Link>
  );
} 