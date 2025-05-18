'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import styles from './contribute-lore.module.css'; // We'll create this next

const loreSchema = z.object({
  content: z.string().min(10, { message: "Lore must be at least 10 characters long." }).max(1000, { message: "Lore must be 1000 characters or less." }),
});

type LoreFormData = z.infer<typeof loreSchema>;

export default function ContributeLorePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // To clear the form after submission
  } = useForm<LoreFormData>({
    resolver: zodResolver(loreSchema),
  });

  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoreFormData> = async (data) => {
    setSubmissionStatus('idle');
    setSubmissionMessage(null);
    try {
      const response = await fetch('/api/lores/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit lore.');
      }
      setSubmissionStatus('success');
      setSubmissionMessage('Lore submitted successfully! It will be reviewed soon.');
      reset(); // Clear the form
    } catch (error) {
      setSubmissionStatus('error');
      setSubmissionMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Contribute to Joe Bobby Lore</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>Your Lore:</label>
          <textarea
            id="content"
            {...register('content')}
            className={styles.textarea}
            rows={6}
            disabled={isSubmitting}
          />
          {errors.content && <p className={styles.errorMessage}>{errors.content.message}</p>}
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Lore'}
        </button>

        {submissionStatus === 'success' && submissionMessage && (
          <p className={styles.successMessage}>{submissionMessage}</p>
        )}
        {submissionStatus === 'error' && submissionMessage && (
          <p className={styles.errorMessageSubmit}>{submissionMessage}</p>
        )}
      </form>
    </div>
  );
} 