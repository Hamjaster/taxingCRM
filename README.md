# TaxingCRM - Tax Management System

A comprehensive Next.js application for tax professionals and their clients, featuring secure authentication, project management, and client communication tools.

## Features

### Admin Features

- **Client Management**: Manage client accounts and information
- **Project Management**: Create, assign, and track tax projects
- **Task Management**: Set project stages (Info Received, In Progress, Waiting, Completed)
- **Service Types**: Organize services with tags (1040 Filing, BOI Report, LLC Setup, etc.)
- **Internal Notes**: Add date-stamped notes with client visibility controls
- **Dashboard**: Overview of clients, projects, and activity

### Client Features

- **Project Tracking**: View assigned projects and current status
- **Communication**: See visible notes from tax professionals
- **Document Access**: View project-related documents
- **Dashboard**: Personal overview of tax projects

### Security Features

- **2FA Authentication**: SMS-based OTP verification using Firebase Auth for both admin and client accounts
- **Role-based Access**: Separate admin and client portals
- **Secure Sessions**: JWT-based authentication with HTTP-only cookies

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT + Firebase Phone Authentication with SMS OTP
- **Styling**: Tailwind CSS v4

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Firebase project with Authentication enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd TaxingCRM
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy `.env.local` and update the values:

   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/taxing-crm

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # JWT
   JWT_SECRET=your-jwt-secret-here
   ```

4. **Firebase Setup**

   1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   2. Enable Authentication and Phone Number sign-in method
   3. Get your Firebase configuration from Project Settings
   4. Update the Firebase environment variables in `.env.local`

5. **Database Setup**

   Start your MongoDB server, then seed the database:

   ```bash
   # Using the API endpoint (recommended)
   # Start the dev server first: npm run dev
   # Then make a POST request to: http://localhost:3001/api/seed

   # Or using curl:
   curl -X POST http://localhost:3001/api/seed
   ```

6. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001`

## Default Credentials

After seeding the database, you can use these credentials:

**Admin Account:**

- Email: `admin@taxingcrm.com`
- Password: `admin123`
- Phone: `+1234567890` (for OTP testing)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin portal pages
│   ├── client/            # Client portal pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   └── ui/                # Shadcn UI components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── mongodb.ts         # Database connection
│   ├── twilio.ts          # SMS utilities
│   └── seed.ts            # Database seeding
├── models/                # MongoDB models
└── types/                 # TypeScript type definitions
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/logout` - User logout

### Projects

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Other Endpoints

- `GET /api/clients` - List clients (admin only)
- `GET /api/service-types` - List service types
- `POST /api/service-types` - Create service type (admin only)
- `GET /api/notes` - List project notes
- `POST /api/notes` - Create note

## Development

### Adding New Features

1. **Database Models**: Add new models in `src/models/`
2. **API Routes**: Create API endpoints in `src/app/api/`
3. **Components**: Add reusable components in `src/components/`
4. **Pages**: Create new pages in `src/app/`

### Testing

The application includes basic authentication and CRUD functionality. Test by:

1. Creating admin and client accounts
2. Creating projects and assigning them to clients
3. Adding notes with different visibility settings
4. Testing the 2FA flow

## Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set up production environment variables**

3. **Deploy to your preferred platform** (Vercel, Railway, etc.)

4. **Seed the production database** using the `/api/seed` endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
