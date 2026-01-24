"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1">
      <div className="text-center px-4">
        <AlertTriangle className="h-16 w-16 text-error mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 glass-button rounded-full hover:bg-white/15"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-full transition-smooth"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
