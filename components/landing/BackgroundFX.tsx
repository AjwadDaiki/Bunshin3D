"use client";

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Vignette only */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
