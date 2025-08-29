# Xploar Authentication System

## Overview

This document describes the comprehensive authentication system implemented for the Xploar web application. The system provides secure user authentication, registration, onboarding, and profile management with proper routing and middleware protection.

## Features

### 🔐 Authentication
- **User Registration**: Comprehensive signup with validation
- **User Login**: Secure authentication with JWT tokens
- **Password Recovery**: Forgot password functionality
- **Token Management**: Access and refresh token handling
- **Session Persistence**: Automatic token refresh and validation

### 👤 User Management
- **Profile Management**: Complete user profile with editing capabilities
- **Onboarding Flow**: Multi-step setup for new users
- **Preference Settings**: Study preferences and notification settings
- **Academic Information**: Education and exam details

### 🛡️ Security
- **Route Protection**: Middleware-based authentication guards
- **Token Validation**: Automatic token verification
- **Secure Storage**: HTTP-only cookies for token storage
- **Input Validation**: Form validation and sanitization

## Architecture

### File Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Registration page
│   │   └── forgot-password/page.tsx # Password recovery
│   ├── onboarding/page.tsx         # Onboarding flow
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── profile/page.tsx            # User profile
│   ├── terms/page.tsx              # Terms of service
│   ├── privacy/page.tsx            # Privacy policy
│   └── page.tsx                    # Root redirect
├── lib/
│   ├── context/
│   │   └── auth-context.tsx        # Authentication context
│   ├── api/
│   │   ├── auth.ts                 # Auth API service
│   │   ├── user-profile.ts         # Profile API service
│   │   └── client.ts               # API client
│   └── types/
│       └── auth.ts                 # Authentication types
└── middleware.ts                   # Route protection
```

### Core Components

#### 1. Authentication Context (`auth-context.tsx`)
- Manages global authentication state
- Provides authentication methods (login, register, logout)
- Handles token management and user sessions
- Manages onboarding completion status

#### 2. API Services
- **Auth Service**: Handles login, registration, and token management
- **User Profile Service**: Manages user profile data and onboarding
- **API Client**: HTTP client with token handling and refresh logic

#### 3. Route Protection
- **Middleware**: Protects routes based on authentication status
- **Automatic Redirects**: Routes users to appropriate pages based on their status
- **Public Routes**: Allows access to authentication and legal pages

## User Flow

### New User Journey
1. **Landing Page** → Redirects to `/auth/register`
2. **Registration** → User fills out comprehensive registration form
3. **Onboarding** → Multi-step setup process
    - Goal selection (UPSC, JEE, NEET, etc.)
    - Study schedule and preferences
    - Subject selection
    - Study pattern and preferences
4. **Dashboard** → Access to study planner and features

### Existing User Journey
1. **Landing Page** → Redirects to `/auth/login`
2. **Login** → User authenticates with email/password
3. **Dashboard** → Direct access to study planner (existing users skip onboarding)

### Authentication States
- **Unauthenticated**: Redirected to login
- **Authenticated + No Profile**: Redirected to onboarding (new users)
- **Authenticated + Has Profile**: Direct access to dashboard (existing users)

## API Integration

### Authentication Endpoints
```typescript
// Registration
POST /api/auth/register
{
  email: string
  firstName: string
  lastName: string
  password: string
  mobileNumber?: string
  countryCode?: string
  preferences: {
    timezone: string
    language: string
    notificationSettings: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
}

// Login
POST /api/auth/login
{
  email: string
  password: string
  deviceInfo: {
    deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET'
    os: string
    osVersion: string
  }
}

// Token Refresh
POST /api/auth/refresh
{
  refreshToken: string
}
```

### User Profile Endpoints
```typescript
// Get Profile
GET /api/user-profile

// Update Profile
PUT /api/user-profile
{
  personalInfo?: {...}
  academicInfo?: {...}
  preferences?: {...}
}

// Complete Onboarding
POST /api/user-profile/onboarding
{
  goal: string
  startDate: string
  targetHoursPerDay: number
  difficultyLevel: string
  subjects: {...}
  studyPattern: string
  breakDuration: number
  weeklyOffDays: string[]
  aiRecommendations: boolean
}
```

## Security Features

### Token Management
- **Access Token**: Short-lived (1 hour) for API requests
- **Refresh Token**: Long-lived for token renewal
- **Automatic Refresh**: Seamless token renewal in background
- **Secure Storage**: HTTP-only cookies with proper flags

### Route Protection
- **Middleware**: Server-side route protection
- **Client-side Guards**: Component-level authentication checks
- **Automatic Redirects**: Smart routing based on user status
- **Public Routes**: Whitelist for unauthenticated access

### Input Validation
- **Form Validation**: Client-side validation with error handling
- **Password Strength**: Multi-factor password strength indicator
- **Data Sanitization**: Input cleaning and validation
- **Error Handling**: User-friendly error messages

## UI Components

### Authentication Pages
- **Login**: Clean, modern login form with validation
- **Registration**: Comprehensive signup with password strength
- **Forgot Password**: Simple password recovery flow
- **Onboarding**: Multi-step wizard with progress tracking

### User Interface
- **Dashboard**: Overview of study progress and tasks
- **Profile**: Editable user profile with sections
- **Navigation**: Consistent header with user actions
- **Responsive Design**: Mobile-first responsive layout

## Configuration

### Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.xploar.ai

# Development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Token Configuration
```typescript
// Token keys
const TOKEN_KEY = 'xploar_access_token'
const REFRESH_TOKEN_KEY = 'xploar_refresh_token'

// Token expiration
const ACCESS_TOKEN_EXPIRY = 3600 // 1 hour
const REFRESH_TOKEN_EXPIRY = 2592000 // 30 days
```

## Development

### Running the Application
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing Authentication
1. **Register**: Create a new account at `/auth/register`
2. **Login**: Sign in with existing credentials at `/auth/login`
3. **Onboarding**: Complete the onboarding flow for new users
4. **Dashboard**: Access the main application after authentication
5. **Profile**: Edit user profile and preferences

### Debugging
- Check browser console for authentication errors
- Verify token storage in browser cookies
- Monitor network requests for API calls
- Check middleware logs for route protection issues

## Future Enhancements

### Planned Features
- **Two-Factor Authentication**: SMS/Email verification
- **Social Login**: Google, Facebook, Apple integration
- **Role-Based Access**: Student, Mentor, Admin roles
- **Advanced Security**: Rate limiting, IP blocking
- **Audit Logging**: User action tracking

### Technical Improvements
- **Performance**: Token caching and optimization
- **Scalability**: Distributed session management
- **Monitoring**: Authentication metrics and alerts
- **Testing**: Comprehensive test coverage

## Support

For technical support or questions about the authentication system:
- **Email**: tech-support@xploar.ai
- **Documentation**: https://docs.xploar.ai/auth
- **Issues**: GitHub repository issues

---

*Last Updated: January 2025*  
*Version: 1.0.0*
