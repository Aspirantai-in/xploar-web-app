/**
 * User Preferences Store Slice
 * Handles user settings, preferences, and configuration
 */

import type { StateCreator } from 'zustand';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        push: boolean;
        studyReminders: boolean;
        achievementAlerts: boolean;
    };
    study: {
        defaultStudyHours: number;
        preferredBreakDuration: number;
        autoStartTimer: boolean;
        showProgressAnimation: boolean;
    };
    privacy: {
        shareProgress: boolean;
        publicProfile: boolean;
        allowAnalytics: boolean;
    };
}

export interface PreferencesSlice {
    // State
    preferences: UserPreferences;

    // Actions
    updatePreferences: (updates: Partial<UserPreferences>) => void;
    resetPreferences: () => void;
    getPreference: <K extends keyof UserPreferences>(key: K) => UserPreferences[K];
    setNotificationPreference: (type: keyof UserPreferences['notifications'], enabled: boolean) => void;
    updateStudyPreferences: (updates: Partial<UserPreferences['study']>) => void;
}

const defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
        email: true,
        push: true,
        studyReminders: true,
        achievementAlerts: true,
    },
    study: {
        defaultStudyHours: 4,
        preferredBreakDuration: 15,
        autoStartTimer: false,
        showProgressAnimation: true,
    },
    privacy: {
        shareProgress: false,
        publicProfile: false,
        allowAnalytics: true,
    },
};

export const createPreferencesSlice: StateCreator<
    PreferencesSlice,
    [],
    [],
    PreferencesSlice
> = (set, get) => ({
    // State
    preferences: defaultPreferences,

    // Actions
    updatePreferences: (updates: Partial<UserPreferences>) => {
        try {
            set((state) => ({
                preferences: {
                    ...state.preferences,
                    ...updates,
                },
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Update preferences error');
            throw error;
        }
    },

    resetPreferences: () => {
        set({ preferences: defaultPreferences });
    },

    getPreference: <K extends keyof UserPreferences>(key: K): UserPreferences[K] => {
        return get().preferences[key];
    },

    setNotificationPreference: (type: keyof UserPreferences['notifications'], enabled: boolean) => {
        try {
            set((state) => ({
                preferences: {
                    ...state.preferences,
                    notifications: {
                        ...state.preferences.notifications,
                        [type]: enabled,
                    },
                },
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Set notification preference error');
            throw error;
        }
    },

    updateStudyPreferences: (updates: Partial<UserPreferences['study']>) => {
        try {
            set((state) => ({
                preferences: {
                    ...state.preferences,
                    study: {
                        ...state.preferences.study,
                        ...updates,
                    },
                },
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Update study preferences error');
            throw error;
        }
    },
});
