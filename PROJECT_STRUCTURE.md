# Xploar Web App - Project Structure

## Overview
This document outlines the comprehensive folder restructuring and architecture of the Xploar Web App, transforming it from a dummy data-driven application to a robust, real-world React application with proper API integration, authentication, and security.

## 🏗️ Project Architecture

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### State Management
- **Zustand** - Lightweight state management
- **React Context** - For authentication and theme
- **Custom Hooks** - For API integration and business logic

### Authentication & Security
- **JWT Tokens** - Access and refresh token system
- **HTTP-only Cookies** - Secure token storage
- **Next.js Middleware** - Route protection
- **Automatic Token Refresh** - Seamless user experience

## 📁 Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── layout.tsx          # Auth layout
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── layout.tsx          # Dashboard layout
│   │   └── dashboard/page.tsx  # Main dashboard
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root page (auth gate)
│   └── favicon.ico             # App icon
│
├── components/                   # React components
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx          # Button component
│   │   ├── Input.tsx           # Input component
│   │   ├── Card.tsx            # Card component
│   │   ├── Modal.tsx           # Modal component
│   │   ├── Dropdown.tsx        # Dropdown component
│   │   ├── Tabs.tsx            # Tabs component
│   │   ├── Badge.tsx           # Badge component
│   │   ├── Avatar.tsx          # Avatar component
│   │   ├── Progress.tsx        # Progress component
│   │   ├── Alert.tsx           # Alert component
│   │   ├── Toast.tsx           # Toast component
│   │   ├── Tooltip.tsx         # Tooltip component
│   │   ├── Select.tsx          # Select component
│   │   ├── Checkbox.tsx        # Checkbox component
│   │   ├── Radio.tsx           # Radio component
│   │   ├── Switch.tsx          # Switch component
│   │   ├── Textarea.tsx        # Textarea component
│   │   ├── Label.tsx           # Label component
│   │   └── index.ts            # UI components export
│   │
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx          # Main header
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Footer.tsx          # Main footer
│   │   ├── MainLayout.tsx      # Main layout wrapper
│   │   └── index.ts            # Layout components export
│   │
│   ├── common/                 # Common/shared components
│   │   ├── LoadingSpinner.tsx  # Loading component
│   │   ├── ErrorBoundary.tsx   # Error handling
│   │   ├── EmptyState.tsx      # Empty state component
│   │   └── index.ts            # Common components export
│   │
│   ├── features/               # Feature-specific components
│   │   ├── study-planner/      # Study planner feature
│   │   │   ├── StudyPlannerDashboard.tsx
│   │   │   ├── StudyPlanCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── index.ts
│   │   ├── content-hub/        # Content hub feature
│   │   │   ├── ContentHubDashboard.tsx
│   │   │   ├── CurrentAffairs.tsx
│   │   │   ├── DailyQuiz.tsx
│   │   │   └── index.ts
│   │   ├── mock-tests/         # Mock tests feature
│   │   │   ├── MockTestsDashboard.tsx
│   │   │   ├── TestSession.tsx
│   │   │   ├── ResultsView.tsx
│   │   │   └── index.ts
│   │   ├── progress/           # Progress tracking feature
│   │   │   ├── ProgressDashboard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── StreakTracker.tsx
│   │   │   └── index.ts
│   │   ├── community/          # Community feature
│   │   │   ├── CommunityDashboard.tsx
│   │   │   ├── StudyGroups.tsx
│   │   │   ├── Forums.tsx
│   │   │   └── index.ts
│   │   ├── mentor-connect/     # Mentor connect feature
│   │   │   ├── MentorConnectDashboard.tsx
│   │   │   ├── MentorList.tsx
│   │   │   ├── SessionBooking.tsx
│   │   │   └── index.ts
│   │   ├── analytics/          # Analytics feature
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── InsightsPanel.tsx
│   │   │   └── index.ts
│   │   ├── settings/           # Settings feature
│   │   │   ├── SettingsDashboard.tsx
│   │   │   ├── ProfileSettings.tsx
│   │   │   ├── Preferences.tsx
│   │   │   └── index.ts
│   │   ├── onboarding/         # Onboarding feature
│   │   │   ├── OnboardingFlow.tsx
│   │   │   ├── WelcomeStep.tsx
│   │   │   ├── PreferencesStep.tsx
│   │   │   └── index.ts
│   │   ├── daily-challenge/    # Daily challenge feature
│   │   │   ├── DailyChallenge.tsx
│   │   │   ├── ChallengeCard.tsx
│   │   │   └── index.ts
│   │   ├── recommendations/    # Recommendations feature
│   │   │   ├── Recommendations.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   └── index.ts
│   │   ├── ai-coach/           # AI coach feature
│   │   │   ├── AICoach.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   └── index.ts
│   │   ├── multi-mode-learning/ # Multi-mode learning feature
│   │   │   ├── MultiModeLearning.tsx
│   │   │   ├── LearningMode.tsx
│   │   │   └── index.ts
│   │   ├── pricing/            # Pricing feature
│   │   │   ├── PricingPlans.tsx
│   │   │   ├── PlanCard.tsx
│   │   │   └── index.ts
│   │   ├── interview/          # Interview prep feature
│   │   │   ├── InterviewPrep.tsx
│   │   │   ├── InterviewSession.tsx
│   │   │   └── index.ts
│   │   ├── debate/             # Debate feature
│   │   │   ├── DebateHub.tsx
│   │   │   ├── DebateRoom.tsx
│   │   │   └── index.ts
│   │   ├── syllabus/           # Syllabus feature
│   │   │   ├── SyllabusViewer.tsx
│   │   │   ├── TopicTree.tsx
│   │   │   └── index.ts
│   │   └── index.ts            # Features export
│   │
│   └── index.ts                # Main components export
│
├── lib/                         # Core library code
│   ├── api/                    # API service layer
│   │   ├── client.ts           # Axios client configuration
│   │   ├── auth.ts             # Authentication API service
│   │   ├── user-profile.ts     # User profile API service
│   │   ├── study-planner.ts    # Study planner API service
│   │   ├── progress.ts         # Progress tracking API service
│   │   ├── content-hub.ts      # Content hub API service
│   │   ├── mock-tests.ts       # Mock tests API service
│   │   ├── community.ts        # Community API service
│   │   ├── mentor-connect.ts   # Mentor connect API service
│   │   ├── analytics.ts        # Analytics API service
│   │   └── index.ts            # API services export
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useApi.ts           # Generic API hook
│   │   ├── useStudyPlanner.ts  # Study planner hook
│   │   ├── useContentHub.ts    # Content hub hook
│   │   ├── useMockTests.ts     # Mock tests hook
│   │   ├── useProgress.ts      # Progress tracking hook
│   │   ├── useCommunity.ts     # Community hook
│   │   ├── useMentorConnect.ts # Mentor connect hook
│   │   ├── useAnalytics.ts     # Analytics hook
│   │   └── index.ts            # Hooks export
│   │
│   ├── services/               # Business logic services
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── user.service.ts     # User management service
│   │   ├── study-planner.service.ts # Study planner service
│   │   ├── progress.service.ts # Progress tracking service
│   │   ├── content-hub.service.ts # Content hub service
│   │   ├── mock-tests.service.ts # Mock tests service
│   │   ├── community.service.ts # Community service
│   │   ├── mentor-connect.service.ts # Mentor connect service
│   │   ├── analytics.service.ts # Analytics service
│   │   ├── notification.service.ts # Notification service
│   │   ├── file-upload.service.ts # File upload service
│   │   ├── search.service.ts   # Search service
│   │   └── index.ts            # Services export
│   │
│   ├── store/                  # State management
│   │   ├── index.ts            # Zustand store
│   │   ├── slices/             # Store slices (if using Redux Toolkit)
│   │   │   ├── authSlice.ts    # Authentication slice
│   │   │   ├── userSlice.ts    # User slice
│   │   │   ├── studyPlannerSlice.ts # Study planner slice
│   │   │   └── index.ts        # Slices export
│   │   └── middleware.ts       # Store middleware
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts            # Main types export
│   │   ├── api.ts              # API types
│   │   ├── auth.ts             # Authentication types
│   │   ├── user.ts             # User types
│   │   ├── study-planner.ts    # Study planner types
│   │   ├── content-hub.ts      # Content hub types
│   │   ├── mock-tests.ts       # Mock tests types
│   │   ├── progress.ts         # Progress types
│   │   ├── community.ts        # Community types
│   │   ├── mentor-connect.ts   # Mentor connect types
│   │   └── analytics.ts        # Analytics types
│   │
│   ├── utils/                  # Utility functions
│   │   ├── index.ts            # Utils export
│   │   ├── validation.ts       # Validation utilities
│   │   ├── date.ts             # Date manipulation utilities
│   │   ├── format.ts           # Formatting utilities
│   │   ├── storage.ts          # Storage utilities
│   │   └── crypto.ts           # Crypto utilities
│   │
│   ├── constants/              # Application constants
│   │   ├── index.ts            # Constants export
│   │   ├── api.ts              # API constants
│   │   ├── routes.ts           # Route constants
│   │   ├── validation.ts       # Validation constants
│   │   └── config.ts           # Configuration constants
│   │
│   └── index.ts                # Main library export
│
├── middleware.ts                # Next.js middleware for route protection
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── README.md                   # Project documentation
├── SETUP.md                    # Setup instructions
├── PROJECT_STRUCTURE.md        # This file
└── api-doc.md                  # API documentation
```

## 🔧 Key Architectural Decisions

### 1. **API-First Architecture**
- All data flows through API services
- No dummy data in production
- Centralized API client with interceptors
- Proper error handling and retry logic

### 2. **Service Layer Pattern**
- Business logic separated from UI components
- Reusable services across the application
- Singleton pattern for service instances
- Proper dependency injection

### 3. **Custom Hooks Pattern**
- API integration abstracted into hooks
- Loading, error, and success states managed
- Request cancellation and caching
- Consistent data fetching patterns

### 4. **Component Organization**
- Feature-based component organization
- Reusable UI components in separate folder
- Clear separation of concerns
- Consistent component interfaces

### 5. **Type Safety**
- Comprehensive TypeScript types
- API response types defined
- Component prop interfaces
- Strict type checking enabled

## 🚀 Development Workflow

### 1. **Feature Development**
1. Define types in `src/lib/types/`
2. Create API service in `src/lib/api/`
3. Create business logic service in `src/lib/services/`
4. Create custom hook in `src/lib/hooks/`
5. Create UI components in `src/components/features/`
6. Integrate with store and routing

### 2. **API Integration**
1. Define API endpoints in `src/lib/constants/`
2. Implement API service methods
3. Create custom hooks for data fetching
4. Handle loading, error, and success states
5. Implement proper error handling

### 3. **Component Development**
1. Use existing UI components from `src/components/ui/`
2. Create feature-specific components
3. Implement proper TypeScript interfaces
4. Add proper error boundaries
5. Implement loading states

## 🔒 Security Features

### 1. **Authentication**
- JWT-based authentication
- HTTP-only cookies for token storage
- Automatic token refresh
- Route protection with middleware

### 2. **Data Validation**
- Client-side validation with utility functions
- Server-side validation (API level)
- Input sanitization
- XSS protection

### 3. **API Security**
- HTTPS enforcement
- CORS configuration
- Rate limiting (server-side)
- Request validation

## 📱 Responsive Design

### 1. **Mobile-First Approach**
- Tailwind CSS responsive utilities
- Mobile-optimized components
- Touch-friendly interactions
- Progressive enhancement

### 2. **Cross-Platform Compatibility**
- Browser compatibility
- Progressive Web App features
- Offline support (planned)
- Accessibility compliance

## 🧪 Testing Strategy

### 1. **Unit Testing**
- Component testing with React Testing Library
- Hook testing
- Utility function testing
- Service layer testing

### 2. **Integration Testing**
- API integration testing
- Component integration testing
- User flow testing

### 3. **End-to-End Testing**
- User journey testing
- Cross-browser testing
- Performance testing

## 🚀 Deployment

### 1. **Build Process**
- Next.js build optimization
- TypeScript compilation
- CSS optimization
- Asset optimization

### 2. **Environment Configuration**
- Environment variables
- Feature flags
- API endpoint configuration
- Build-time optimizations

## 📊 Performance Optimization

### 1. **Code Splitting**
- Route-based code splitting
- Component lazy loading
- Dynamic imports
- Bundle analysis

### 2. **Caching Strategy**
- API response caching
- Static asset caching
- Service worker caching (planned)
- CDN optimization

## 🔄 State Management

### 1. **Zustand Store**
- Centralized state management
- Action-based state updates
- Computed state values
- Persistence layer

### 2. **Local State**
- Component-level state
- Form state management
- UI state management
- Temporary data storage

## 🌐 Internationalization

### 1. **Multi-Language Support**
- i18n configuration
- Translation files
- Locale detection
- RTL support (planned)

## 📈 Monitoring & Analytics

### 1. **Error Tracking**
- Error boundary implementation
- Error logging
- Performance monitoring
- User analytics

### 2. **Performance Metrics**
- Core Web Vitals
- Page load times
- API response times
- User interaction metrics

## 🔧 Development Tools

### 1. **Code Quality**
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Git hooks (planned)

### 2. **Development Experience**
- Hot reload
- Type checking
- Error overlay
- Debug tools

This structure provides a solid foundation for a scalable, maintainable, and secure React application that follows industry best practices and modern development patterns.
