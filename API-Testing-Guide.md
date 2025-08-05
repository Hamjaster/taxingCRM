# TaxingCRM API Testing Guide

This guide explains how to test the TaxingCRM APIs using the provided Postman collection.

## Prerequisites

1. **Import the Postman Collection**

   - Open Postman
   - Click "Import" → "Upload Files"
   - Select `TaxingCRM-Postman-Collection.json`

2. **Set Base URL**

   - The collection uses `{{baseUrl}}` variable set to `http://localhost:3001`
   - Make sure your development server is running

3. **Firebase Setup Required**
   - The authentication flow requires Firebase configuration
   - Phone number verification happens through Firebase (not directly testable in Postman)

## API Testing Workflow

### 1. Database Initialization

**First, seed the database:**

```
POST /api/seed
```

This creates:

- Default service types (1040 Filing, BOI Report, LLC Setup, etc.)
- Default admin user (admin@taxingcrm.com / admin123)

### 2. Authentication Flow

#### Option A: Use Default Admin (Recommended for Testing)

```
POST /api/auth/login
Body: {
  "email": "admin@taxingcrm.com",
  "password": "admin123"
}
```

**Response:** Direct login success with authentication cookie set.

#### Option B: Register New User (Requires OTP Verification)

```
POST /api/auth/register
Body: {
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+1234567890",
  "role": "admin" // or "client"
}
```

**Important Note about OTP Verification:**

- **Registration** requires Firebase OTP verification to complete
- **Login** does NOT require OTP if phone is already verified
- **Unverified users** can complete verification through login or registration
- For Postman testing, you can simulate OTP verification:

```
POST /api/auth/complete-verification
Body: {
  "userId": "USER_ID_FROM_RESPONSE",
  "firebaseUid": "simulated-firebase-uid"
}
```

**Handling Unverified Users:**

If a user tries to login with an unverified phone, they'll get:

```json
{
  "error": "Phone number not verified. Please complete phone verification.",
  "userId": "USER_ID",
  "phoneNumber": "+1234567890",
  "needsVerification": true
}
```

If a user tries to register again with the same email/phone but unverified:

```json
{
  "message": "Account exists but phone not verified. Please complete phone verification.",
  "userId": "USER_ID",
  "phoneNumber": "+1234567890",
  "needsVerification": true
}
```

### 3. Service Types Management

**Get all service types:**

```
GET /api/service-types
Headers: Cookie: auth-token={{authToken}}
```

**Create new service type (Admin only):**

```
POST /api/service-types
Headers: Cookie: auth-token={{authToken}}
Body: {
  "name": "Custom Service",
  "description": "Custom tax service"
}
```

### 4. Client Management

**Get all clients (Admin only):**

```
GET /api/clients
Headers: Cookie: auth-token={{authToken}}
```

### 5. Project Management

**Create a project (Admin only):**

```
POST /api/projects
Headers: Cookie: auth-token={{authToken}}
Body: {
  "name": "2024 Tax Return",
  "description": "Individual tax return",
  "clientId": "CLIENT_USER_ID",
  "serviceTypes": ["SERVICE_TYPE_ID"],
  "priority": "Medium",
  "dueDate": "2024-04-15T00:00:00.000Z"
}
```

**Get all projects:**

```
GET /api/projects
Headers: Cookie: auth-token={{authToken}}
```

- Admins see all projects
- Clients see only their own projects

**Update project status:**

```
PUT /api/projects/{projectId}
Headers: Cookie: auth-token={{authToken}}
Body: {
  "status": "In Progress", // "Info Received", "In Progress", "Waiting", "Completed"
  "priority": "High"
}
```

### 6. Notes Management

**Get project notes:**

```
GET /api/notes?projectId={projectId}
Headers: Cookie: auth-token={{authToken}}
```

**Create internal note (Admin only):**

```
POST /api/notes
Headers: Cookie: auth-token={{authToken}}
Body: {
  "projectId": "PROJECT_ID",
  "content": "Internal note content",
  "isVisibleToClient": false
}
```

**Create client-visible note (Admin only):**

```
POST /api/notes
Headers: Cookie: auth-token={{authToken}}
Body: {
  "projectId": "PROJECT_ID",
  "content": "Client can see this note",
  "isVisibleToClient": true
}
```

**Create client note:**

```
POST /api/notes
Headers: Cookie: auth-token={{authToken}}
Body: {
  "projectId": "PROJECT_ID",
  "content": "Message from client"
}
```

## Authentication & Authorization

### Cookie-Based Authentication

- After successful OTP verification, the server sets an HTTP-only cookie
- Include this cookie in subsequent requests: `Cookie: auth-token={{authToken}}`
- The Postman collection automatically handles this with variables

### Role-Based Access Control

- **Admin users** can:
  - View all clients and projects
  - Create/update/delete projects
  - Create service types
  - Create internal and client-visible notes
- **Client users** can:
  - View only their own projects
  - View only notes visible to them
  - Create notes on their projects

## Testing Scenarios

### Scenario 1: Complete Admin Workflow

1. Seed database
2. Login as admin (direct login, no OTP)
3. Create service type
4. Register a client user (requires OTP verification)
5. Create project for client
6. Add internal note
7. Add client-visible note
8. Update project status

### Scenario 2: Client Experience

1. Register as client (requires OTP verification)
2. Login as client (direct login, no OTP)
3. View assigned projects
4. View project notes (only visible ones)
5. Add note to project

### Scenario 3: Project Lifecycle

1. Create project (status: "Info Received")
2. Update to "In Progress"
3. Add progress notes
4. Update to "Waiting" (for client response)
5. Update to "Completed"

## Common Issues & Solutions

### 1. Authentication Errors

- **401 Unauthorized**: Cookie not set or expired
- **403 Forbidden**: Insufficient permissions (wrong role)

### 2. Firebase OTP Testing

- OTP verification is **only required during registration**
- Login does **not** require OTP if phone is already verified
- For development testing, you can bypass Firebase by directly calling verify-otp
- In production, implement proper Firebase phone verification

### 3. Missing IDs

- Use collection variables to store IDs between requests
- Check response bodies for generated IDs

### 4. CORS Issues

- Make sure your Next.js dev server is running
- Check that cookies are being sent with requests

## Collection Variables

The Postman collection uses these variables:

- `{{baseUrl}}`: API base URL (http://localhost:3001)
- `{{authToken}}`: Authentication token (auto-set after login)
- `{{userId}}`: Current user ID (auto-set after login/register)
- `{{projectId}}`: Current project ID (auto-set after project creation)

## Response Formats

### Success Responses

```json
{
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Responses

```json
{
  "error": "Error message description"
}
```

### Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error
