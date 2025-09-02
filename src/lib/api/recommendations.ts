import { apiClient } from './client';
import { AIRecommendation } from '@/lib/types';

export interface RecommendationParams {
    type?: 'STUDY_PLAN' | 'TASK_OPTIMIZATION' | 'SCHEDULE_ADJUSTMENT' | 'RESOURCE_SUGGESTION';
    limit?: number;
    includeCompleted?: boolean;
}

export class RecommendationsService {
    /**
     * Get AI-generated recommendations for the user
     */
    async getRecommendations(params: RecommendationParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.type) queryParams.append('type', params.type);
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.includeCompleted !== undefined) {
                queryParams.append('includeCompleted', params.includeCompleted.toString());
            }

            const url = `/api/recommendations?${queryParams.toString()}`;
            const response = await apiClient.get<{
                success: boolean;
                data: AIRecommendation[];
                message?: string;
                timestamp: string;
                requestId: string;
            }>(url);

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch recommendations');
        }
    }

    /**
     * Mark recommendation as completed/acted upon
     */
    async completeRecommendation(recommendationId: string) {
        try {
            const response = await apiClient.post<{
                success: boolean;
                data: AIRecommendation;
                message?: string;
            }>(`/api/recommendations/${recommendationId}/complete`, {});

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to complete recommendation');
        }
    }

    /**
     * Dismiss a recommendation
     */
    async dismissRecommendation(recommendationId: string, reason?: string) {
        try {
            const response = await apiClient.post<{
                success: boolean;
                message: string;
            }>(`/api/recommendations/${recommendationId}/dismiss`, {
                reason: reason || 'User dismissed'
            });

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to dismiss recommendation');
        }
    }

    /**
     * Get user's recommendation settings/preferences
     */
    async getRecommendationSettings() {
        try {
            const response = await apiClient.get<{
                success: boolean;
                data: {
                    enabled: boolean;
                    frequency: 'DAILY' | 'WEEKLY' | 'REAL_TIME';
                    types: string[];
                    maxRecommendations: number;
                };
            }>('/api/recommendations/settings');

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch recommendation settings');
        }
    }

    /**
     * Update recommendation settings
     */
    async updateRecommendationSettings(settings: {
        enabled?: boolean;
        frequency?: 'DAILY' | 'WEEKLY' | 'REAL_TIME';
        types?: string[];
        maxRecommendations?: number;
    }) {
        try {
            const response = await apiClient.put<{
                success: boolean;
                data: object;
                message: string;
            }>('/api/recommendations/settings', settings);

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to update recommendation settings');
        }
    }

    private handleError(error: unknown, defaultMessage: string): Error {
        if (error && typeof error === 'object' && 'response' in error) {
            const responseError = error as { response?: { data?: { error?: { message?: string } } } };
            if (responseError.response?.data?.error?.message) {
                return new Error(responseError.response.data.error.message);
            }
        }
        return new Error(error instanceof Error ? error.message : defaultMessage);
    }
}

export const recommendationsService = new RecommendationsService();
