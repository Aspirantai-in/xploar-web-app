/**
 * UNIFIED API CLIENT - Single Source of Truth for Backend Communication
 * Production-ready client with proper error handling, retries, and type safety
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
    ApiResponse,
    User,
    StudyPlan,
    Task,
    DailyPlan,
    CreateStudyPlanRequest,
    CreateTaskRequest,
    UpdateTaskRequest,
    CompleteTaskRequest,
    DeferTaskRequest,
    LoginCredentials,
    RegistrationData,
    AuthTokens
} from '@/lib/types';
import {
    createApiError,
    createNetworkError,
    createAuthError,
    getErrorMessage
} from '@/lib/types/errors';

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;



class UnifiedApiClient {
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
                if (token && !config.skipAuth) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - Handle auth and errors
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return this.queueRequest(originalRequest);
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        await this.refreshToken();
                        this.processQueue(null);
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.processQueue(refreshError);
                        this.clearTokens();
                        throw createAuthError('Session expired. Please log in again.', 'TOKEN_EXPIRED');
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(this.handleError(error));
            }
        );
    }

    private async queueRequest(): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
        });
    }

    private processQueue(error: unknown) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(undefined);
            }
        });

        this.failedQueue = [];
    }

    private handleError(error: unknown) {
        // Type guard for AxiosError
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error status
                const { status, data, config } = error.response;
                return createApiError(
                    data?.message || `HTTP ${status} Error`,
                    status,
                    config?.url || 'unknown',
                    config?.method || 'unknown'
                );
            } else if (error.request) {
                // Network error
                return createNetworkError(
                    'Network error. Please check your connection.',
                    !navigator.onLine,
                    true
                );
            }
        }
        
        // Something else
        return createApiError(getErrorMessage(error), 500, 'unknown', 'unknown');
    }

    private async retryRequest<T>(
        request: () => Promise<T>,
        retries: number = MAX_RETRIES
    ): Promise<T> {
        try {
            return await request();
        } catch (error: unknown) {
            if (retries > 0 && this.isRetryableError(error)) {
                await this.delay(1000 * (MAX_RETRIES - retries + 1));
                return this.retryRequest(request, retries - 1);
            }
            throw error;
        }
    }

    private isRetryableError(error: unknown): boolean {
        // Type guard for objects with error properties
        if (typeof error === 'object' && error !== null) {
            const err = error as { code?: string; status?: number };
            if (err.code === 'NETWORK_ERROR') return true;
            if (typeof err.status === 'number') {
                if (err.status >= 500) return true;
                if (err.status === 408 || err.status === 429) return true;
            }
        }
        return false;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('xploar_access_token');
    }

    private getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('xploar_refresh_token');
    }

    private setTokens(tokens: AuthTokens): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('xploar_access_token', tokens.accessToken);
        localStorage.setItem('xploar_refresh_token', tokens.refreshToken);
    }

    private clearTokens(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('xploar_access_token');
        localStorage.removeItem('xploar_refresh_token');
    }

    private async refreshToken(): Promise<void> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await this.client.post<ApiResponse<AuthTokens>>(
            '/api/auth/refresh',
            { refreshToken },
            { skipAuth: true }
        );

        if (response.data.success && response.data.data) {
            this.setTokens(response.data.data);
        } else {
            throw new Error('Token refresh failed');
        }
    }

    // ============================= GENERIC HTTP METHODS =============================

    /**
     * Generic HTTP request method
     */
    async request<T>(config: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        url: string;
        data?: unknown;
        params?: Record<string, unknown>;
        skipAuth?: boolean;
    }): Promise<ApiResponse<T>> {
        return this.retryRequest(async () => {
            const response = await this.client.request<ApiResponse<T>>({
                method: config.method,
                url: config.url,
                data: config.data,
                params: config.params,
                skipAuth: config.skipAuth
            });
            return response.data;
        });
    }

    /**
     * GET request
     */
    async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'GET', url, params });
    }

    /**
     * POST request
     */
    async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'POST', url, data });
    }

    /**
     * PUT request
     */
    async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PUT', url, data });
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'DELETE', url });
    }

    /**
     * PATCH request
     */
    async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PATCH', url, data });
    }

    // ============================= DOMAIN-SPECIFIC API METHODS =============================

    // AUTH ENDPOINTS
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
                '/api/auth/login',
                credentials,
                { skipAuth: true }
            );

            if (response.data.success && response.data.data?.tokens) {
                this.setTokens(response.data.data.tokens);
            }

            return response.data;
        });
    }

    async register(data: RegistrationData): Promise<ApiResponse<{ user: User }>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<{ user: User }>>(
                '/api/auth/register',
                data,
                { skipAuth: true }
            );
            return response.data;
        });
    }

    async logout(): Promise<void> {
        try {
            await this.client.post('/api/auth/logout');
        } finally {
            this.clearTokens();
        }
    }

    // STUDY PLANNER ENDPOINTS
    async getStudyPlans(page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<StudyPlan>>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<PaginatedResponse<StudyPlan>>>(
                `/api/study-planner/plans?page=${page}&size=${size}`
            );
            return response.data;
        });
    }

    async getStudyPlan(planId: string): Promise<ApiResponse<StudyPlan>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<StudyPlan>>(
                `/api/study-planner/plans/${planId}`
            );
            return response.data;
        });
    }

    async createStudyPlan(data: CreateStudyPlanRequest): Promise<ApiResponse<StudyPlan>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<StudyPlan>>(
                '/api/study-planner/plans',
                data
            );
            return response.data;
        });
    }

    async updateStudyPlan(planId: string, data: Partial<CreateStudyPlanRequest>): Promise<ApiResponse<StudyPlan>> {
        return this.retryRequest(async () => {
            const response = await this.client.put<ApiResponse<StudyPlan>>(
                `/api/study-planner/plans/${planId}`,
                data
            );
            return response.data;
        });
    }

    async deleteStudyPlan(planId: string): Promise<ApiResponse<void>> {
        return this.retryRequest(async () => {
            const response = await this.client.delete<ApiResponse<void>>(
                `/api/study-planner/plans/${planId}`
            );
            return response.data;
        });
    }

    // TASK ENDPOINTS
    async getTasks(params?: {
        planId?: string;
        status?: string;
        page?: number;
        size?: number;
    }): Promise<ApiResponse<PaginatedResponse<Task>>> {
        return this.retryRequest(async () => {
            const queryParams = new URLSearchParams();
            if (params?.planId) queryParams.append('planId', params.planId);
            if (params?.status) queryParams.append('status', params.status);
            queryParams.append('page', String(params?.page || 0));
            queryParams.append('size', String(params?.size || 20));

            const response = await this.client.get<ApiResponse<PaginatedResponse<Task>>>(
                `/api/study-planner/tasks?${queryParams.toString()}`
            );
            return response.data;
        });
    }

    async getTask(taskId: string): Promise<ApiResponse<Task>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<Task>>(
                `/api/study-planner/tasks/${taskId}`
            );
            return response.data;
        });
    }

    async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<Task>>(
                '/api/study-planner/tasks',
                data
            );
            return response.data;
        });
    }

    async updateTask(taskId: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
        return this.retryRequest(async () => {
            const response = await this.client.put<ApiResponse<Task>>(
                `/api/study-planner/tasks/${taskId}`,
                data
            );
            return response.data;
        });
    }

    async startTask(taskId: string): Promise<ApiResponse<Task>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<Task>>(
                `/api/study-planner/tasks/${taskId}/start`
            );
            return response.data;
        });
    }

    async completeTask(taskId: string, data: CompleteTaskRequest): Promise<ApiResponse<Task>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<Task>>(
                `/api/study-planner/tasks/${taskId}/complete`,
                data
            );
            return response.data;
        });
    }

    async deferTask(taskId: string, data: DeferTaskRequest): Promise<ApiResponse<Task>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<Task>>(
                `/api/study-planner/tasks/${taskId}/defer`,
                data
            );
            return response.data;
        });
    }

    // DAILY PLANNING ENDPOINTS
    async getDailyPlan(date: string): Promise<ApiResponse<DailyPlan>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<DailyPlan>>(
                `/api/study-planner/daily/${date}`
            );
            return response.data;
        });
    }

    async getTodaysPlan(): Promise<ApiResponse<DailyPlan>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<DailyPlan>>(
                '/api/study-planner/daily/today'
            );
            return response.data;
        });
    }

    async completeDay(date: string, data: { 
        notes?: string; 
        performanceMetrics?: {
            focusScore?: number;
            productivity?: number;
            energyLevel?: string;
            distractions?: number;
            mood?: string;
            challenges?: string;
        };
        tomorrowGoals?: string[];
    }): Promise<ApiResponse<DailyPlan>> {
        return this.retryRequest(async () => {
            const response = await this.client.post<ApiResponse<DailyPlan>>(
                `/api/study-planner/daily/${date}/complete`,
                data
            );
            return response.data;
        });
    }

    // PROGRESS ENDPOINTS
    async getOverallProgress(): Promise<ApiResponse<{
        userId: string;
        overallStats: Record<string, unknown>;
        timeStats: Record<string, unknown>;
        lastUpdated: string;
    }>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<{
                userId: string;
                overallStats: Record<string, unknown>;
                timeStats: Record<string, unknown>;
                lastUpdated: string;
            }>>(
                '/api/study-planner/progress/overall'
            );
            return response.data;
        });
    }

    async getStudyPlanProgress(planId: string): Promise<ApiResponse<Record<string, unknown>>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<Record<string, unknown>>>(
                `/api/study-planner/progress/study-plan/${planId}`
            );
            return response.data;
        });
    }

    async getStreakInfo(): Promise<ApiResponse<{
        currentStreak: Record<string, unknown>;
        longestStreak: Record<string, unknown>;
        streakHistory: Record<string, unknown>[];
    }>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<{
                currentStreak: Record<string, unknown>;
                longestStreak: Record<string, unknown>;
                streakHistory: Record<string, unknown>[];
            }>>(
                '/api/study-planner/progress/streaks'
            );
            return response.data;
        });
    }

    // USER PROFILE ENDPOINTS
    async getUserProfile(): Promise<ApiResponse<User>> {
        return this.retryRequest(async () => {
            const response = await this.client.get<ApiResponse<User>>(
                '/api/user-profile'
            );
            return response.data;
        });
    }

    async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
        return this.retryRequest(async () => {
            const response = await this.client.put<ApiResponse<User>>(
                '/api/user-profile',
                data
            );
            return response.data;
        });
    }
}

// Export singleton instance
export const unifiedApiClient = new UnifiedApiClient();
export default unifiedApiClient;
