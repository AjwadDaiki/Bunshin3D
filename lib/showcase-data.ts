export type ShowcaseItem = {
  id: string;
  model_url: string;
  type: "standard" | "premium";
};

export const showcaseItems: ShowcaseItem[] = [
  // Premium
  { id: "poubelle", model_url: "/models/poubelle.glb", type: "premium" },
  { id: "shuriken", model_url: "/models/shuriken.glb", type: "premium" },
  { id: "robot", model_url: "/models/robot.glb", type: "premium" },
  { id: "coffre", model_url: "/models/coffre.glb", type: "premium" },
  // Standard
  { id: "chaise", model_url: "/models/chaise.glb", type: "standard" },
  { id: "hache", model_url: "/models/hache.glb", type: "standard" },
  { id: "tasse", model_url: "/models/tasse.glb", type: "standard" },
  { id: "lampe", model_url: "/models/lampe.glb", type: "standard" },
];
