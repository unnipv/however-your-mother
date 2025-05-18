import Link from 'next/link';
import styles from './not-found.module.css'; // Import CSS module

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Memory Not Found
      </h2>
      <p className={styles.message}>
        Sorry, we couldn&apos;t find the memory you were looking for. It might have been removed or never existed.
      </p>
      <div className={styles.actionsContainer}>
        <Link
          href="/memories"
          className={styles.primaryLink}
        >
          View All Memories
        </Link>
        <Link
          href="/"
          className={styles.secondaryLink}
        >
          Go back home
        </Link>
      </div>
    </div>
  );
} 