import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { JWTService } from '@/lib/utils/jwt';
import { ApiResponse } from '@/lib/types';

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const TIMEOUT = 30000; // 30 seconds

// Cookie names
const ACCESS_TOKEN_COOKIE = 'xploar_access_token';
const REFRESH_TOKEN_COOKIE = 'xploar_refresh_token';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error?: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();

        if (token && !JWTService.isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (process.env.NODE_ENV === 'development') {
          const reqUrl = (error.config?.url ? `${BASE_URL}${error.config.url}` : 'unknown');
          // Log useful diagnostics for 4xx/5xx errors
          // Note: keep minimal to avoid leaking sensitive data
          // eslint-disable-next-line no-console
          console.error('API error', {
            method: error.config?.method,
            url: reqUrl,
            status: error.response?.status,
            response: error.response?.data
          });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh token endpoint
            const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
              refreshToken,
            });

            if (response.data.success) {
              const { accessToken } = response.data.data;

              // Store new tokens
              this.setAccessToken(accessToken);

              // Update Authorization header (ensure headers is defined)
              const headers = (originalRequest.headers ?? {}) as Record<string, string>;
              headers['Authorization'] = `Bearer ${accessToken}`;
              originalRequest.headers = headers;

              // Process queued requests
              this.processQueue(null, accessToken);

              // Retry original request
              return this.client(originalRequest);
            } else {
              throw new Error('Token refresh failed');
            }
          } catch (refreshError) {
            // Clear tokens and redirect to login
            this.clearTokens();
            this.processQueue(refreshError, null);

            // Redirect to login if in browser
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: unknown, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Token management methods
  public getAccessToken(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie =>
      cookie.trim().startsWith(`${ACCESS_TOKEN_COOKIE}=`)
    );

    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  public getRefreshToken(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie =>
      cookie.trim().startsWith(`${REFRESH_TOKEN_COOKIE}=`)
    );

    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  private setAccessToken(token: string) {
    if (typeof document === 'undefined') return;

    // Set cookie with proper security flags
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  }

  private setRefreshToken(token: string) {
    if (typeof document === 'undefined') return;

    // Set cookie with proper security flags
    document.cookie = `${REFRESH_TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;
  }

  public clearTokens() {
    if (typeof document === 'undefined') return;

    document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${REFRESH_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  public isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token ? !JWTService.isTokenExpired(token) : false;
  }

  public getTokenInfo() {
    const token = this.getAccessToken();
    if (!token) return null;

    return {
      userId: JWTService.getUserId(token),
      roles: JWTService.getRoles(token),
      permissions: JWTService.getPermissions(token),
      expiresIn: JWTService.getTimeUntilExpiry(token),
      isExpiringSoon: JWTService.isTokenExpiringSoon(token),
    };
  }

  // HTTP methods - Return API response data directly
  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
