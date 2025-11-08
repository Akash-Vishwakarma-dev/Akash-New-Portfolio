import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../env";

/**
 * Cloudflare R2 Storage Client (S3-compatible)
 */
export class R2Storage {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY,
        secretAccessKey: env.R2_SECRET_KEY,
      },
    });
    this.bucket = env.R2_BUCKET;
    this.publicUrl = env.R2_PUBLIC_URL;
  }

  /**
   * Generate a presigned URL for uploading files
   * @param key - The object key (path) in R2
   * @param contentType - MIME type of the file
   * @param expiresIn - URL expiration time in seconds (default: 1 hour)
   */
  async getUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });
    const publicUrl = `${this.publicUrl}/${key}`;

    return { uploadUrl, publicUrl, key };
  }

  /**
   * Generate a presigned URL for downloading private files
   * @param key - The object key (path) in R2
   * @param expiresIn - URL expiration time in seconds (default: 1 hour)
   */
  async getDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Delete a file from R2
   * @param key - The object key (path) in R2
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  /**
   * Get the public URL for a file
   * @param key - The object key (path) in R2
   */
  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }

  /**
   * Generate a unique file key with timestamp and random string
   * @param folder - Folder path (e.g., "media", "resume")
   * @param originalName - Original filename
   */
  generateUniqueKey(folder: string, originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `${folder}/${timestamp}-${randomString}-${sanitizedName}`;
  }
}

/**
 * Singleton instance
 */
export const r2Storage = new R2Storage();

/**
 * Allowed file types for different categories
 */
export const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  documents: ["application/pdf"],
  animations: ["application/json"],
} as const;

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  animation: 1 * 1024 * 1024, // 1MB
} as const;

/**
 * R2 folder structure
 */
export const R2_FOLDERS = {
  MEDIA: "media",
  RESUME: "resume",
  ANIMATIONS: "animations",
  PROJECTS: "projects",
  BLOG: "blog",
  CERTIFICATIONS: "certifications",
} as const;

/**
 * Validate file upload request
 */
export function validateFileUpload(
  contentType: string,
  fileSize: number,
  category: keyof typeof ALLOWED_FILE_TYPES
): { valid: boolean; error?: string } {
  // Check content type
  const allowedTypes = ALLOWED_FILE_TYPES[category];
  if (!allowedTypes.includes(contentType as never)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // Check file size
  let maxSize: number;
  if (category === "images") maxSize = MAX_FILE_SIZES.image;
  else if (category === "documents") maxSize = MAX_FILE_SIZES.document;
  else if (category === "animations") maxSize = MAX_FILE_SIZES.animation;
  else maxSize = MAX_FILE_SIZES.image;

  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}
