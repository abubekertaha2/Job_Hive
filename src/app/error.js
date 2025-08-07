'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error caught in error.js:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h2 className="text-red-600 text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4">{error?.message || 'Unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
