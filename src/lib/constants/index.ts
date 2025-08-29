// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  
  // User Profile
  USER: {
    PROFILE: '/user/profile',
    PROFILE_PICTURE: '/user/profile/picture',
    PASSWORD: '/user/password',
  },
  
  // Study Planner
  STUDY_PLANNER: {
    PLANS: '/study-planner/plans',
    TASKS: '/study-planner/tasks',
    DAILY_PLANS: '/study-planner/daily-plans',
    SESSIONS: '/study-planner/sessions',
  },
  
  // Progress Tracking
  PROGRESS: {
    OVERALL: '/progress/overall',
    STUDY_PLANS: '/progress/study-plans',
    SUBJECTS: '/progress/subjects',
    STREAKS: '/progress/streaks',
    ANALYTICS: '/progress/analytics',
  },
  
  // Content Hub
  CONTENT_HUB: {
    CURRENT_AFFAIRS: '/content/current-affairs',
    DAILY_QUIZZES: '/content/daily-quizzes',
    DIGITAL_LIBRARY: '/content/digital-library',
    FLASHCARDS: '/content/flashcards',
    NOTES: '/content/notes',
  },
  
  // Mock Tests
  MOCK_TESTS: {
    TESTS: '/mock-tests',
    SESSIONS: '/mock-tests/sessions',
    QUESTIONS: '/mock-tests/questions',
    RESULTS: '/mock-tests/results',
    HISTORY: '/mock-tests/history',
    ANALYTICS: '/mock-tests/analytics',
  },
  
  // Community
  COMMUNITY: {
    STUDY_GROUPS: '/community/study-groups',
    FORUMS: '/community/forums',
    PEER_REVIEW: '/community/peer-review',
    LEADERBOARDS: '/community/leaderboards',
  },
  
  // Mentor Connect
  MENTOR_CONNECT: {
    MENTORS: '/mentor-connect/mentors',
    SESSIONS: '/mentor-connect/sessions',
    PROGRAMS: '/mentor-connect/programs',
    REQUESTS: '/mentor-connect/requests',
  },
  
  // Analytics
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    METRICS: '/analytics/metrics',
    TOPICS: '/analytics/topics',
    PATTERNS: '/analytics/patterns',
    MOCK_TESTS: '/analytics/mock-tests',
    COMPARATIVE: '/analytics/comparative',
    INSIGHTS: '/analytics/insights',
    GOALS: '/analytics/goals',
    REPORTS: '/analytics/reports',
    REAL_TIME: '/analytics/real-time',
    PREDICTIVE: '/analytics/predictive',
  },
} as const;

// Feature Flags
export const FEATURES = {
  STUDY_PLANNER: 'study-planner',
  CONTENT_HUB: 'content-hub',
  MOCK_TESTS: 'mock-tests',
  PROGRESS: 'progress',
  COMMUNITY: 'community',
  MENTOR_CONNECT: 'mentor-connect',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
} as const;

// App Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  STUDY_PLANNER: '/dashboard/study-planner',
  CONTENT_HUB: '/dashboard/content-hub',
  MOCK_TESTS: '/dashboard/mock-tests',
  PROGRESS: '/dashboard/progress',
  COMMUNITY: '/dashboard/community',
  MENTOR_CONNECT: '/dashboard/mentor-connect',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'xploar_theme',
  LANGUAGE: 'xploar_language',
  USER_PREFERENCES: 'xploar_user_preferences',
} as const;

// Cookie Names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'xploar_access_token',
  REFRESH_TOKEN: 'xploar_refresh_token',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Study Session
export const STUDY_SESSION = {
  MIN_DURATION: 5, // minutes
  MAX_DURATION: 480, // 8 hours
  BREAK_INTERVAL: 25, // minutes
  LONG_BREAK_INTERVAL: 90, // minutes
} as const;

// Mock Test
export const MOCK_TEST = {
  MAX_QUESTIONS: 100,
  TIME_LIMIT: 180, // minutes
  PASSING_SCORE: 40, // percentage
} as const;

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
} as const;
