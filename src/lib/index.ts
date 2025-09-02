// Export main store
export { useAppStore } from './store';

// Export main hooks
export { useAuth } from './hooks/useAuth';
export { useStudyPlanner } from './hooks/useStudyPlanner';

// Export main types (avoid conflicts with API types)
export type {
    User,
    UserProfile,
    StudyPlan,
    Task,
    DailyPlan,
    StudyConfig,
    AppState,
    AppActions
} from './types';

// Export main utilities
export { cn } from './utils';

// Export API services
export { apiClient } from './api/client';
export { authService } from './api/auth';
export { studyPlannerService } from './api/study-planner';
export { progressService } from './api/progress';
export { recommendationsService } from './api/recommendations';
export { dailyChallengesService } from './api/daily-challenges';
