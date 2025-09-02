// API Client
export { apiClient } from './client';

// Authentication Service
export { authService } from './auth';
export type {
    UserLoginData,
    UserRegistrationData,
    AuthResponse,
    RegistrationResponse,
    TokenRefreshResponse,
    WhatsAppOTPRequest,
    WhatsAppOTPVerifyRequest,
    WhatsAppOTPResponse,
    WhatsAppOTPVerifyResponse
} from './auth';

// Study Planner Service
export { studyPlannerService } from './study-planner';

// Progress Service
export { progressService } from './progress';
export type { ProgressParams } from './progress';

// Recommendations Service
export { recommendationsService } from './recommendations';
export type { RecommendationParams } from './recommendations';

// Daily Challenges Service
export { dailyChallengesService } from './daily-challenges';
export type { DailyChallenge, DailyChallengeCompletion, DailyChallengeStats } from './daily-challenges';

// User Profile Service
export { userProfileService } from './user-profile';
export type {
    UserProfileUpdate,
    PasswordChange,
    ProfilePictureResponse
} from './user-profile';

// Content Hub Service
export { contentHubService } from './content-hub';
export type {
    CurrentAffairsParams,
    DailyQuizParams,
    DigitalLibraryParams,
    FlashcardParams
} from './content-hub';

// Mock Tests Service
export { mockTestsService } from './mock-tests';
export type {
    MockTestParams,
    MockTestConfig,
    MockTestSubmission,
    MockTestResult
} from './mock-tests';

// Community Service
export { communityService } from './community';
export type {
    StudyGroupParams,
    StudyGroupCreate,
    StudyGroupUpdate,
    ForumPostParams,
    ForumPostCreate,
    ForumReplyCreate,
    PeerReviewParams,
    PeerReviewSubmission
} from './community';

// Mentor Connect Service
export { mentorConnectService } from './mentor-connect';
export type {
    MentorSearchParams,
    MentorProfile,
    SessionBookingRequest,
    SessionRescheduleRequest,
    SessionFeedback,
    MentorshipProgram
} from './mentor-connect';

// Analytics Service
export { analyticsService } from './analytics';
export type {
    AnalyticsTimeRange,
    PerformanceMetrics,
    TopicPerformance,
    StudyPatterns,
    LearningInsights,
    MockTestAnalytics,
    ComparativeAnalytics,
    GoalTracking
} from './analytics';

// Common Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
    requestId: string;
}

export interface PaginatedResponse<T = unknown> {
    data: T[];
    pagination: {
        page: number;
        size: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

export interface ApiError {
    message: string;
    code: string;
    details?: unknown;
    timestamp: string;
    requestId: string;
}

// API Constants
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        VERIFY_EMAIL: '/api/auth/verify-email',
        RESET_PASSWORD: '/api/auth/reset-password',
        CONFIRM_RESET: '/api/auth/confirm-reset',
    },
    STUDY_PLANNER: {
        PLANS: '/api/study-planner/plans',
        TASKS: '/api/study-planner/tasks',
        SESSIONS: '/api/study-planner/sessions',
        GOALS: '/api/study-planner/goals',
        REMINDERS: '/api/study-planner/reminders',
    },
    PROGRESS: {
        TRACKING: '/api/progress/tracking',
        TOPICS: '/api/progress/topics',
        SUBJECTS: '/api/progress/subjects',
        ACHIEVEMENTS: '/api/progress/achievements',
        MILESTONES: '/api/progress/milestones',
    },
    USER_PROFILE: {
        PROFILE: '/api/user-profile',
        PICTURE: '/api/user-profile/picture',
        PREFERENCES: '/api/user/preferences',
        SUBSCRIPTION: '/api/user/subscription',
        BILLING: '/api/user/billing',
    },
    CONTENT_HUB: {
        CURRENT_AFFAIRS: '/api/content/current-affairs',
        DAILY_QUIZ: '/api/content/daily-quiz',
        DIGITAL_LIBRARY: '/api/content/digital-library',
        FLASHCARDS: '/api/content/flashcards',
        USER_NOTES: '/api/content/user-notes',
    },
    MOCK_TESTS: {
        AVAILABLE: '/api/mock-tests/available',
        SESSIONS: '/api/mock-tests/sessions',
        QUESTIONS: '/api/mock-tests/questions',
        RESULTS: '/api/mock-tests/results',
        ANALYTICS: '/api/mock-tests/analytics',
    },
    COMMUNITY: {
        STUDY_GROUPS: '/api/community/study-groups',
        FORUMS: '/api/community/forums',
        PEER_REVIEW: '/api/community/peer-review',
        LEADERBOARD: '/api/community/leaderboard',
    },
    MENTOR_CONNECT: {
        SEARCH: '/api/mentor-connect/search',
        MENTORS: '/api/mentor-connect/mentors',
        SESSIONS: '/api/mentor-connect/sessions',
        PROGRAMS: '/api/mentor-connect/programs',
    },
    ANALYTICS: {
        PERFORMANCE: '/api/analytics/performance',
        TOPICS: '/api/analytics/topics',
        STUDY: '/api/analytics/study',
        MOCK_TESTS: '/api/analytics/mock-tests',
        COMPARISON: '/api/analytics/comparison',
        INSIGHTS: '/api/analytics/insights',
        GOALS: '/api/analytics/goals',
        REPORTS: '/api/analytics/reports',
    },
} as const;

// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.xploar.ai',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

// Utility Functions
export const createApiUrl = (endpoint: string, params?: Record<string, unknown>): string => {
    const url = new URL(endpoint, API_CONFIG.BASE_URL);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => url.searchParams.append(key, v.toString()));
                } else {
                    url.searchParams.append(key, value.toString());
                }
            }
        });
    }

    return url.toString();
};

export const handleApiError = (error: unknown): ApiError => {
    if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { error?: { message?: string; code?: string; details?: unknown } }; timestamp?: string; requestId?: string } };
        return {
            message: responseError.response?.data?.error?.message || 'An error occurred',
            code: responseError.response?.data?.error?.code || 'UNKNOWN_ERROR',
            details: responseError.response?.data?.error?.details,
            timestamp: responseError.response?.timestamp || new Date().toISOString(),
            requestId: responseError.response?.requestId || 'unknown',
        };
    }

    return {
        message: error instanceof Error ? error.message : 'Network error occurred',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        requestId: 'unknown',
    };
};
