'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from '@/components/RichTextEditor';
import { extractSpotifyPlaylistId } from '@/lib/utils';
import styles from './editor.module.css'; // Import CSS module

// Form validation schema
const memoryFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  creator_names: z.string().optional(),
  short_description: z.string().max(250, 'Short description must be 250 characters or less').optional(),
  content: z.string().min(20, 'Memory content must be at least 20 characters long'), // Content comes from Tiptap as JSON string
  thumbnail_url: z.string().url('Please enter a valid URL for the thumbnail').optional().or(z.literal('')),
  spotify_playlist_id: z.string().optional(),
  password: z.string().min(4, 'Password must be at least 4 characters long').optional().or(z.literal('')),
  memory_date: z.string().optional().refine((date) => {
    if (!date || date === '') return true; // Allow empty or undefined
    return !isNaN(new Date(date).getTime()); // Check if it's a valid date string
  }, { message: "Please enter a valid date." }).or(z.literal('')),
});

type FormData = z.infer<typeof memoryFormSchema>;

export default function EditorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(memoryFormSchema),
    defaultValues: {
      title: '',
      creator_names: '',
      short_description: '',
      content: '', // Initial content for Tiptap can be empty string or valid JSON string
      thumbnail_url: '',
      spotify_playlist_id: '',
      password: '',
      memory_date: '', // Add default value for memory_date
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let spotifyId = data.spotify_playlist_id;
      if (spotifyId && spotifyId.trim() !== '') {
        const extractedId = extractSpotifyPlaylistId(spotifyId);
        // If extraction returns something, use it, otherwise, assume it might be an ID already or invalid
        spotifyId = extractedId || spotifyId;
      }

      // Content from Tiptap is already a JSON string via setValue in Controller
      const newMemoryPayload = {
        ...data,
        content: data.content, // Already a string
        thumbnail_url: data.thumbnail_url || undefined, // Send undefined if empty to Supabase
        spotify_playlist_id: spotifyId || undefined, // Send undefined if empty
        password: data.password || undefined, // Send undefined if empty
        memory_date: data.memory_date || null, // Send null if empty or undefined
      };

      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemoryPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save memory');
      }
      
      const savedMemory = await response.json();
      router.push(`/memories/${savedMemory.slug}`);

    } catch (error) {
      console.error('Error creating memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        Create a New Memory
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <div className={styles.formRow}>
          <label htmlFor="title" className={styles.label}>
            Title <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="title"
            type="text"
            className={styles.input}
            placeholder="A captivating title for your memory"
            {...register('title')}
          />
          {errors.title && <p className={styles.errorMessage}>{errors.title.message}</p>}
        </div>
        
        <div className={styles.formRow}>
          <label htmlFor="creator_names" className={styles.label}>
            Creator Name(s)
          </label>
          <input
            id="creator_names"
            type="text"
            className={styles.input}
            placeholder="E.g., Jane Doe, The Globetrotters (optional)"
            {...register('creator_names')}
          />
        </div>
        
        <div className={styles.formRow}>
          <label htmlFor="short_description" className={styles.label}>
            Short Description
          </label>
          <textarea
            id="short_description"
            rows={3} // This can be adjusted or controlled by CSS min-height
            className={styles.textarea}
            placeholder="A brief teaser or summary (optional, max 250 chars)"
            {...register('short_description')}
          ></textarea>
          {errors.short_description && <p className={styles.errorMessage}>{errors.short_description.message}</p>}
        </div>
        
        <div className={styles.formRow}>
          <label htmlFor="content" className={styles.label}>
            Memory Content <span className={styles.requiredAsterisk}>*</span>
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className={styles.richTextEditorWrapper}> {/* Added wrapper */} 
                <RichTextEditor
                  // Pass initial content as a string. Tiptap will parse it if it's JSON.
                  content={field.value || ''} 
                  onChange={(contentValue) => {
                    // Tiptap usually returns JSON or HTML. Ensure it's stringified for the form.
                    const stringValue = typeof contentValue === 'string' ? contentValue : JSON.stringify(contentValue);
                    setValue('content', stringValue, { shouldValidate: true });
                  }}
                  // Potentially pass a className here if RichTextEditor supports it for further internal styling
                />
              </div>
            )}
          />
          {errors.content && <p className={styles.errorMessage}>{errors.content.message}</p>}
        </div>
        
        <div className={styles.formRow}>
          <label htmlFor="thumbnail_url" className={styles.label}>
            Thumbnail Image URL
          </label>
          <input
            id="thumbnail_url"
            type="url"
            className={styles.input}
            placeholder="https://example.com/image.jpg (optional, direct URL)"
            {...register('thumbnail_url')}
          />
          {errors.thumbnail_url && <p className={styles.errorMessage}>{errors.thumbnail_url.message}</p>}
        </div>
        
        <div className={styles.formRow}>
          <label htmlFor="spotify_playlist_id" className={styles.label}>
            Spotify Playlist URL or ID
          </label>
          <input
            id="spotify_playlist_id"
            type="text"
            className={styles.input}
            placeholder="Paste a Spotify playlist link or ID (optional)"
            {...register('spotify_playlist_id')}
          />
        </div>
        
        <div className={styles.formRow}>
          <label htmlFor="password" className={styles.label}>
            Password Protection
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Leave blank if no password needed (min 4 chars)"
            {...register('password')}
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </div>

        {/* New Memory Date Field */}
        <div className={styles.formRow}>
          <label htmlFor="memory_date" className={styles.label}>
            Date of Memory (Optional)
          </label>
          <input
            id="memory_date"
            type="date"
            className={styles.input} 
            {...register('memory_date')}
          />
          {errors.memory_date && <p className={styles.errorMessage}>{errors.memory_date.message}</p>}
        </div>

        {submitError && (
          <div className={styles.submitErrorContainer}>
            <p>{submitError}</p>
          </div>
        )}
        
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create Memory'}
          </button>
        </div>
      </form>
    </div>
  );
} 