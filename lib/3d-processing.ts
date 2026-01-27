import { WebIO } from "@gltf-transform/core";
import { simplify } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";

// Optimisation du maillage (Low Poly)
export async function convertToLowPoly(glbUrl: string): Promise<Blob> {
  const response = await fetch(glbUrl);
  const arrayBuffer = await response.arrayBuffer();

  const io = new WebIO();
  const document = await io.readBinary(new Uint8Array(arrayBuffer));

  await document.transform(
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.001 }),
  );

  const glbBytes = await io.writeBinary(document);
  return new Blob([glbBytes], { type: "model/gltf-binary" });
}

// Conversion STL (Impression 3D)
export async function convertToSTL(glbUrl: string): Promise<Blob> {
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
        const stlString = exporter.parse(gltf.scene, { binary: true });
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

// Conversion OBJ (Standard Universel - Remplace FBX)
export async function convertToOBJ(glbUrl: string): Promise<Blob> {
  const [{ GLTFLoader }, { OBJExporter }] = await Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/exporters/OBJExporter.js"),
  ]);

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      (gltf) => {
        const exporter = new OBJExporter();
        const objString = exporter.parse(gltf.scene);
        const blob = new Blob([objString], { type: "text/plain" });
        resolve(blob);
      },
      undefined,
      (error) => reject(error),
    );
  });
}

// Conversion USDZ (Apple AR / "Premium")
export async function convertToUSDZ(glbUrl: string): Promise<Blob> {
  const [{ GLTFLoader }, { USDZExporter }] = await Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/exporters/USDZExporter.js"),
  ]);

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      async (gltf) => {
        const exporter = new USDZExporter();
        // @ts-ignore - USDZExporter types are sometimes missing in older definitions
        const usdzArray = await exporter.parse(gltf.scene);
        const blob = new Blob([usdzArray], {
          type: "application/octet-stream",
        });
        resolve(blob);
      },
      undefined,
      (error) => reject(error),
    );
  });
}

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
