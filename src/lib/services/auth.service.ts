import { AuthService as ApiAuthService } from '../api/auth';
import { COOKIE_NAMES } from '../constants';
import Cookies from 'js-cookie';

export class AuthService {
  private static instance: AuthService;
  private apiService: ApiAuthService;

  private constructor() {
    this.apiService = new ApiAuthService();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const response = await this.apiService.register(userData);
      
      if (response.success) {
        // Auto-login after successful registration
        await this.login({
          email: userData.email,
          password: userData.password,
        });
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user
   */
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await this.apiService.login(credentials);
      
      if (response.success && response.data) {
        // Store tokens securely
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        
        // Store user info in memory (not localStorage for security)
        this.setUserInfo(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout API to invalidate tokens on server
      await this.apiService.logout();
    } catch (error) {
      // Continue with local cleanup even if API call fails
      console.warn('Logout API call failed, continuing with local cleanup:', error);
    } finally {
      // Clear local tokens and user data
      this.clearTokens();
      this.clearUserInfo();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await this.apiService.refreshToken(refreshToken);
      
      if (response.success && response.data) {
        this.setAccessToken(response.data.accessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      // If refresh fails, clear tokens and force re-login
      this.clearTokens();
      this.clearUserInfo();
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return !!accessToken && !this.isTokenExpired(accessToken);
  }

  /**
   * Get current user info
   */
  getUserInfo() {
    // This would typically come from a secure context or memory
    // For now, we'll return null and implement proper user context later
    return null;
  }

  /**
   * Set tokens securely
   */
  private setTokens(accessToken: string, refreshToken: string) {
    // Set HTTP-only cookies for security
    Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 1, // 1 day
    });
    
    Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 7, // 7 days
    });
  }

  /**
   * Set access token only
   */
  private setAccessToken(accessToken: string) {
    Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 1, // 1 day
    });
  }

  /**
   * Get access token
   */
  private getAccessToken(): string | undefined {
    return Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
  }

  /**
   * Get refresh token
   */
  private getRefreshToken(): string | undefined {
    return Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
  }

  /**
   * Clear all tokens
   */
  private clearTokens() {
    Cookies.remove(COOKIE_NAMES.ACCESS_TOKEN);
    Cookies.remove(COOKIE_NAMES.REFRESH_TOKEN);
  }

  /**
   * Set user info in memory
   */
  private setUserInfo(user: any) {
    // This would be implemented with a proper user context
    // For now, we'll store in sessionStorage as a temporary solution
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('xploar_user_info', JSON.stringify(user));
    }
  }

  /**
   * Clear user info
   */
  private clearUserInfo() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('xploar_user_info');
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || 'Authentication failed');
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
