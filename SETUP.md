# Xploar.ai Setup Guide

## 🚀 New Features Implemented

### ✅ Authentication System
- **JWT-based authentication** with access and refresh tokens
- **Secure token storage** using HTTP-only cookies
- **Automatic token refresh** when access token expires
- **Route protection** with Next.js middleware
- **Login/Registration pages** with form validation

### ✅ API Layer
- **Structured API services** for all major features
- **Axios client** with interceptors and error handling
- **Custom React hooks** for API management
- **Loading states and error handling** built-in
- **Request cancellation** and caching support

### ✅ Security Features
- **CSRF protection** with secure cookies
- **Route guards** for protected pages
- **Automatic logout** on token expiration
- **Secure password handling** with proper validation

## 🛠️ Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in your project root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.xploar.ai

# Development overrides
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

## 📁 New Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── layout.tsx       # Auth layout
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/       # Main dashboard
│   │   └── layout.tsx       # Dashboard layout
│   ├── page.tsx             # Home page (redirects)
│   └── layout.tsx           # Root layout
├── components/               # UI Components
├── lib/
│   ├── api/                 # API services
│   │   ├── client.ts        # Axios client with interceptors
│   │   ├── auth.ts          # Authentication API
│   │   ├── study-planner.ts # Study planner API
│   │   ├── progress.ts      # Progress tracking API
│   │   ├── user-profile.ts  # User profile API
│   │   └── index.ts         # API exports
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useApi.ts        # Generic API hook
│   │   ├── useStudyPlanner.ts # Study planner hook
│   │   └── index.ts         # Hooks exports
│   ├── store/               # Zustand store (updated)
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── middleware.ts             # Route protection
└── providers/                # React context providers
```

## 🔐 Authentication Flow

### 1. User Registration
- User fills out registration form
- Data is sent to `/api/auth/register`
- Success redirects to login page

### 2. User Login
- User enters credentials
- Data is sent to `/api/auth/login`
- JWT tokens are stored in secure cookies
- User is redirected to dashboard

### 3. Protected Routes
- Middleware checks for valid access token
- Unauthenticated users are redirected to login
- Authenticated users can access dashboard

### 4. Token Refresh
- Access token expires after 1 hour
- Refresh token is valid for 7 days
- Automatic refresh happens in background
- Failed refresh logs user out

## 🚫 What Was Removed

- **All dummy data** from `src/lib/data/`
- **Sample data imports** from store
- **Mock API calls** replaced with real endpoints
- **Local state generation** for study plans

## 🔄 What Was Updated

- **Store actions** now integrate with API layer
- **Components** use real authentication state
- **Routing** includes proper authentication checks
- **Error handling** is now comprehensive

## 🧪 Testing the New System

### 1. Start the app
```bash
npm run dev
```

### 2. Navigate to `/auth/register`
- Fill out the registration form
- Submit and verify API call

### 3. Navigate to `/auth/login`
- Use registered credentials
- Verify successful login and redirect

### 4. Test protected routes
- Try accessing `/dashboard` without login
- Verify automatic redirect to login

### 5. Test logout
- Login and navigate to dashboard
- Click logout button
- Verify redirect to login page

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Verify backend server is running

2. **Authentication Not Working**
   - Check browser cookies
   - Verify JWT token format
   - Check console for errors

3. **Route Protection Issues**
   - Verify middleware.ts is in root
   - Check cookie names match

4. **Build Errors**
   - Clear `.next` folder
   - Run `npm run build` to check for issues

## 🚀 Next Steps

1. **Connect to Real Backend**
   - Update API endpoints in services
   - Test all API integrations

2. **Add Error Boundaries**
   - Implement React error boundaries
   - Add fallback UI for errors

3. **Add Loading States**
   - Implement skeleton loaders
   - Add progress indicators

4. **Add Form Validation**
   - Implement Zod schemas
   - Add client-side validation

5. **Add Testing**
   - Unit tests for hooks
   - Integration tests for API calls

## 📚 Additional Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [JWT Authentication](https://jwt.io/introduction)
- [React Hooks](https://react.dev/reference/react/hooks)
