import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from 'process';
import * as Minio from 'minio'
// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'taxing-crm-documents';

// export const s3ClientMinio = new Minio.Client({
//   endPoint: env.S3_ENDPOINT,
//   accessKey: process.env.AWS_ACCESS_KEY_ID,
//   secretKey: process.env.AWS_SECRET_ACCESS_KEY,
//   useSSL: env.S3_USE_SSL === 'true',
// })

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  etag?: string;
  versionId?: string;
}

export interface UploadOptions {
  clientId: string;
  folderId: string;
  originalName: string;
  contentType: string;
  buffer: Buffer;
  isPublic?: boolean;
}

/**
 * Upload a file to S3
 */
export async function uploadFileToS3(options: UploadOptions): Promise<UploadResult> {
  const { clientId, folderId, originalName, contentType, buffer, isPublic = false } = options;
  
  // Generate unique key for the file
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = originalName.split('.').pop() || '';
  const key = `clients/${clientId}/folders/${folderId}/${timestamp}-${randomString}.${fileExtension}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: isPublic ? 'public-read' : 'private',
    Metadata: {
      originalName,
      clientId,
      folderId,
      uploadTimestamp: timestamp.toString(),
    },
  });

  try {
    const response = await s3Client.send(command);
    
    const url = isPublic 
      ? `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
      : await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }), { expiresIn: 3600 });

    return {
      key,
      url,
      bucket: BUCKET_NAME,
      etag: response.ETag,
      versionId: response.VersionId,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
}

/**
 * Generate a presigned URL for downloading a file
 */
export async function getDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Get file info from S3 (without downloading)
 */
export async function getFileInfo(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const response = await s3Client.send(command);
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      etag: response.ETag,
      metadata: response.Metadata,
    };
  } catch (error) {
    console.error('Error getting file info from S3:', error);
    throw new Error('Failed to get file info from S3');
  }
}

/**
 * Generate a presigned URL for uploading directly from frontend
 */
export async function generatePresignedUploadUrl(
  clientId: string,
  folderId: string,
  fileName: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<{ uploadUrl: string; key: string }> {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = fileName.split('.').pop() || '';
  const key = `clients/${clientId}/folders/${folderId}/${timestamp}-${randomString}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    Metadata: {
      originalName: fileName,
      clientId,
      folderId,
      uploadTimestamp: timestamp.toString(),
    },
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return { uploadUrl, key };
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: { originalname: string; size: number; mimetype: string }) {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/webp',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (file.size > maxSize) {
    throw new Error('File size exceeds 50MB limit');
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('File type not allowed. Allowed types: PDF, DOC, DOCX, TXT, Images, XLS, XLSX');
  }

  return true;
}

/**
 * Get file type from extension
 */
export function getFileTypeFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf'].includes(extension)) return 'pdf';
  if (['doc', 'docx'].includes(extension)) return 'doc';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) return 'image';
  if (['txt'].includes(extension)) return 'txt';
  if (['xlsx', 'xls'].includes(extension)) return 'xlsx';
  
  return 'other';
}

export { s3Client, BUCKET_NAME };
