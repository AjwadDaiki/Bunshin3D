import { WebIO } from "@gltf-transform/core";
import { simplify } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";

/**
 * 🎮 MODE LOW POLY
 * Réduit le nombre de polygones de 50% avec glTF-Transform & Meshopt
 */
export async function convertToLowPoly(glbUrl: string): Promise<Blob> {
  // 1. Fetch le GLB original
  const response = await fetch(glbUrl);
  const arrayBuffer = await response.arrayBuffer();

  // 2. Initialisation IO
  const io = new WebIO();

  // 3. Charger le document
  const document = await io.readBinary(new Uint8Array(arrayBuffer));

  // 4. Appliquer la simplification (Ratio 0.5 = 50% des triangles originaux)
  await document.transform(
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.001 }),
  );

  // 5. Exporter en binaire
  const glbBytes = await io.writeBinary(document);
  return new Blob([glbBytes], { type: "model/gltf-binary" });
}

/**
 * 🖨️ MODE PRINT (STL)
 * Convertit le GLB en STL binaire pour l'impression 3D via Three.js
 * Utilise dynamic import pour éviter le conflit avec model-viewer
 */
export async function convertToSTL(glbUrl: string): Promise<Blob> {
  // Dynamic import de Three.js uniquement quand nécessaire
  const [{ GLTFLoader }, { STLExporter }] = await Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/exporters/STLExporter.js"),
  ]);

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      glbUrl,
      (gltf) => {
        const exporter = new STLExporter();
        // Option binary: true est cruciale pour l'impression 3D (fichier plus léger)
        const stlString = exporter.parse(gltf.scene, { binary: true });

        // STLExporter avec binary:true retourne un DataView ou Uint8Array
        const blob = new Blob([stlString], {
          type: "application/octet-stream",
        });
        resolve(blob);
      },
      undefined,
      (error) => reject(error),
    );
  });
}

/**
 * UTILITY: Déclenche le téléchargement navigateur
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
