/**
 * Authentication Store Slice
 * Handles user authentication, session management, and security
 */

import type { StateCreator } from 'zustand';
import type { User } from '@/lib/types';
import { ErrorHandler } from '@/lib/utils/errorHandler';
import { sanitizeUserInput } from '@/lib/utils/validation';
import { authService } from '@/lib/services/auth.service';

export interface AuthSlice {
    // State
    currentUser: User | null;
    isProUser: boolean;
    userRole: 'student' | 'mentor' | 'admin';
    isAuthenticating: boolean;
    sessionExpiry: string | null;

    // Actions
    signIn: (email: string, name: string) => void;
    signOut: () => Promise<void>;
    upgradeToPro: () => void;
    downgradeFromPro: () => void;
    switchRole: () => void;
    refreshSession: () => Promise<boolean>;
    updateUserProfile: (updates: Partial<User>) => void;
}

export const createAuthSlice: StateCreator<
    AuthSlice,
    [],
    [],
    AuthSlice
> = (set, get) => ({
    // State
    currentUser: null,
    isProUser: false,
    userRole: 'student',
    isAuthenticating: false,
    sessionExpiry: null,

    // Actions
    signIn: (email: string, name: string) => {
        try {
            set({
                isAuthenticating: true,
            });

            const user: User = {
                userId: `user_${Date.now()}`,
                email: sanitizeUserInput(email),
                firstName: sanitizeUserInput(name),
                lastName: '',
                roles: ['student'],
                permissions: [],
                lastLoginAt: new Date().toISOString(),
            };

            set({
                currentUser: user,
                isAuthenticating: false,
                sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            });
        } catch (error) {
            ErrorHandler.logError(error, 'Sign in error');
            set({ isAuthenticating: false });
            throw error;
        }
    },

    signOut: async () => {
        try {
            set({ isAuthenticating: true });

            // Call backend logout if user is authenticated
            if (get().currentUser) {
                try {
                    // Call logout API if available
                    // await authService.logout();
                } catch (error) {
                    // Continue with local logout even if backend fails
                    ErrorHandler.logError(error, 'Backend logout failed');
                }
            }

            set({
                currentUser: null,
                isProUser: false,
                userRole: 'student',
                isAuthenticating: false,
                sessionExpiry: null,
            });
        } catch (error) {
            ErrorHandler.logError(error, 'Sign out error');
            set({ isAuthenticating: false });
            throw error;
        }
    },

    upgradeToPro: () => {
        set({ isProUser: true });
    },

    downgradeFromPro: () => {
        set({ isProUser: false });
    },

    switchRole: () => {
        const roles = ['student', 'mentor', 'admin'] as const;
        const currentRole = get().userRole;
        const nextRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];
        set({ userRole: nextRole });
    },

    refreshSession: async () => {
        try {
            const currentUser = get().currentUser;
            if (!currentUser) return false;

            // Check if session is still valid
            const sessionExpiry = get().sessionExpiry;
            if (sessionExpiry && new Date(sessionExpiry) > new Date()) {
                return true;
            }

            // Attempt to refresh session
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                set({
                    sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });
                return true;
            }

            // Session could not be refreshed, sign out
            await get().signOut();
            return false;
        } catch (error) {
            ErrorHandler.logError(error, 'Session refresh error');
            return false;
        }
    },

    updateUserProfile: (updates: Partial<User>) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        try {
            // Sanitize input with proper typing
            const sanitizedUpdates: Partial<User> = {};

            // Type-safe property assignment
            for (const [key, value] of Object.entries(updates)) {
                if (key in currentUser) {
                    if (typeof value === 'string') {
                        (sanitizedUpdates as Record<string, unknown>)[key] = sanitizeUserInput(value);
                    } else {
                        (sanitizedUpdates as Record<string, unknown>)[key] = value;
                    }
                }
            }

            set({
                currentUser: {
                    ...currentUser,
                    ...sanitizedUpdates,
                },
            });
        } catch (error) {
            ErrorHandler.logError(error, 'Profile update error');
            throw error;
        }
    },
});
