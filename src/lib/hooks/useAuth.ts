import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { JWTService } from '@/lib/utils/jwt';
import { apiClient } from '@/lib/api/client';
import { authService } from '@/lib/api/auth';
import { RegistrationData } from '@/lib/types/auth';

export interface AuthUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
    lastLoginAt: string;
}

export interface UseAuthReturn {
    // State
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // JWT Info
    tokenInfo: {
        expiresIn: number;
        isExpiringSoon: boolean;
        isExpired: boolean;
    } | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    loginWithWhatsApp: (mobileNumber: string, otp: string) => Promise<void>;
    register: (userData: RegistrationData) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;

    // Role & Permission checks
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;

    // Utilities
    clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tokenInfo, setTokenInfo] = useState<{
        expiresIn: number;
        isExpiringSoon: boolean;
        isExpired: boolean;
    } | null>(null);

    const router = useRouter();

    // Initialize authentication state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setIsLoading(true);

                if (authService.isAuthenticated()) {
                    const currentUser = authService.getCurrentUser();
                    if (currentUser) {
                        // Transform to AuthUser format
                        const authUser: AuthUser = {
                            userId: currentUser.userId,
                            email: currentUser.email || '',
                            firstName: currentUser.firstName || '',
                            lastName: currentUser.lastName || '',
                            roles: currentUser.roles,
                            permissions: currentUser.permissions,
                            lastLoginAt: currentUser.lastLoginAt,
                        };

                        setUser(authUser);
                        setIsAuthenticated(true);

                        // Get token info
                        const token = apiClient.getAccessToken();
                        if (token) {
                            const expiresIn = JWTService.getTimeUntilExpiry(token);
                            const isExpired = JWTService.isTokenExpired(token);
                            const isExpiringSoon = JWTService.isTokenExpiringSoon(token, 5);

                            setTokenInfo({
                                expiresIn,
                                isExpiringSoon,
                                isExpired,
                            });

                            // Auto-refresh token if expiring soon
                            if (isExpiringSoon && !isExpired) {
                                await refreshToken();
                            }
                        }
                    } else {
                        // Invalid token, clear auth
                        await logout();
                    }
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                await logout();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Set up token expiration monitoring
    useEffect(() => {
        if (!tokenInfo) return;

        const interval = setInterval(async () => {
            const token = apiClient.getAccessToken();
            if (token) {
                const expiresIn = JWTService.getTimeUntilExpiry(token);
                const isExpired = JWTService.isTokenExpired(token);
                const isExpiringSoon = JWTService.isTokenExpiringSoon(token, 5);

                setTokenInfo({
                    expiresIn,
                    isExpiringSoon,
                    isExpired,
                });

                // Auto-refresh if expiring soon
                if (isExpiringSoon && !isExpired) {
                    await refreshToken();
                }

                // Logout if expired
                if (isExpired) {
                    await logout();
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [tokenInfo]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.login({ email, password });

            if (response.success && response.data) {
                const { user: apiUser, accessToken, refreshToken } = response.data;

                // Store tokens
                apiClient.setTokens(accessToken, refreshToken);

                // Transform user data
                const authUser: AuthUser = {
                    userId: apiUser.userId,
                    email: apiUser.email,
                    firstName: apiUser.firstName,
                    lastName: apiUser.lastName,
                    roles: apiUser.roles,
                    permissions: apiUser.permissions,
                    lastLoginAt: apiUser.lastLoginAt,
                };

                setUser(authUser);
                setIsAuthenticated(true);

                // Get token info
                const expiresIn = JWTService.getTimeUntilExpiry(accessToken);
                const isExpired = JWTService.isTokenExpired(accessToken);
                const isExpiringSoon = JWTService.isTokenExpiringSoon(accessToken, 5);

                setTokenInfo({
                    expiresIn,
                    isExpiringSoon,
                    isExpired,
                });

                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const loginWithWhatsApp = useCallback(async (mobileNumber: string, otp: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.verifyWhatsAppOTP({
                mobileNumber,
                countryCode: '+91',
                otp,
                purpose: 'LOGIN',
            });

            if (response.success && response.data) {
                const { user: apiUser, accessToken, refreshToken, isNewUser } = response.data;

                // Store tokens
                apiClient.setTokens(accessToken, refreshToken);

                // Transform user data
                const authUser: AuthUser = {
                    userId: apiUser.userId,
                    email: apiUser.email,
                    firstName: apiUser.firstName,
                    lastName: apiUser.lastName,
                    roles: apiUser.roles,
                    permissions: apiUser.permissions,
                    lastLoginAt: apiUser.lastLoginAt,
                };

                setUser(authUser);
                setIsAuthenticated(true);

                // Get token info
                const expiresIn = JWTService.getTimeUntilExpiry(accessToken);
                const isExpired = JWTService.isTokenExpired(accessToken);
                const isExpiringSoon = JWTService.isTokenExpiringSoon(accessToken, 5);

                setTokenInfo({
                    expiresIn,
                    isExpiringSoon,
                    isExpired,
                });

                // Redirect based on user status
                if (isNewUser) {
                    router.push('/onboarding');
                } else {
                    router.push('/dashboard');
                }
            } else {
                throw new Error(response.message || 'OTP verification failed');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const register = useCallback(async (userData: RegistrationData) => {
        try {
            setIsLoading(true);
            setError(null);

            // 1) Create account (backend does NOT return tokens on register)
            const response = await authService.register(userData);
            if (!response.success) {
                throw new Error(response.message || 'Registration failed');
            }

            // 2) Immediately login to obtain access/refresh tokens
            const loginResp = await authService.login({
                email: userData.email,
                password: userData.password,
            });

            if (loginResp.success && loginResp.data) {
                const { user: apiUser, accessToken } = loginResp.data;

                // Transform user data for state
                const authUser: AuthUser = {
                    userId: apiUser.userId,
                    email: apiUser.email,
                    firstName: apiUser.firstName,
                    lastName: apiUser.lastName,
                    roles: apiUser.roles,
                    permissions: apiUser.permissions,
                    lastLoginAt: apiUser.lastLoginAt,
                };

                setUser(authUser);
                setIsAuthenticated(true);

                // Token info for UI/state
                const expiresIn = JWTService.getTimeUntilExpiry(accessToken);
                const isExpired = JWTService.isTokenExpired(accessToken);
                const isExpiringSoon = JWTService.isTokenExpiringSoon(accessToken, 5);

                setTokenInfo({
                    expiresIn,
                    isExpiringSoon,
                    isExpired,
                });

                // Go to onboarding (now authenticated)
                router.push('/onboarding');
            } else {
                throw new Error(loginResp.message || 'Auto-login after registration failed');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            // Clear tokens
            apiClient.clearTokens();

            // Clear state
            setUser(null);
            setIsAuthenticated(false);
            setTokenInfo(null);
            setError(null);

            // Redirect to login
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Force redirect even if logout fails
            router.push('/auth/login');
        }
    }, [router]);

    const refreshToken = useCallback(async () => {
        try {
            const response = await authService.refreshTokens();

            if (response.success && response.data) {
                const { accessToken, expiresIn } = response.data;

                // Update token info
                const isExpired = JWTService.isTokenExpired(accessToken);
                const isExpiringSoon = JWTService.isTokenExpiringSoon(accessToken, 5);

                setTokenInfo({
                    expiresIn,
                    isExpiringSoon,
                    isExpired,
                });

                console.log('Token refreshed successfully');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, logout user
            await logout();
        }
    }, [logout]);

    const hasRole = useCallback((role: string): boolean => {
        return user?.roles.includes(role) || false;
    }, [user]);

    const hasPermission = useCallback((permission: string): boolean => {
        return user?.permissions.includes(permission) || false;
    }, [user]);

    const hasAnyRole = useCallback((roles: string[]): boolean => {
        return user ? roles.some(role => user.roles.includes(role)) : false;
    }, [user]);

    const hasAnyPermission = useCallback((permissions: string[]): boolean => {
        return user ? permissions.some(permission => user.permissions.includes(permission)) : false;
    }, [user]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        error,

        // JWT Info
        tokenInfo,

        // Actions
        login,
        loginWithWhatsApp,
        register,
        logout,
        refreshToken,

        // Role & Permission checks
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAnyPermission,

        // Utilities
        clearError,
    };
};
