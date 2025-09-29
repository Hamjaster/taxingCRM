# CORS Setup for TaxingCRM Backend

This document explains how CORS (Cross-Origin Resource Sharing) has been configured for your TaxingCRM backend to allow other applications to access your APIs.

## What is CORS?

CORS is a security feature implemented by web browsers that blocks requests from one domain to another unless the server explicitly allows it. This is important when you want to use your backend APIs from different applications or websites.

## Configuration Overview

The CORS setup includes three main components:

### 1. Global CORS Headers (`next.config.ts`)

- Automatically adds CORS headers to all API routes
- Configures allowed methods, headers, and origins
- Different settings for development vs production

### 2. Middleware (`src/middleware.ts`)

- Handles preflight OPTIONS requests
- Adds CORS headers to all API responses
- Manages origin validation

### 3. CORS Utility (`src/lib/cors.ts`)

- Provides helper functions for manual CORS handling
- Allows fine-grained control over CORS settings
- Includes a `withCors` wrapper for individual API routes

## Configuration Details

### Allowed Origins

Currently configured to allow:

- `http://localhost:3000` (development)
- `http://localhost:3001` (development)
- `http://localhost:8080` (development)
- `https://yourdomain.com` (production - **UPDATE THIS**)

### Allowed Methods

- GET, POST, PUT, DELETE, OPTIONS, PATCH

### Allowed Headers

- Content-Type
- Authorization
- X-Requested-With

## How to Use

### Option 1: Automatic (Recommended)

The middleware and Next.js config automatically handle CORS for all API routes. No additional code needed in your API routes.

### Option 2: Manual Control

For specific API routes that need custom CORS handling:

```typescript
import { withCors } from "@/lib/cors";

async function handler(request: NextRequest) {
  // Your API logic here
  return NextResponse.json({ data: "success" });
}

export const GET = withCors(handler);
export const POST = withCors(handler);
export const OPTIONS = withCors(handler);
```

## Testing CORS

### Test Endpoint

A test endpoint has been created at `/api/test-cors` to verify CORS is working:

```bash
# Test GET request
curl -H "Origin: http://localhost:3001" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/api/test-cors

# Test POST request
curl -H "Origin: http://localhost:3001" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"test": "data"}' \
     http://localhost:3000/api/test-cors
```

### Browser Testing

Open your browser's developer console and run:

```javascript
// Test from another domain
fetch("http://localhost:3000/api/test-cors", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("CORS Error:", error));
```

## Production Setup

### 1. Update Allowed Origins

In both `next.config.ts` and `src/middleware.ts`, replace `https://yourdomain.com` with your actual production domain(s).

### 2. Environment Variables

Consider using environment variables for allowed origins:

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "https://yourdomain.com",
];
```

### 3. Security Considerations

- **Development**: Allows all origins (`*`)
- **Production**: Restrict to specific domains
- **Credentials**: Only allow credentials for trusted origins

## Troubleshooting

### Common Issues

1. **CORS Error in Browser**

   - Check if the origin is in the allowed list
   - Verify the API route is under `/api/`
   - Ensure the request method is allowed

2. **Preflight Request Failing**

   - Check if OPTIONS method is handled
   - Verify Access-Control-Allow-Headers includes required headers
   - Ensure Access-Control-Allow-Methods includes the request method

3. **Credentials Not Working**
   - Set `Access-Control-Allow-Credentials: true`
   - Ensure `Access-Control-Allow-Origin` is not `*` when using credentials
   - Include credentials in the fetch request: `credentials: 'include'`

### Debug Mode

To debug CORS issues, check the browser's Network tab for:

- Preflight OPTIONS requests
- Response headers
- Error messages

## Example Usage from External Application

```javascript
// From a React app on different domain
const apiUrl = "https://your-taxingcrm-backend.com/api";

// Login request
const loginResponse = await fetch(`${apiUrl}/admin/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "password",
  }),
});

const loginData = await loginResponse.json();

// Use the token for authenticated requests
const userResponse = await fetch(`${apiUrl}/auth/me`, {
  headers: {
    Authorization: `Bearer ${loginData.token}`,
    "Content-Type": "application/json",
  },
});
```

## Next Steps

1. **Update Production Domain**: Replace `https://yourdomain.com` with your actual domain
2. **Test Thoroughly**: Use the test endpoint to verify CORS works
3. **Monitor**: Check browser console for any CORS-related errors
4. **Document**: Update your API documentation to mention CORS support

Your backend is now ready to accept requests from other applications! 🚀
