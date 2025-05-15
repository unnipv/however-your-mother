import { Memory } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const mockMemories: Memory[] = [
  {
    id: uuidv4(),
    title: 'Trip to the Beach',
    slug: 'trip-to-the-beach',
    creator_names: 'Alice and Bob',
    short_description: 'That amazing day we spent at the beach last summer.',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'What an amazing day we had at the beach! The sun was shining and the waves were perfect.' }
          ]
        }
      ]
    }),
    thumbnail_url: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=600&h=400&crop=faces&auto=format',
    media_r2_keys: [],
    created_at: new Date('2023-07-15').toISOString(),
    updated_at: new Date('2023-07-15').toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Birthday Party',
    slug: 'birthday-party',
    creator_names: 'The Gang',
    short_description: 'Surprise birthday party with everyone!',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'We organized a surprise birthday party and it was awesome! Everyone came and had a great time.' }
          ]
        }
      ]
    }),
    thumbnail_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&crop=focalpoint&auto=format',
    spotify_playlist_id: '5vzlU3jHILB4IfycBjhXN2',
    media_r2_keys: [],
    created_at: new Date('2023-04-22').toISOString(),
    updated_at: new Date('2023-04-22').toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Graduation Day',
    slug: 'graduation-day',
    creator_names: 'Charlie',
    short_description: 'The day we all graduated together.',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Graduation day was one of the best days of my life. We all celebrated together and made memories that will last forever.' }
          ]
        }
      ]
    }),
    thumbnail_url: 'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=600&h=400&crop=top&auto=format',
    media_r2_keys: [],
    created_at: new Date('2022-06-17').toISOString(),
    updated_at: new Date('2022-06-17').toISOString(),
  }
];

export function getMockMemoryBySlug(slug: string): Memory | undefined {
  return mockMemories.find(memory => memory.slug === slug);
}

export function getAllMockMemories(): Memory[] {
  return mockMemories;
} 