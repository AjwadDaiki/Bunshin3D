export interface GalleryItem {
  id: string;
  category: "logos" | "characters" | "objects" | "drawings" | "photos";
  inputImage: string;
  modelPath: string;
}

// These reference public sample images in /public/gallery/
// You'll need to add actual before/after images to /public/gallery/
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "sci-fi-helmet", category: "characters", inputImage: "/gallery/helmet-input.webp", modelPath: "/gallery/helmet.glb" },
  { id: "ceramic-vase", category: "objects", inputImage: "/gallery/vase-input.webp", modelPath: "/gallery/vase.glb" },
  { id: "stylized-hero", category: "characters", inputImage: "/gallery/hero-input.webp", modelPath: "/gallery/hero.glb" },
  { id: "mech-part", category: "objects", inputImage: "/gallery/mech-input.webp", modelPath: "/gallery/mech.glb" },
  { id: "brand-logo", category: "logos", inputImage: "/gallery/logo-input.webp", modelPath: "/gallery/logo.glb" },
  { id: "child-drawing", category: "drawings", inputImage: "/gallery/drawing-input.webp", modelPath: "/gallery/drawing.glb" },
];

export const GALLERY_CATEGORIES = ["logos", "characters", "objects", "drawings", "photos"] as const;
