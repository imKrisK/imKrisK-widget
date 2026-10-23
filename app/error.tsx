'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error tracking service (e.g., Sentry)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>Oops! Something went wrong</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#c99a7f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1em',
        }}
      >
        Try again
      </button>
      {error.digest && (
        <p style={{ fontSize: '0.8em', color: '#999', marginTop: '20px' }}>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
