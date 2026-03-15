export type FormatSlug = "stl" | "glb" | "obj" | "fbx" | "gltf" | "3d-printing";

export interface FormatData {
  slug: FormatSlug;
  extension: string;
  relatedSlugs: FormatSlug[];
}

export const FORMAT_SLUGS: FormatSlug[] = ["stl", "glb", "obj", "fbx", "gltf", "3d-printing"];

export const FORMATS_DATA: Record<FormatSlug, FormatData> = {
  stl: {
    slug: "stl",
    extension: ".stl",
    relatedSlugs: ["obj", "3d-printing", "glb"],
  },
  glb: {
    slug: "glb",
    extension: ".glb",
    relatedSlugs: ["gltf", "fbx", "obj"],
  },
  obj: {
    slug: "obj",
    extension: ".obj",
    relatedSlugs: ["stl", "fbx", "glb"],
  },
  fbx: {
    slug: "fbx",
    extension: ".fbx",
    relatedSlugs: ["glb", "obj", "gltf"],
  },
  gltf: {
    slug: "gltf",
    extension: ".gltf",
    relatedSlugs: ["glb", "obj", "fbx"],
  },
  "3d-printing": {
    slug: "3d-printing",
    extension: ".stl",
    relatedSlugs: ["stl", "obj", "glb"],
  },
};
