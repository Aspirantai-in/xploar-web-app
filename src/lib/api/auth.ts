import { apiClient } from './client';
import { User, AuthTokens } from '@/lib/types/auth';
import { JWTService } from '@/lib/utils/jwt';

// Types based on api-doc.md exactly
export interface UserRegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  mobileNumber?: string;
  countryCode?: string;
  preferences: {
    timezone: string;
    language: string;
    notificationSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface UserLoginData {
  email: string;
  password: string;
  deviceInfo?: {
    deviceId?: string;
    deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET';
    os?: string;
    osVersion?: string;
  };
}

// API Response Types - to match actual API structure
export interface ApiUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  lastLoginAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: ApiUser;
  };
  timestamp: string;
  requestId: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    verificationToken: string;
    expiresAt: string;
  };
  timestamp: string;
  requestId: string;
}

export interface TokenRefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
  };
  timestamp: string;
  requestId: string;
}

// WhatsApp OTP Types (not in api-doc.md but needed for the new flow)
export interface WhatsAppOTPRequest {
  mobileNumber: string;
  countryCode: string;
  purpose: 'REGISTRATION' | 'LOGIN';
}

export interface WhatsAppOTPVerifyRequest {
  mobileNumber: string;
  countryCode: string;
  otp: string;
  purpose: 'REGISTRATION' | 'LOGIN';
}

export interface WhatsAppOTPResponse {
  success: boolean;
  message: string;
  data: {
    otpToken: string;
    expiresAt: string;
  };
  timestamp: string;
  requestId: string;
}

export interface WhatsAppOTPVerifyResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
      permissions: string[];
      lastLoginAt: string;
    };
    isNewUser: boolean;
  };
  timestamp: string;
  requestId: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  data: {
    resetToken: string;
    expiresAt: string;
  };
  timestamp: string;
  requestId: string;
}

export interface PasswordResetConfirmRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetConfirmResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
  };
  timestamp: string;
  requestId: string;
}

export interface LogoutRequest {
  refreshToken?: string;
  deviceId?: string;
  reason?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: {
    loggedOutAt: string;
    sessionEnded: boolean;
  };
  timestamp: string;
  requestId: string;
}

export class AuthService {
  /**
   * User registration
   */
  async register(data: UserRegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await apiClient.post<{
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        isEmailVerified: boolean;
        isMobileVerified: boolean;
        verificationToken: string;
        expiresAt: string;
      }>('/api/auth/register', data);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      console.log('Registration successful:', response.message);
      return {
        success: true,
        message: response.message || 'Registration successful',
        data: response.data,
        timestamp: response.timestamp,
        requestId: response.requestId
      };
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * User login with email/password
   */
  async login(credentials: UserLoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
        user: {
          userId: string;
          email: string;
          firstName: string;
          lastName: string;
          roles: string[];
          permissions: string[];
          lastLoginAt: string;
        };
      }>('/api/auth/login', credentials);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { accessToken, refreshToken } = response.data;

      // Store JWT tokens securely
      apiClient.setTokens(accessToken, refreshToken);

      // Validate JWT token
      const tokenInfo = JWTService.decodeToken(accessToken);
      if (!tokenInfo) {
        throw new Error('Invalid JWT token received');
      }

      console.log('Login successful, JWT token validated');
      console.log('Token expires in:', JWTService.getTimeUntilExpiry(accessToken), 'seconds');
      console.log('User roles:', JWTService.getRoles(accessToken));
      console.log('User permissions:', JWTService.getPermissions(accessToken));

      return {
        success: true,
        message: response.message || 'Login successful',
        data: response.data,
        timestamp: response.timestamp,
        requestId: response.requestId
      };
    } catch (error: unknown) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * WhatsApp OTP send
   */
  async sendWhatsAppOTP(request: WhatsAppOTPRequest): Promise<WhatsAppOTPResponse> {
    try {
      const response = await apiClient.post<{
        otpToken: string;
        expiresAt: string;
      }>('/api/auth/whatsapp/send-otp', request);

      if (!response.success) {
        throw new Error(response.message || 'Failed to send OTP');
      }

      return {
        success: true,
        message: response.message || 'OTP sent successfully',
        data: response.data,
        timestamp: response.timestamp,
        requestId: response.requestId
      };
    } catch (error: unknown) {
      console.error('WhatsApp OTP send failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to send OTP');
    }
  }

  /**
   * WhatsApp OTP verify
   */
  async verifyWhatsAppOTP(request: WhatsAppOTPVerifyRequest): Promise<WhatsAppOTPVerifyResponse> {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
        user: {
          userId: string;
          email: string;
          firstName: string;
          lastName: string;
          roles: string[];
          permissions: string[];
          lastLoginAt: string;
        };
        isNewUser: boolean;
      }>('/api/auth/whatsapp/verify-otp', request);

      if (!response.success) {
        throw new Error(response.message || 'OTP verification failed');
      }

      const { accessToken, refreshToken } = response.data;

      // Store JWT tokens securely
      apiClient.setTokens(accessToken, refreshToken);

      // Validate JWT token
      const tokenInfo = JWTService.decodeToken(accessToken);
      if (!tokenInfo) {
        throw new Error('Invalid JWT token received');
      }

      console.log('WhatsApp OTP verification successful, JWT token validated');
      console.log('Token expires in:', JWTService.getTimeUntilExpiry(accessToken), 'seconds');
      console.log('User roles:', JWTService.getRoles(accessToken));
      console.log('User permissions:', JWTService.getPermissions(accessToken));

      return {
        success: true,
        message: response.message || 'OTP verification successful',
        data: response.data,
        timestamp: response.timestamp,
        requestId: response.requestId
      };
    } catch (error: unknown) {
      console.error('WhatsApp OTP verification failed:', error);
      throw new Error(error instanceof Error ? error.message : 'OTP verification failed');
    }
  }

  /**
   * Refresh JWT tokens
   */
  async refreshTokens(): Promise<TokenRefreshResponse> {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        expiresIn: number;
      }>('/api/auth/refresh', {});

      if (!response.success) {
        throw new Error(response.message || 'Token refresh failed');
      }

      const { accessToken } = response.data;

      // Update access token
      apiClient.setTokens(accessToken, apiClient.getRefreshToken() || '');

      console.log('Tokens refreshed successfully');
      console.log('New token expires in:', JWTService.getTimeUntilExpiry(accessToken), 'seconds');

      return {
        success: true,
        message: response.message || 'Tokens refreshed successfully',
        data: response.data,
        timestamp: response.timestamp,
        requestId: response.requestId
      };
    } catch (error: unknown) {
      console.error('Token refresh failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Token refresh failed');
    }
  }

  /**
   * Get stored JWT tokens
   */
  getStoredTokens(): AuthTokens | null {
    try {
      const accessToken = apiClient.getAccessToken();
      const refreshToken = apiClient.getRefreshToken();

      if (!accessToken || !refreshToken) return null;

      // Get token info to determine expiration
      const tokenInfo = apiClient.getTokenInfo();
      if (!tokenInfo) return null;

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: tokenInfo.expiresIn,
      };
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      return null;
    }
  }

  /**
   * Get current user from JWT token
   */
  getCurrentUser(): User | null {
    try {
      const tokenInfo = apiClient.getTokenInfo();
      if (!tokenInfo) return null;

      // Extract user info from JWT token
      const token = apiClient.getAccessToken();
      if (!token) return null;

      return {
        userId: tokenInfo.userId || '',
        email: '', // Email not in JWT payload, would need to fetch from profile
        firstName: '', // Name not in JWT payload, would need to fetch from profile
        lastName: '',
        roles: tokenInfo.roles,
        permissions: tokenInfo.permissions,
        lastLoginAt: new Date().toISOString(),
        // Other fields would be populated from user profile
      };
    } catch (error) {
      console.error('Failed to get current user from JWT:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const token = apiClient.getAccessToken();
    return token ? JWTService.hasRole(token, role) : false;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const token = apiClient.getAccessToken();
    return token ? JWTService.hasPermission(token, permission) : false;
  }

  /**
   * Request password reset
   */
  async resetPassword(request: PasswordResetRequest): Promise<PasswordResetResponse> {
    try {
      const response = await apiClient.post<{
        resetToken: string;
        expiresAt: string;
      }>('/api/auth/reset-password', request);

      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }

      console.log('Password reset request successful');
      return {
        success: true,
        message: response.message || 'Password reset link sent successfully',
        data: response.data,
        timestamp: response.timestamp,
        requestId: response.requestId
      };
    } catch (error: unknown) {
      console.error('Password reset request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Password reset request failed');
    }
  }

  /**
   * Confirm password reset with new password
   */
  async confirmPasswordReset(request: PasswordResetConfirmRequest): Promise<PasswordResetConfirmResponse> {
    try {
      const response = await apiClient.post<{
        userId: string;
        email: string;
      }>('/api/auth/confirm-reset', request);

      if (!response.success) {
        throw new Error(response.message || 'Password reset confirmation failed');
      }

      console.log('Password reset confirmed successfully');
      return {
        success: true,
        message: response.message || 'Password reset successful',
        data: response.data,
        timestamp: response.timestamp,
        requestId: response.requestId
      };
    } catch (error: unknown) {
      console.error('Password reset confirmation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Password reset confirmation failed');
    }
  }

  /**
   * Logout user from backend
   */
  async logoutFromBackend(request?: LogoutRequest): Promise<LogoutResponse> {
    try {
      const logoutData = {
        deviceId: request?.deviceId || 'web',
        reason: request?.reason || 'USER_INITIATED'
      };

      const response = await apiClient.post<{
        loggedOutAt: string;
        sessionEnded: boolean;
      }>('/api/auth/logout', logoutData);

      if (!response.success) {
        console.warn('Backend logout failed, but proceeding with local cleanup');
      }

      // Always clear local tokens and state
      this.logoutLocal();

      return {
        success: true,
        message: response.message || 'Logout successful',
        data: response.data || {
          loggedOutAt: new Date().toISOString(),
          sessionEnded: true
        },
        timestamp: response.timestamp || new Date().toISOString(),
        requestId: response.requestId || 'local_logout'
      };
    } catch (error: unknown) {
      console.error('Backend logout failed:', error);

      // Even if backend fails, clear local state
      this.logoutLocal();

      return {
        success: true,
        message: 'Logged out locally (backend unavailable)',
        data: {
          loggedOutAt: new Date().toISOString(),
          sessionEnded: true
        },
        timestamp: new Date().toISOString(),
        requestId: 'local_logout_fallback'
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.logoutLocal();
  }

  /**
   * Local logout cleanup
   */
  private logoutLocal(): void {
    apiClient.clearTokens();
    console.log('User logged out, tokens cleared');
  }

  /**
   * Get token information
   */
  getTokenInfo() {
    return apiClient.getTokenInfo();
  }
}

// Export singleton instance
export const authService = new AuthService();
