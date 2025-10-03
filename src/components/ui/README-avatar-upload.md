# Avatar Upload Component

## Overview

The `AvatarUpload` component allows users to upload profile images during client creation or editing. It uses a general image upload API that doesn't require a client ID upfront.

## How It Works

### 1. During Client Creation

- User selects an image file
- Image is uploaded to AWS S3 via `/api/upload/image`
- Returns a public URL
- URL is stored in the form data
- When client is created, the URL is saved to the `avatar` field

### 2. During Client Editing

- Uses the existing `/api/clients/avatar` endpoint
- Requires client ID for existing clients
- Updates the client record directly

## API Endpoints

### `/api/upload/image` (New)

- **Purpose**: General image uploads (for new clients)
- **Method**: POST
- **Body**: FormData with `file` and `type` fields
- **Response**: `{ url: string, key: string, message: string }`
- **Access**: Admin only

### `/api/clients/avatar` (Existing)

- **Purpose**: Update avatars for existing clients
- **Method**: POST/DELETE
- **Body**: FormData with `file` and `clientId` fields
- **Response**: Updated client object
- **Access**: Admin only

## Usage

```tsx
<AvatarUpload
  currentAvatar={formData.profileImage}
  onAvatarChange={(avatarUrl) => updateFormData("profileImage", avatarUrl)}
  size="md"
  showRemoveButton={true}
/>
```

## File Validation

- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Max Size**: 5MB
- **Storage**: AWS S3 with public access

## Storage Structure

```
S3 Bucket/
├── clients/
│   ├── temp-{timestamp}-{random}/
│   │   └── avatars/
│   │       └── {timestamp}-{random}.{ext}
│   └── {clientId}/
│       └── avatars/
│           └── {timestamp}-{random}.{ext}
```
