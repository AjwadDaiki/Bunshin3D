import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 client (S3-compatible)
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Upload a GLB file to Cloudflare R2
 * Downloads from source URL (Replicate) and uploads to R2
 */
export async function uploadModelToR2(
  sourceUrl: string,
  userId: string,
  predictionId: string
): Promise<UploadResult> {
  try {
    console.log(`📥 Downloading model from: ${sourceUrl.substring(0, 80)}...`);

    // Download the GLB file from Replicate
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to download model: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "model/gltf-binary";

    // Generate unique key for R2
    const timestamp = Date.now();
    const key = `models/${userId}/${predictionId}-${timestamp}.glb`;

    console.log(`📤 Uploading to R2: ${key}`);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Construct public URL
    // R2 public URL format: https://{bucket}.{account-id}.r2.cloudflarestorage.com/{key}
    // Or custom domain if configured
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${key}`
      : `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${key}`;

    console.log(`✅ Model uploaded to R2: ${publicUrl}`);

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error: any) {
    console.error("❌ R2 upload error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate a signed URL for temporary access (if bucket is private)
 */
export async function getSignedModelUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Check if R2 is properly configured
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}
