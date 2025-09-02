/**
 * Production-Grade Zustand Store for Xploar Web Application
 * 
 * Features:
 * - Type-safe state management with strict TypeScript
 * - Modular store slices for maintainability
 * - Comprehensive error handling and logging
 * - Performance optimizations with selectors
 * - Secure data persistence with migrations
 * - Centralized action tracking and analytics
 * - Development tools integration
 */

import { create } from 'zustand';
import { persist, subscribeWithSelector, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ErrorHandler } from '@/lib/utils/errorHandler';
import { validateState } from '@/lib/utils/validation';
import { StorageAPI, StorageMigrator } from '@/lib/utils/storage';
import { FEATURES, APP_CONFIG } from '@/lib/utils/constants';
import { getTodayString } from '@/lib/utils/dateUtils';

// Import store slices for ENABLED features only
import { createAuthSlice, type AuthSlice } from './slices/authSlice';
import { createStudySlice, type StudySlice } from './slices/studySlice';
import { createProgressSlice, type ProgressSlice } from './slices/progressSlice';
import { createPreferencesSlice, type PreferencesSlice } from './slices/preferencesSlice';
import { createContentSlice, type ContentSlice } from './slices/contentSlice';

// Unified Types - Single Source of Truth
import type {
    AppState,
    AppActions
} from '@/lib/types';

// ==================== CORE INTERFACES ====================

// Helper type for Zustand slice creators
type SliceCreator<T> = (
    set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
    get: () => T
) => T;

export interface RootState extends AppState {
    // Core application state
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    lastSyncTime: string | null;

    // Feature flags
    enabledFeatures: string[];
    experimentalFeatures: string[];

    // Performance tracking
    performanceMetrics: {
        storeUpdates: number;
        lastUpdateTime: string;
        slowOperations: string[];
    };
}

export interface RootActions extends AppActions {
    // System actions
    initialize: () => Promise<void>;
    reset: () => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;

    // Performance actions
    trackOperation: (operation: string, duration: number) => void;
    getPerformanceReport: () => object;

    // Feature management
    enableFeature: (feature: string) => void;
    disableFeature: (feature: string) => void;
    isFeatureEnabled: (feature: string) => boolean;
}

// Combined store type - ONLY enabled features
export type AppStore = RootState &
    RootActions &
    AuthSlice &
    StudySlice &
    ProgressSlice &
    PreferencesSlice &
    ContentSlice;

// ==================== INITIAL STATE ====================

const createInitialState = (): RootState => ({
    // Core state
    isInitialized: false,
    isLoading: false,
    error: null,
    lastSyncTime: null,

    // User state
    currentUser: null,
    isProUser: false,
    userRole: 'student',

    // Application state
    activeFeature: FEATURES.ONBOARDING,
    enabledFeatures: Object.values(FEATURES),
    experimentalFeatures: [],

    // Study state
    studyConfiguration: {
        goal: '',
        startDate: getTodayString(),
        durationDays: APP_CONFIG.DEFAULT_STUDY_DURATION,
        hoursPerDay: APP_CONFIG.DEFAULT_HOURS_PER_DAY,
    },
    studyPlans: [],
    currentStudyPlan: null,

    // Progress state
    dailyStreak: 0,
    lastStreakUpdateDate: null,
    mcqPerformance: {},
    mockTestHistory: [],

    // AI and recommendations
    recommendations: [],

    // Performance tracking
    performanceMetrics: {
        storeUpdates: 0,
        lastUpdateTime: new Date().toISOString(),
        slowOperations: [],
    },
});

// ==================== STORE MIDDLEWARE ====================

const withErrorHandling = <T extends unknown[], R>(fn: (...args: T) => R) => {
    return (...args: T): R => {
        try {
            const result = fn(...args);

            // Handle async operations
            if (result instanceof Promise) {
                return result.catch((error) => {
                    ErrorHandler.logError(error, 'Store Operation Error');
                    throw error;
                }) as R;
            }

            return result;
        } catch (error) {
            ErrorHandler.logError(error, 'Store Operation Error');
            throw error;
        }
    };
};

// Removed unused performance tracking middleware

// ==================== PERSISTENCE CONFIGURATION ====================

const persistConfig = {
    name: APP_CONFIG.STORAGE_KEY,
    version: 4, // Increment for breaking changes

    // Storage customization
    // Use default storage for now to avoid type issues
    // storage: {
    //     getItem: (name: string) => {
    //         try {
    //             const item = StorageUtils.localStorage.get(name);
    //             return item ? JSON.stringify(item) : null;
    //         } catch (error) {
    //             ErrorHandler.logError(error, 'Storage get error');
    //             return null;
    //         }
    //     },
    //     setItem: (name: string, value: string) => {
    //         try {
    //             StorageUtils.localStorage.set(name, JSON.parse(value));
    //         } catch (error) {
    //             ErrorHandler.logError(error, 'Storage set error');
    //         }
    //     },
    //     removeItem: (name: string) => {
    //         try {
    //             StorageUtils.localStorage.remove(name);
    //         } catch (error) {
    //             ErrorHandler.logError(error, 'Storage remove error');
    //         }
    //     },
    // },

    // Selective persistence
    partialize: (state: AppStore) => ({
        currentUser: state.currentUser,
        isProUser: state.isProUser,
        userRole: state.userRole,
        studyConfiguration: state.studyConfiguration,
        studyPlans: state.studyPlans,
        currentStudyPlan: state.currentStudyPlan,
        dailyStreak: state.dailyStreak,
        lastStreakUpdateDate: state.lastStreakUpdateDate,
        mcqPerformance: state.mcqPerformance,
        mockTestHistory: state.mockTestHistory,
        recommendations: state.recommendations,
        enabledFeatures: state.enabledFeatures,
        preferences: state.preferences,
    }),

    // State migration
    migrate: (persistedState: unknown, version: number) => {
        try {
            switch (version) {
                case 3:
                    // Migrate from v3 to v4
                    const state = persistedState as Record<string, unknown>;
                    return {
                        ...state,
                        studyPlans: state.studyPlan || [],
                        currentStudyPlan: state.currentStudyPlan || null,
                        isInitialized: false,
                    };
                default:
                    return persistedState;
            }
        } catch (error) {
            ErrorHandler.logError(error, 'State migration error');
            return createInitialState();
        }
    },

    // Validation
    onRehydrateStorage: () => (state: AppStore | undefined) => {
        if (state) {
            try {
                validateState(state);
                state.setError(null);
                state.initialize();
            } catch (error) {
                ErrorHandler.logError(error, 'State validation error');
                state?.setError('Failed to restore previous session');
            }
        }
    },
};

// ==================== STORE CREATION ====================

export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set, get) => ({
                    // Initialize state
                    ...createInitialState(),

                    // ==================== CORE ACTIONS ====================

                    initialize: withErrorHandling(async () => {
                        set((state) => {
                            state.isLoading = true;
                            state.error = null;
                        });

                        try {
                            // Migrate legacy storage to new unified system
                            await StorageMigrator.migrateToNewStorage();

                            // Initialize storage and cleanup expired data
                            await StorageAPI.cleanup();

                            // Initialize application state
                            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async init

                            set((state) => {
                                state.isInitialized = true;
                                state.isLoading = false;
                                state.lastSyncTime = new Date().toISOString();
                            });
                        } catch (error) {
                            set((state) => {
                                state.isLoading = false;
                                state.error = 'Initialization failed';
                            });
                            throw error;
                        }
                    }),

                    reset: withErrorHandling(() => {
                        set(() => createInitialState());
                    }),

                    setError: (error: string | null) => {
                        set((state) => {
                            state.error = error;
                        });
                    },

                    setLoading: (loading: boolean) => {
                        set((state) => {
                            state.isLoading = loading;
                        });
                    },

                    // ==================== PERFORMANCE TRACKING ====================

                    trackOperation: (operation: string, duration: number) => {
                        set((state) => {
                            state.performanceMetrics.storeUpdates += 1;
                            state.performanceMetrics.lastUpdateTime = new Date().toISOString();

                            if (duration > 100) {
                                state.performanceMetrics.slowOperations.push(
                                    `${operation}: ${duration.toFixed(2)}ms`
                                );

                                // Keep only last 10 slow operations
                                if (state.performanceMetrics.slowOperations.length > 10) {
                                    state.performanceMetrics.slowOperations.shift();
                                }
                            }
                        });
                    },

                    getPerformanceReport: () => {
                        const state = get();
                        return {
                            totalUpdates: state.performanceMetrics.storeUpdates,
                            lastUpdate: state.performanceMetrics.lastUpdateTime,
                            slowOperations: state.performanceMetrics.slowOperations,
                            stateSize: JSON.stringify(state).length,
                        };
                    },

                    // ==================== FEATURE MANAGEMENT ====================

                    enableFeature: (feature: string) => {
                        set((state) => {
                            if (!state.enabledFeatures.includes(feature)) {
                                state.enabledFeatures.push(feature);
                            }
                        });
                    },

                    disableFeature: (feature: string) => {
                        set((state) => {
                            state.enabledFeatures = state.enabledFeatures.filter((f: string) => f !== feature);
                        });
                    },

                    isFeatureEnabled: (feature: string) => {
                        return get().enabledFeatures.includes(feature);
                    },

                    // ==================== NAVIGATION ====================

                    navigateTo: (feature: string) => {
                        if (get().isFeatureEnabled(feature)) {
                            set((state) => {
                                state.activeFeature = feature;
                            });
                        }
                    },

                    // ==================== STORE SLICES (ENABLED FEATURES ONLY) ====================

                    ...(createAuthSlice as SliceCreator<AuthSlice>)(set, get),
                    ...(createStudySlice as SliceCreator<StudySlice>)(set, get),
                    ...(createProgressSlice as SliceCreator<ProgressSlice>)(set, get),
                    ...(createPreferencesSlice as SliceCreator<PreferencesSlice>)(set, get),
                    ...(createContentSlice as SliceCreator<ContentSlice>)(set, get),
                }))
            ),
            persistConfig
        ),
        {
            name: 'xploar-store',
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);

// ==================== STORE SELECTORS ====================

// Performance-optimized selectors
export const useUser = () => useAppStore((state) => state.currentUser);
export const useIsProUser = () => useAppStore((state) => state.isProUser);
export const useActiveFeature = () => useAppStore((state) => state.activeFeature);
export const useStudyPlans = () => useAppStore((state) => state.studyPlans);
export const useCurrentStudyPlan = () => useAppStore((state) => state.currentStudyPlan);
export const useDailyStreak = () => useAppStore((state) => state.dailyStreak);
export const useRecommendations = () => useAppStore((state) => state.recommendations);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);

// Computed selectors
export const useIsAuthenticated = () => useAppStore((state) => !!state.currentUser);
export const useCompletedTasksCount = () => useAppStore((state) => {
    return state.studyPlans.reduce((total, plan) => {
        return total + (plan.tasks?.filter(task => task.isDone)?.length || 0);
    }, 0);
});

// ==================== STORE UTILITIES ====================

export const createStoreReset = () => {
    useAppStore.getState().reset();
};

export const getStoreSnapshot = () => {
    return { ...useAppStore.getState() };
};

export const subscribeToStoreChanges = (callback: (state: AppStore) => void) => {
    return useAppStore.subscribe(callback);
};

// ==================== DEVELOPMENT HELPERS ====================

if (process.env.NODE_ENV === 'development') {
    // Add store to window for debugging
    (window as { __XPLOAR_STORE__?: unknown }).__XPLOAR_STORE__ = useAppStore;

    // Log store changes in development
    useAppStore.subscribe((state) => {
        console.debug('Store updated:', {
            timestamp: new Date().toISOString(),
            activeFeature: state.activeFeature,
            userRole: state.userRole,
            isAuthenticated: !!state.currentUser,
        });
    });
}

// Export store instance for testing
export { useAppStore as store };
export default useAppStore;