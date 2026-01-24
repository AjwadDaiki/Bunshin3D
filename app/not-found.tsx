import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1">
      <div className="text-center px-4">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-brand-primary/20 blur-3xl"></div>
          <h1 className="relative text-9xl font-bold text-gradient-brand">
            404
          </h1>
        </div>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for has drifted into another dimension.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-secondary rounded-full transition-smooth"
        >
          <Sparkles className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
