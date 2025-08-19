export const APP_CONFIG = {
    STORAGE_KEY: 'xploar_app_state',
    DEFAULT_STUDY_DURATION: 90, // days
    DEFAULT_HOURS_PER_DAY: 3,
    POMODORO_DURATION: 25, // minutes
    BREAK_DURATION: 5, // minutes
    MOCK_TEST_DURATION: 90, // minutes
    QUESTIONS_PER_MOCK: 20,
};

export const FEATURES = {
    ONBOARDING: 'onboarding',
    STUDY_PLANNER: 'study-planner',
    MOCK_TESTS: 'mock-tests',
    DEBATE: 'debate',
    INTERVIEW: 'interview',
    PROGRESS: 'progress',
    SETTINGS: 'settings',
    CONTENT_HUB: 'content-hub',
    COMMUNITY: 'community',
    MENTOR_CONNECT: 'mentor-connect',
    RECOMMENDATIONS: 'recommendations',
    SYLLABUS: 'syllabus',
    DAILY_CHALLENGE: 'daily-challenge',
} as const;

export const TASK_TYPES = {
    READ: 'Read',
    practice: 'Practice',
    explain: 'Explain',
    recall: 'Recall',
} as const;

export const USER_ROLES = {
    STUDENT: 'student',
    MENTOR: 'mentor',
    ADMIN: 'admin',
} as const;
