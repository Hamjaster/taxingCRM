# Avatar Upload Component

## Overview

The `AvatarUpload` component allows users to upload profile images during client creation or editing. It uses Cloudinary for image storage and optimization.

## How It Works

### 1. During Client Creation

- User selects an image file
- Image is uploaded to Cloudinary via `/api/upload/image`
- Returns a public URL with automatic optimization
- URL is stored in the form data
- When client is created, the URL is saved to the `avatar` field

### 2. During Client Editing

- Uses the existing `/api/clients/avatar` endpoint
- Requires client ID for existing clients
- Updates the client record directly
- Automatically deletes old images from Cloudinary

## API Endpoints

### `/api/upload/image`

- **Purpose**: General image uploads (for new clients)
- **Method**: POST
- **Body**: FormData with `image` field
- **Response**: `{ success: true, data: { url: string, public_id: string, ... } }`
- **Access**: Admin only
- **Storage**: Cloudinary with automatic optimization

### `/api/clients/avatar`

- **Purpose**: Update avatars for existing clients
- **Method**: POST/DELETE
- **Body**: FormData with `file` and `clientId` fields
- **Response**: Updated client object
- **Access**: Admin only
- **Storage**: Cloudinary with automatic cleanup

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
- **Storage**: Cloudinary with automatic optimization

## Cloudinary Configuration

### Environment Variables Required

```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Storage Structure

```
Cloudinary/
├── taxingcrm/
│   ├── client-profiles/          # For new client creation
│   │   └── {auto-generated-id}
│   └── clients/
│       └── {clientId}/
│           └── avatars/          # For existing client updates
│               └── {auto-generated-id}
```

### Image Transformations

- **Size**: 400x400 pixels
- **Crop**: Fill with face detection
- **Quality**: Auto-optimized
- **Format**: Auto (WebP when supported)
