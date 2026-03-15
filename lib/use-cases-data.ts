export type UseCaseSlug =
  | "convert-logo-to-stl-for-3d-printing"
  | "create-unity-assets-from-photos"
  | "turn-child-drawing-into-3d-object"
  | "convert-2d-image-to-blender-obj"
  | "generate-architecture-3d-model-from-blueprint"
  | "ai-image-to-3d-model-free"
  | "photo-to-3d-print-converter"
  | "2d-drawing-to-3d-model-ai"
  | "logo-3d-printing-service"
  | "game-asset-generator-ai"
  | "free-stl-file-generator"
  | "convert-png-to-stl-online"
  | "ai-3d-model-generator-from-image"
  | "turn-picture-into-3d-model"
  | "image-to-glb-converter";

export interface UseCaseData {
  slug: UseCaseSlug;
  icon: string;
  relatedSlugs: UseCaseSlug[];
  formats: string[];
  audience: string;
}

export const USE_CASE_SLUGS: UseCaseSlug[] = [
  "convert-logo-to-stl-for-3d-printing",
  "create-unity-assets-from-photos",
  "turn-child-drawing-into-3d-object",
  "convert-2d-image-to-blender-obj",
  "generate-architecture-3d-model-from-blueprint",
  "ai-image-to-3d-model-free",
  "photo-to-3d-print-converter",
  "2d-drawing-to-3d-model-ai",
  "logo-3d-printing-service",
  "game-asset-generator-ai",
  "free-stl-file-generator",
  "convert-png-to-stl-online",
  "ai-3d-model-generator-from-image",
  "turn-picture-into-3d-model",
  "image-to-glb-converter",
];

export const USE_CASES_DATA: Record<UseCaseSlug, UseCaseData> = {
  "convert-logo-to-stl-for-3d-printing": {
    slug: "convert-logo-to-stl-for-3d-printing",
    icon: "Diamond",
    relatedSlugs: [
      "free-stl-file-generator",
      "convert-png-to-stl-online",
      "logo-3d-printing-service",
      "photo-to-3d-print-converter",
    ],
    formats: ["STL", "OBJ"],
    audience: "designers",
  },
  "create-unity-assets-from-photos": {
    slug: "create-unity-assets-from-photos",
    icon: "GameController",
    relatedSlugs: [
      "game-asset-generator-ai",
      "image-to-glb-converter",
      "ai-3d-model-generator-from-image",
      "turn-picture-into-3d-model",
    ],
    formats: ["GLB", "FBX", "OBJ"],
    audience: "game-developers",
  },
  "turn-child-drawing-into-3d-object": {
    slug: "turn-child-drawing-into-3d-object",
    icon: "PencilLine",
    relatedSlugs: [
      "2d-drawing-to-3d-model-ai",
      "photo-to-3d-print-converter",
      "free-stl-file-generator",
      "turn-picture-into-3d-model",
    ],
    formats: ["STL", "GLB"],
    audience: "parents",
  },
  "convert-2d-image-to-blender-obj": {
    slug: "convert-2d-image-to-blender-obj",
    icon: "Cube",
    relatedSlugs: [
      "ai-image-to-3d-model-free",
      "ai-3d-model-generator-from-image",
      "turn-picture-into-3d-model",
      "image-to-glb-converter",
    ],
    formats: ["OBJ", "GLB", "FBX"],
    audience: "3d-artists",
  },
  "generate-architecture-3d-model-from-blueprint": {
    slug: "generate-architecture-3d-model-from-blueprint",
    icon: "Buildings",
    relatedSlugs: [
      "ai-image-to-3d-model-free",
      "convert-2d-image-to-blender-obj",
      "2d-drawing-to-3d-model-ai",
      "ai-3d-model-generator-from-image",
    ],
    formats: ["GLB", "OBJ", "STL"],
    audience: "architects",
  },
  "ai-image-to-3d-model-free": {
    slug: "ai-image-to-3d-model-free",
    icon: "Sparkle",
    relatedSlugs: [
      "ai-3d-model-generator-from-image",
      "turn-picture-into-3d-model",
      "photo-to-3d-print-converter",
      "free-stl-file-generator",
    ],
    formats: ["GLB", "STL", "OBJ", "FBX"],
    audience: "everyone",
  },
  "photo-to-3d-print-converter": {
    slug: "photo-to-3d-print-converter",
    icon: "Printer",
    relatedSlugs: [
      "convert-png-to-stl-online",
      "free-stl-file-generator",
      "turn-picture-into-3d-model",
      "convert-logo-to-stl-for-3d-printing",
    ],
    formats: ["STL", "OBJ"],
    audience: "3d-printing",
  },
  "2d-drawing-to-3d-model-ai": {
    slug: "2d-drawing-to-3d-model-ai",
    icon: "PencilSimple",
    relatedSlugs: [
      "turn-child-drawing-into-3d-object",
      "ai-image-to-3d-model-free",
      "convert-2d-image-to-blender-obj",
      "ai-3d-model-generator-from-image",
    ],
    formats: ["GLB", "STL", "OBJ"],
    audience: "artists",
  },
  "logo-3d-printing-service": {
    slug: "logo-3d-printing-service",
    icon: "Stamp",
    relatedSlugs: [
      "convert-logo-to-stl-for-3d-printing",
      "free-stl-file-generator",
      "convert-png-to-stl-online",
      "photo-to-3d-print-converter",
    ],
    formats: ["STL", "OBJ"],
    audience: "businesses",
  },
  "game-asset-generator-ai": {
    slug: "game-asset-generator-ai",
    icon: "Sword",
    relatedSlugs: [
      "create-unity-assets-from-photos",
      "image-to-glb-converter",
      "ai-3d-model-generator-from-image",
      "ai-image-to-3d-model-free",
    ],
    formats: ["GLB", "FBX", "OBJ"],
    audience: "game-developers",
  },
  "free-stl-file-generator": {
    slug: "free-stl-file-generator",
    icon: "FileDashed",
    relatedSlugs: [
      "convert-png-to-stl-online",
      "photo-to-3d-print-converter",
      "convert-logo-to-stl-for-3d-printing",
      "ai-image-to-3d-model-free",
    ],
    formats: ["STL"],
    audience: "3d-printing",
  },
  "convert-png-to-stl-online": {
    slug: "convert-png-to-stl-online",
    icon: "FileArrowUp",
    relatedSlugs: [
      "free-stl-file-generator",
      "convert-logo-to-stl-for-3d-printing",
      "photo-to-3d-print-converter",
      "ai-image-to-3d-model-free",
    ],
    formats: ["STL"],
    audience: "3d-printing",
  },
  "ai-3d-model-generator-from-image": {
    slug: "ai-3d-model-generator-from-image",
    icon: "Brain",
    relatedSlugs: [
      "ai-image-to-3d-model-free",
      "turn-picture-into-3d-model",
      "create-unity-assets-from-photos",
      "image-to-glb-converter",
    ],
    formats: ["GLB", "STL", "OBJ", "FBX"],
    audience: "everyone",
  },
  "turn-picture-into-3d-model": {
    slug: "turn-picture-into-3d-model",
    icon: "Image",
    relatedSlugs: [
      "ai-3d-model-generator-from-image",
      "photo-to-3d-print-converter",
      "ai-image-to-3d-model-free",
      "image-to-glb-converter",
    ],
    formats: ["GLB", "STL", "OBJ"],
    audience: "everyone",
  },
  "image-to-glb-converter": {
    slug: "image-to-glb-converter",
    icon: "Globe",
    relatedSlugs: [
      "create-unity-assets-from-photos",
      "game-asset-generator-ai",
      "ai-3d-model-generator-from-image",
      "turn-picture-into-3d-model",
    ],
    formats: ["GLB", "GLTF"],
    audience: "game-developers",
  },
};
