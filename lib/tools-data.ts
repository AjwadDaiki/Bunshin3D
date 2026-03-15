export type ToolSlug = "image-to-stl" | "png-to-3d" | "logo-to-3d" | "photo-to-3d-print";

export const TOOL_SLUGS: ToolSlug[] = [
  "image-to-stl",
  "png-to-3d",
  "logo-to-3d",
  "photo-to-3d-print",
];

export interface ToolData {
  slug: ToolSlug;
  outputFormat: string;
  relatedSlugs: ToolSlug[];
}

export const TOOLS_DATA: Record<ToolSlug, ToolData> = {
  "image-to-stl": {
    slug: "image-to-stl",
    outputFormat: "STL",
    relatedSlugs: ["png-to-3d", "photo-to-3d-print"],
  },
  "png-to-3d": {
    slug: "png-to-3d",
    outputFormat: "GLB/STL",
    relatedSlugs: ["image-to-stl", "logo-to-3d"],
  },
  "logo-to-3d": {
    slug: "logo-to-3d",
    outputFormat: "STL/GLB",
    relatedSlugs: ["image-to-stl", "png-to-3d"],
  },
  "photo-to-3d-print": {
    slug: "photo-to-3d-print",
    outputFormat: "STL",
    relatedSlugs: ["image-to-stl", "png-to-3d"],
  },
};
