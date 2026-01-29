import { WebIO } from "@gltf-transform/core";
import { simplify } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";
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
        const stlResult = exporter.parse(gltf.scene, { binary: true });

        const blob = new Blob([stlResult as any], {
          type: "application/octet-stream",
        });
        resolve(blob);
      },
      undefined,
      (error) => reject(error),
    );
  });
}

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

export async function convertToUSDZ(glbUrl: string): Promise<Blob> {
  const [{ GLTFLoader }, { USDZExporter }] = await Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/exporters/USDZExporter.js"),
  ]);

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      (gltf) => {
        try {
          const exporter = new USDZExporter();
          exporter.parse(
            gltf.scene,
            (result) => {
              const blob = new Blob([result as any], {
                type: "application/octet-stream",
              });
              resolve(blob);
            },
            (error) => {
              console.error(error);
              reject(error);
            },
            { quickLookCompatible: true },
          );
        } catch (err) {
          reject(err);
        }
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
