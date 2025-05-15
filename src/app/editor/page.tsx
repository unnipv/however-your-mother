'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import RichTextEditor from '@/components/RichTextEditor';
import { generateSlug, extractSpotifyPlaylistId, getPlaceholderThumbnail } from '@/lib/utils';
import { MemoryFormData } from '@/types';

// Form validation schema
const memoryFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  creator_names: z.string().optional(),
  short_description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  content: z.string().min(10, 'Content is required'),
  spotify_playlist_id: z.string().optional(),
  password: z.string().optional(),
});

type FormData = z.infer<typeof memoryFormSchema>;

export default function EditorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  
  // Initialize the form with React Hook Form
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(memoryFormSchema),
    defaultValues: {
      title: '',
      creator_names: '',
      short_description: '',
      content: '',
      spotify_playlist_id: '',
      password: '',
    },
  });
  
  // Handle rich text editor content changes
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setValue('content', content, { shouldValidate: true });
  };
  
  // Form submission handler
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to an API
      // For now, we'll just create a mock memory and redirect
      
      // Process the Spotify playlist ID if provided
      let spotifyId = data.spotify_playlist_id;
      if (spotifyId) {
        const extractedId = extractSpotifyPlaylistId(spotifyId);
        spotifyId = extractedId || spotifyId;
      }
      
      // Create a new memory object
      const newMemory = {
        id: uuidv4(),
        title: data.title,
        slug: generateSlug(data.title),
        creator_names: data.creator_names || undefined,
        short_description: data.short_description || undefined,
        content: data.content,
        spotify_playlist_id: spotifyId || undefined,
        password: data.password || undefined,
        thumbnail_url: getPlaceholderThumbnail(), // Use utility function
        media_r2_keys: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // In a real app, we would save this to the database
      console.log('Created memory:', newMemory);
      
      // For now, we'll just show a success message and redirect
      alert('Memory created successfully!');
      router.push('/memories');
      
    } catch (error) {
      console.error('Error creating memory:', error);
      alert('Failed to create memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-vintage font-bold text-vintage-brown mb-6">
        Create a New Memory
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-vintage mb-2">
            Title <span className="text-vintage-red">*</span>
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-4 py-2 rounded border border-sepia-300 bg-white font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
            placeholder="Enter a title for your memory"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-vintage-red">{errors.title.message}</p>
          )}
        </div>
        
        {/* Creator Names */}
        <div>
          <label htmlFor="creator_names" className="block text-lg font-vintage mb-2">
            Creator Name(s)
          </label>
          <input
            id="creator_names"
            type="text"
            className="w-full px-4 py-2 rounded border border-sepia-300 bg-white font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
            placeholder="Who created this memory? (optional)"
            {...register('creator_names')}
          />
        </div>
        
        {/* Short Description */}
        <div>
          <label htmlFor="short_description" className="block text-lg font-vintage mb-2">
            Short Description
          </label>
          <textarea
            id="short_description"
            rows={3}
            className="w-full px-4 py-2 rounded border border-sepia-300 bg-white font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
            placeholder="Briefly describe this memory (optional)"
            {...register('short_description')}
          ></textarea>
          {errors.short_description && (
            <p className="mt-1 text-sm text-vintage-red">{errors.short_description.message}</p>
          )}
        </div>
        
        {/* Rich Text Editor */}
        <div>
          <label htmlFor="content" className="block text-lg font-vintage mb-2">
            Memory Content <span className="text-vintage-red">*</span>
          </label>
          <RichTextEditor
            content={editorContent}
            onChange={handleEditorChange}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-vintage-red">{errors.content.message}</p>
          )}
        </div>
        
        {/* Spotify Playlist */}
        <div>
          <label htmlFor="spotify_playlist_id" className="block text-lg font-vintage mb-2">
            Spotify Playlist URL or ID
          </label>
          <input
            id="spotify_playlist_id"
            type="text"
            className="w-full px-4 py-2 rounded border border-sepia-300 bg-white font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
            placeholder="Add a Spotify playlist (optional)"
            {...register('spotify_playlist_id')}
          />
        </div>
        
        {/* Password Protection */}
        <div>
          <label htmlFor="password" className="block text-lg font-vintage mb-2">
            Password Protection
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 rounded border border-sepia-300 bg-white font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-yellow"
            placeholder="Add a password to protect this memory (optional)"
            {...register('password')}
          />
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-vintage-teal hover:bg-opacity-90 text-white font-vintage py-3 px-6 rounded-lg shadow-vintage transition disabled:opacity-70"
          >
            {isSubmitting ? 'Creating Memory...' : 'Create Memory'}
          </button>
        </div>
      </form>
    </div>
  );
} 