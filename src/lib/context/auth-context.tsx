'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    AuthContextType,
    AuthState,
    User,
    UserProfile,
    OnboardingData,
    AuthTokens,
    WhatsAppOTPRequest,
    WhatsAppOTPVerifyRequest,
    WhatsAppOTPState
} from '@/lib/types/auth';
import { UserLoginData, UserRegistrationData } from '@/lib/api/auth';
import { authService } from '@/lib/api/auth';
import { userProfileService } from '@/lib/api/user-profile';
import { useRouter } from 'next/navigation';

const initialWhatsAppOTPState: WhatsAppOTPState = {
    isLoading: false,
    otpToken: null,
    expiresAt: null,
    error: null,
};

const initialState: AuthState = {
    user: null,
    profile: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isOnboardingComplete: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const [whatsappOTP, setWhatsAppOTP] = useState<WhatsAppOTPState>(initialWhatsAppOTPState);
    const router = useRouter();

    // Check for existing tokens on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check if user is authenticated using JWT service
                if (authService.isAuthenticated()) {
                    // Get current user from JWT token
                    const user = authService.getCurrentUser();
                    if (user) {
                        try {
                            // Get user profile
                            const profile = await userProfileService.getUserProfile();
                            setState(prev => ({
                                ...prev,
                                user,
                                profile,
                                tokens: authService.getStoredTokens(),
                                isAuthenticated: true,
                                isLoading: false,
                                // Existing users with profile are considered onboarding complete
                                isOnboardingComplete: !!profile,
                            }));
                        } catch (profileError) {
                            console.error('Failed to fetch user profile:', profileError);
                            // User exists but profile fetch failed, still consider authenticated
                            setState(prev => ({
                                ...prev,
                                user,
                                profile: null,
                                tokens: authService.getStoredTokens(),
                                isAuthenticated: true,
                                isLoading: false,
                                isOnboardingComplete: false,
                            }));
                        }
                    } else {
                        // Invalid token, clear storage
                        authService.logout();
                        setState(prev => ({ ...prev, isLoading: false }));
                    }
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authService.logout();
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials: UserLoginData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await authService.login(credentials);

            if (response.success && response.data) {
                const { user: apiUser, accessToken, refreshToken, tokenType, expiresIn } = response.data;

                const tokens: AuthTokens = {
                    accessToken,
                    refreshToken,
                    tokenType,
                    expiresIn,
                };

                // Transform API user data to match our User interface
                const user: User = {
                    userId: apiUser.userId,
                    email: apiUser.email,
                    firstName: apiUser.firstName,
                    lastName: apiUser.lastName,
                    roles: apiUser.roles,
                    permissions: apiUser.permissions,
                    lastLoginAt: apiUser.lastLoginAt,
                    // Backend will generate createdAt and updatedAt
                    // isEmailVerified and isMobileVerified will be updated from profile
                };

                // Get user profile
                const profile = await userProfileService.getUserProfile();

                // For existing users, assume onboarding is complete
                // Only new users (without profile) should go through onboarding
                const isOnboardingComplete = !!profile;

                setState(prev => ({
                    ...prev,
                    user,
                    profile,
                    tokens,
                    isAuthenticated: true,
                    isLoading: false,
                    isOnboardingComplete,
                }));

                // Redirect based on profile existence
                if (profile) {
                    // Existing user with profile - go to dashboard
                    router.push('/dashboard');
                } else {
                    // New user without profile - go to onboarding
                    router.push('/onboarding');
                }
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: unknown) {
            let errorMessage = 'Login failed';

            if (error instanceof Error && error.message) {
                if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    errorMessage = 'Invalid email or password. Please try again.';
                } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
                    errorMessage = 'Too many login attempts. Please wait a moment and try again.';
                } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error.message.includes('Network Error') || error.message.includes('fetch')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                } else {
                    errorMessage = error.message;
                }
            }

            setState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
            }));
            throw error;
        }
    };

    const register = async (data: UserRegistrationData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await authService.register(data);

            if (response.success) {
                // After successful registration, redirect to onboarding
                router.push('/onboarding');
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: unknown) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Registration failed',
                isLoading: false,
            }));
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setState(initialState);
        router.push('/auth/login');
    };

    const updateProfile = async (profileData: Partial<UserProfile>) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const updatedProfile = await userProfileService.updateUserProfile(profileData);

            setState(prev => ({
                ...prev,
                profile: updatedProfile,
                isLoading: false,
            }));
        } catch (error: unknown) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Profile update failed',
                isLoading: false,
            }));
            throw error;
        }
    };

    const completeOnboarding = async (data: OnboardingData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // Create study plan with onboarding data
            await userProfileService.completeOnboarding(data);

            setState(prev => ({
                ...prev,
                isOnboardingComplete: true,
                isLoading: false,
            }));

            // Redirect to dashboard after onboarding
            router.push('/dashboard');
        } catch (error: unknown) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Onboarding failed',
                isLoading: false,
            }));
            throw error;
        }
    };

    const refreshTokens = async () => {
        try {
            const response = await authService.refreshTokens();
            if (response.success && response.data) {
                const { accessToken, expiresIn } = response.data;

                // Get current refresh token
                const currentRefreshToken = authService.getStoredTokens()?.refreshToken;

                if (currentRefreshToken) {
                    const newTokens: AuthTokens = {
                        accessToken,
                        refreshToken: currentRefreshToken,
                        tokenType: 'Bearer',
                        expiresIn,
                    };

                    setState(prev => ({
                        ...prev,
                        tokens: newTokens,
                    }));
                }
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    // WhatsApp OTP methods
    const sendWhatsAppOTP = async (request: WhatsAppOTPRequest) => {
        try {
            setWhatsAppOTP(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await authService.sendWhatsAppOTP(request);

            if (response.success && response.data) {
                setWhatsAppOTP(prev => ({
                    ...prev,
                    isLoading: false,
                    otpToken: response.data.otpToken,
                    expiresAt: response.data.expiresAt,
                }));
            } else {
                throw new Error(response.message || 'Failed to send OTP');
            }
        } catch (error: unknown) {
            setWhatsAppOTP(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to send OTP',
            }));
            throw error;
        }
    };

    const verifyWhatsAppOTP = async (request: WhatsAppOTPVerifyRequest) => {
        try {
            setWhatsAppOTP(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await authService.verifyWhatsAppOTP(request);

            if (response.success && response.data) {
                const { user: apiUser, accessToken, refreshToken, tokenType, expiresIn, isNewUser } = response.data;

                const tokens: AuthTokens = {
                    accessToken,
                    refreshToken,
                    tokenType,
                    expiresIn,
                };

                // Transform API user data to match our User interface
                const user: User = {
                    userId: apiUser.userId,
                    email: apiUser.email,
                    firstName: apiUser.firstName,
                    lastName: apiUser.lastName,
                    roles: apiUser.roles,
                    permissions: apiUser.permissions,
                    lastLoginAt: apiUser.lastLoginAt,
                    // Backend will generate createdAt and updatedAt
                    // isEmailVerified and isMobileVerified will be updated from profile
                };

                // Get user profile
                const profile = await userProfileService.getUserProfile();

                setState(prev => ({
                    ...prev,
                    user,
                    profile,
                    tokens,
                    isAuthenticated: true,
                    isLoading: false,
                    // If it's a new user, they need onboarding
                    isOnboardingComplete: !isNewUser && !!profile,
                }));

                setWhatsAppOTP(initialWhatsAppOTPState);

                // Redirect based on user status
                if (isNewUser || !profile) {
                    // New user - go to onboarding
                    router.push('/onboarding');
                } else {
                    // Existing user - go to dashboard
                    router.push('/dashboard');
                }
            } else {
                throw new Error(response.message || 'OTP verification failed');
            }
        } catch (error: unknown) {
            setWhatsAppOTP(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'OTP verification failed',
            }));
            throw error;
        }
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        refreshTokens,
        clearError,
        sendWhatsAppOTP,
        verifyWhatsAppOTP,
        whatsappOTP,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
