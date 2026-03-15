export type AudienceSlug =
  | "game-developers"
  | "3d-printing"
  | "graphic-designers"
  | "architects"
  | "ecommerce"
  | "educators";

export const AUDIENCE_SLUGS: AudienceSlug[] = [
  "game-developers",
  "3d-printing",
  "graphic-designers",
  "architects",
  "ecommerce",
  "educators",
];

export interface AudienceData {
  slug: AudienceSlug;
  formats: string[];
  relatedSlugs: AudienceSlug[];
}

export const AUDIENCE_DATA: Record<AudienceSlug, AudienceData> = {
  "game-developers": {
    slug: "game-developers",
    formats: ["GLB", "FBX", "OBJ"],
    relatedSlugs: ["graphic-designers", "ecommerce"],
  },
  "3d-printing": {
    slug: "3d-printing",
    formats: ["STL", "OBJ"],
    relatedSlugs: ["graphic-designers", "educators"],
  },
  "graphic-designers": {
    slug: "graphic-designers",
    formats: ["GLB", "OBJ", "STL"],
    relatedSlugs: ["ecommerce", "3d-printing"],
  },
  architects: {
    slug: "architects",
    formats: ["GLB", "OBJ", "STL"],
    relatedSlugs: ["graphic-designers", "3d-printing"],
  },
  ecommerce: {
    slug: "ecommerce",
    formats: ["GLB", "GLTF"],
    relatedSlugs: ["graphic-designers", "game-developers"],
  },
  educators: {
    slug: "educators",
    formats: ["STL", "GLB"],
    relatedSlugs: ["3d-printing", "architects"],
  },
};
