"use client";

import NotFoundHero from "@/components/ui/NotFoundHero";

export default function GlobalNotFound() {
  return (
    <html>
      <body className="bg-[#0a0a0f] text-white m-0 p-0">
        <NotFoundHero
          title="Page Not Found"
          description="The page you're looking for has drifted into another dimension."
          action="Back to Home"
        />
      </body>
    </html>
  );
}
