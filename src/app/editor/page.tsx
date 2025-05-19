'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from '@/components/RichTextEditor';
import { extractSpotifyId } from '@/lib/utils';
import styles from './editor.module.css'; // Import CSS module
import Image from 'next/image'; // For image preview

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
  
  // State for thumbnail upload
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedThumbnailFileName, setSelectedThumbnailFileName] = useState<string>("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch, // To watch the thumbnail_url for preview
  } = useForm<FormData>({
    resolver: zodResolver(memoryFormSchema),
    defaultValues: {
      title: '',
      creator_names: '',
      short_description: '',
      content: '',
      thumbnail_url: '',
      spotify_playlist_id: '',
      password: '',
      memory_date: '',
    },
  });

  const currentThumbnailUrl = watch('thumbnail_url'); // For preview

  const handleThumbnailFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedThumbnailFileName(file.name);
      setThumbnailUploadError(null);
      setIsUploadingThumbnail(true);
      // Show local preview immediately for better UX
      const localPreviewUrl = URL.createObjectURL(file);
      setThumbnailPreview(localPreviewUrl);
      setValue('thumbnail_url', ''); // Clear any manually entered URL first

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Thumbnail upload failed');
        }

        const result = await response.json();
        setValue('thumbnail_url', result.publicUrl, { shouldValidate: true });
        // The watch('thumbnail_url') will update the preview that uses currentThumbnailUrl
        // No need to call setThumbnailPreview(result.publicUrl) here if currentThumbnailUrl is used for final preview
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
        setThumbnailUploadError(message);
        setSelectedThumbnailFileName(""); // Clear filename on error
      } finally {
        setIsUploadingThumbnail(false);
        // If using local preview separate from currentThumbnailUrl, you might want to clear localPreviewUrl here
        // For now, currentThumbnailUrl (from watch) will be the source of truth for the final preview.
        if (localPreviewUrl && thumbnailPreview === localPreviewUrl) {
             // If the preview is still the local one (e.g. upload failed and didn't set a new currentThumbnailUrl)
             // we might want to clear it, or let the error message suffice.
             // For now, let error message suffice. User can re-try or clear file input.
        }
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let spotifyId = data.spotify_playlist_id;
      if (spotifyId && spotifyId.trim() !== '') {
        const extractedId = extractSpotifyId(spotifyId);
        spotifyId = extractedId || spotifyId;
      }

      const newMemoryPayload = {
        ...data,
        thumbnail_url: data.thumbnail_url || undefined,
        spotify_playlist_id: spotifyId || undefined,
        password: data.password || undefined,
        memory_date: data.memory_date || null,
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
            rows={3}
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
              <div className={styles.richTextEditorWrapper}>
                <RichTextEditor
                  content={field.value || ''}
                  onChange={(contentValue) => {
                    const stringValue = typeof contentValue === 'string' ? contentValue : JSON.stringify(contentValue);
                    setValue('content', stringValue, { shouldValidate: true });
                  }}
                />
              </div>
            )}
          />
          {errors.content && <p className={styles.errorMessage}>{errors.content.message}</p>}
        </div>

        {/* Thumbnail Upload Field */}
        <div className={styles.formRow}>
          <label className={styles.label}>
            Upload Thumbnail Image (Optional)
          </label>
          <div className={styles.fileInputContainer}>
            <label htmlFor="thumbnailFile" className={`${styles.fileUploadButton} ${isUploadingThumbnail ? styles.disabledButton : ''}`}>
              Choose File
            </label>
            <input
              id="thumbnailFile"
              type="file"
              accept="image/*"
              className={styles.hiddenFileInput}
              onChange={handleThumbnailFileChange}
              disabled={isUploadingThumbnail}
            />
            {selectedThumbnailFileName && !isUploadingThumbnail && (
              <span className={styles.fileNameDisplay}>{selectedThumbnailFileName}</span>
            )}
            {isUploadingThumbnail && <p className={styles.uploadStatus}>Uploading: {selectedThumbnailFileName}...</p>}
          </div>
          {thumbnailUploadError && <p className={styles.errorMessage}>{thumbnailUploadError}</p>}
        </div>

        {/* Direct Thumbnail URL Input Field */}
        <div className={styles.formRow}>
          <label htmlFor="thumbnail_url_direct" className={styles.label}>
            Or Paste Thumbnail Image URL (Optional)
          </label>
          <input
            id="thumbnail_url_direct"
            type="url"
            className={styles.input}
            placeholder="https://example.com/image.jpg"
            {...register('thumbnail_url')} // This registers the same field
            disabled={isUploadingThumbnail} // Disable if an upload is in progress
          />
          {errors.thumbnail_url && (
            <p className={styles.errorMessage}>{errors.thumbnail_url.message}</p>
          )}
        </div>
        
        {/* Preview of current thumbnail - uses currentThumbnailUrl which is watched */}
        {currentThumbnailUrl && (
          <div className={styles.thumbnailPreviewContainer}>
            <p className={styles.previewLabel}>Current Thumbnail Preview:</p>
            <Image src={currentThumbnailUrl} alt="Thumbnail preview" width={150} height={100} style={{ objectFit: 'cover' }} />
          </div>
        )}
        
        <div className={styles.formRow}>
          <label htmlFor="spotify_playlist_id" className={styles.label}>
            Spotify Playlist/Track URL or ID
          </label>
          <input
            id="spotify_playlist_id"
            type="text"
            className={styles.input}
            placeholder="Paste a Spotify playlist/track link or ID (optional)"
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
            disabled={isSubmitting || isUploadingThumbnail}
          >
            {isSubmitting ? 'Submitting Memory...' : (isUploadingThumbnail ? 'Processing Thumbnail...' : 'Create Memory')}
          </button>
        </div>
      </form>
    </div>
  );
} 