import { apiClient } from './client';

// Types based on api-doc.md exactly
export interface UserRegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  mobileNumber: string;
  countryCode: string;
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
  deviceInfo: {
    deviceId: string;
    deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET';
    os: string;
    osVersion: string;
  };
}

export interface AuthResponse {
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

export class AuthService {
  async register(userData: UserRegistrationData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Registration failed');
    }
  }

  async login(loginData: UserLoginData) {
    try {
      const response = await apiClient.post('/api/auth/login', loginData);

      if (response.success && response.data) {
        apiClient.setAccessToken(response.data.accessToken);
        apiClient.setRefreshToken(response.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    }
  }

  async logout() {
    try {
      apiClient.clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      apiClient.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/api/user-profile');
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    try {
      const response = await apiClient.post('/api/auth/refresh');
      if (response.success && response.data) {
        const { accessToken, refreshToken, tokenType, expiresIn } = response.data;
        apiClient.setAccessToken(accessToken);
        apiClient.setRefreshToken(refreshToken);

        return {
          accessToken,
          refreshToken,
          tokenType,
          expiresIn,
        };
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  getStoredTokens(): AuthTokens | null {
    const accessToken = apiClient.getAccessToken();
    const refreshToken = apiClient.getRefreshToken();

    if (accessToken && refreshToken) {
      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 3600, // Default value
      };
    }
    return null;
  }

  clearTokens(): void {
    apiClient.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!apiClient.getAccessToken();
  }

  // WhatsApp OTP methods (new for WhatsApp authentication)
  async sendWhatsAppOTP(request: WhatsAppOTPRequest): Promise<WhatsAppOTPResponse> {
    try {
      const response = await apiClient.post('/api/auth/whatsapp/send-otp', request);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to send WhatsApp OTP');
    }
  }

  async verifyWhatsAppOTP(request: WhatsAppOTPVerifyRequest): Promise<WhatsAppOTPVerifyResponse> {
    try {
      const response = await apiClient.post('/api/auth/whatsapp/verify-otp', request);

      if (response.success && response.data) {
        apiClient.setAccessToken(response.data.accessToken);
        apiClient.setRefreshToken(response.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw this.handleError(error, 'OTP verification failed');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.error?.message) {
      return new Error(error.response.data.error.message);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }
}

export const authService = new AuthService();
