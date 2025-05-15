import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <h2 className="text-3xl font-vintage font-bold text-vintage-brown mb-4">
        Memory Not Found
      </h2>
      <p className="text-ink/80 mb-8">
        Sorry, we couldn&apos;t find the memory you were looking for. It might have been removed or never existed.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <Link
          href="/memories"
          className="bg-sepia-700 hover:bg-sepia-800 text-white font-vintage py-2 px-4 rounded shadow-vintage transition"
        >
          View All Memories
        </Link>
        <Link
          href="/"
          className="text-vintage-blue hover:underline font-typewriter"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
} 