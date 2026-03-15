export type CompareSlug =
  | "meshy-alternative"
  | "kaedim-alternative"
  | "luma-ai-alternative"
  | "tripo-ai-alternative"
  | "alpha3d-alternative"
  | "3d-ai-studio-alternative"
  | "csm-ai-alternative"
  | "best-ai-3d-generators";

export const COMPARE_SLUGS: CompareSlug[] = [
  "meshy-alternative",
  "kaedim-alternative",
  "luma-ai-alternative",
  "tripo-ai-alternative",
  "alpha3d-alternative",
  "3d-ai-studio-alternative",
  "csm-ai-alternative",
  "best-ai-3d-generators",
];

export interface CompareData {
  slug: CompareSlug;
  competitorName: string;
  relatedSlugs: CompareSlug[];
}

export const COMPARE_DATA: Record<CompareSlug, CompareData> = {
  "meshy-alternative": {
    slug: "meshy-alternative",
    competitorName: "Meshy",
    relatedSlugs: ["tripo-ai-alternative", "alpha3d-alternative", "best-ai-3d-generators"],
  },
  "kaedim-alternative": {
    slug: "kaedim-alternative",
    competitorName: "Kaedim",
    relatedSlugs: ["meshy-alternative", "csm-ai-alternative", "best-ai-3d-generators"],
  },
  "luma-ai-alternative": {
    slug: "luma-ai-alternative",
    competitorName: "Luma AI",
    relatedSlugs: ["meshy-alternative", "tripo-ai-alternative", "best-ai-3d-generators"],
  },
  "tripo-ai-alternative": {
    slug: "tripo-ai-alternative",
    competitorName: "Tripo AI",
    relatedSlugs: ["meshy-alternative", "luma-ai-alternative", "best-ai-3d-generators"],
  },
  "alpha3d-alternative": {
    slug: "alpha3d-alternative",
    competitorName: "Alpha3D",
    relatedSlugs: ["meshy-alternative", "kaedim-alternative", "best-ai-3d-generators"],
  },
  "3d-ai-studio-alternative": {
    slug: "3d-ai-studio-alternative",
    competitorName: "3D AI Studio",
    relatedSlugs: ["meshy-alternative", "alpha3d-alternative", "best-ai-3d-generators"],
  },
  "csm-ai-alternative": {
    slug: "csm-ai-alternative",
    competitorName: "CSM AI",
    relatedSlugs: ["kaedim-alternative", "luma-ai-alternative", "best-ai-3d-generators"],
  },
  "best-ai-3d-generators": {
    slug: "best-ai-3d-generators",
    competitorName: "",
    relatedSlugs: ["meshy-alternative", "luma-ai-alternative", "tripo-ai-alternative"],
  },
};
