"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "400px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.5rem" }}>System Error</h1>
          <p style={{ color: "#888", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            An unexpected error occurred.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{ padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{ padding: "0.75rem 1.5rem", background: "linear-gradient(to right, #6366f1, #9333ea)", borderRadius: "9999px", color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
