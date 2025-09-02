// JWT Utility Functions
export interface JWTPayload {
    sub: string;           // User ID
    iss: string;           // Issuer (xploar.ai)
    aud: string;           // Audience (xploar-users)
    exp: number;           // Expiration time
    iat: number;           // Issued at time
    roles: string[];       // User roles
    permissions: string[]; // User permissions
}

export class JWTService {
    /**
     * Decode JWT token without verification (client-side only)
     * Note: This doesn't verify the signature, only decodes the payload
     */
    static decodeToken(token: string): JWTPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to decode JWT token:', error);
            return null;
        }
    }

    /**
     * Check if JWT token is expired
     */
    static isTokenExpired(token: string): boolean {
        const payload = this.decodeToken(token);
        if (!payload) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    }

    /**
     * Check if JWT token will expire soon (within specified minutes)
     */
    static isTokenExpiringSoon(token: string, bufferMinutes: number = 5): boolean {
        const payload = this.decodeToken(token);
        if (!payload) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        const bufferTime = bufferMinutes * 60;
        return payload.exp < (currentTime + bufferTime);
    }

    /**
     * Get time until token expires in seconds
     */
    static getTimeUntilExpiry(token: string): number {
        const payload = this.decodeToken(token);
        if (!payload) return 0;

        const currentTime = Math.floor(Date.now() / 1000);
        return Math.max(0, payload.exp - currentTime);
    }

    /**
     * Extract user ID from JWT token
     */
    static getUserId(token: string): string | null {
        const payload = this.decodeToken(token);
        return payload?.sub || null;
    }

    /**
     * Extract roles from JWT token
     */
    static getRoles(token: string): string[] {
        const payload = this.decodeToken(token);
        return payload?.roles || [];
    }

    /**
     * Extract permissions from JWT token
     */
    static getPermissions(token: string): string[] {
        const payload = this.decodeToken(token);
        return payload?.permissions || [];
    }

    /**
     * Check if user has specific role
     */
    static hasRole(token: string, role: string): boolean {
        const roles = this.getRoles(token);
        return roles.includes(role);
    }

    /**
     * Check if user has specific permission
     */
    static hasPermission(token: string, permission: string): boolean {
        const permissions = this.getPermissions(token);
        return permissions.includes(permission);
    }

    /**
     * Check if user has any of the specified roles
     */
    static hasAnyRole(token: string, roles: string[]): boolean {
        const userRoles = this.getRoles(token);
        return roles.some(role => userRoles.includes(role));
    }

    /**
     * Check if user has any of the specified permissions
     */
    static hasAnyPermission(token: string, permissions: string[]): boolean {
        const userPermissions = this.getPermissions(token);
        return permissions.some(permission => userPermissions.includes(permission));
    }

    /**
     * Validate JWT token format (basic validation)
     */
    static isValidFormat(token: string): boolean {
        if (!token || typeof token !== 'string') return false;

        const parts = token.split('.');
        return parts.length === 3;
    }

    /**
     * Get token age in seconds
     */
    static getTokenAge(token: string): number {
        const payload = this.decodeToken(token);
        if (!payload) return 0;

        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime - payload.iat;
    }

    /**
     * Check if token is fresh (issued within last 5 minutes)
     */
    static isTokenFresh(token: string, maxAgeMinutes: number = 5): boolean {
        const age = this.getTokenAge(token);
        return age < (maxAgeMinutes * 60);
    }
}
