"use client";

import Script from "next/script";

export default function ModelViewerScript() {
  return (
    <Script
      type="module"
      src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
