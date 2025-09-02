import { useState, useEffect, useCallback } from 'react';
import { JWTService } from '@/lib/utils/jwt';
import { apiClient } from '@/lib/api/client';

export interface JWTInfo {
    userId: string | null;
    roles: string[];
    permissions: string[];
    expiresIn: number;
    isExpiringSoon: boolean;
    isExpired: boolean;
}

export const useJWT = () => {
    const [jwtInfo, setJwtInfo] = useState<JWTInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const updateJWTInfo = useCallback(() => {
        const token = apiClient.getAccessToken();

        if (!token) {
            setJwtInfo(null);
            setIsLoading(false);
            return;
        }

        try {
            const payload = JWTService.decodeToken(token);
            if (!payload) {
                setJwtInfo(null);
                setIsLoading(false);
                return;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const expiresIn = Math.max(0, payload.exp - currentTime);
            const isExpired = payload.exp < currentTime;
            const isExpiringSoon = JWTService.isTokenExpiringSoon(token, 5);

            setJwtInfo({
                userId: payload.sub,
                roles: payload.roles,
                permissions: payload.permissions,
                expiresIn,
                isExpiringSoon,
                isExpired,
            });
        } catch (error) {
            console.error('Failed to decode JWT token:', error);
            setJwtInfo(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update JWT info when component mounts
    useEffect(() => {
        updateJWTInfo();
    }, [updateJWTInfo]);

    // Set up interval to check token expiration
    useEffect(() => {
        if (!jwtInfo) return;

        const interval = setInterval(() => {
            updateJWTInfo();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [jwtInfo, updateJWTInfo]);

    // Utility functions
    const hasRole = useCallback((role: string): boolean => {
        return jwtInfo?.roles.includes(role) || false;
    }, [jwtInfo]);

    const hasPermission = useCallback((permission: string): boolean => {
        return jwtInfo?.permissions.includes(permission) || false;
    }, [jwtInfo]);

    const hasAnyRole = useCallback((roles: string[]): boolean => {
        return jwtInfo ? roles.some(role => jwtInfo.roles.includes(role)) : false;
    }, [jwtInfo]);

    const hasAnyPermission = useCallback((permissions: string[]): boolean => {
        return jwtInfo ? permissions.some(permission => jwtInfo.permissions.includes(permission)) : false;
    }, [jwtInfo]);

    const isAuthenticated = useCallback((): boolean => {
        return apiClient.isAuthenticated();
    }, []);

    const getTokenInfo = useCallback(() => {
        return apiClient.getTokenInfo();
    }, []);

    return {
        jwtInfo,
        isLoading,
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAnyPermission,
        isAuthenticated,
        getTokenInfo,
        updateJWTInfo,
    };
};
