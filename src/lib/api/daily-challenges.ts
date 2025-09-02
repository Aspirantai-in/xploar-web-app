import { apiClient } from './client';

export interface DailyChallenge {
    id: string;
    type: 'QUIZ' | 'MCQ' | 'PRACTICE' | 'REVISION' | 'READING' | 'CUSTOM';
    title: string;
    description: string;
    goalValue: number;
    goalUnit: 'questions' | 'minutes' | 'pages' | 'tasks';
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    subjectArea: string;
    estimatedDurationMinutes: number;
    points: number;
    isCompleted: boolean;
    completedAt?: string;
    dueDate: string;
    createdDate: string;
}

export interface DailyChallengeCompletion {
    challengeId: string;
    completionData: {
        actualValue: number;
        timeSpent: number;
        score?: number;
        notes?: string;
    };
}

export interface DailyChallengeStats {
    totalChallenges: number;
    completedChallenges: number;
    completionStreak: number;
    totalPoints: number;
    averageScore: number;
    completionRate: number;
}

export class DailyChallengesService {
    /**
     * Get today's daily challenges
     */
    async getTodaysChallenges() {
        try {
            const response = await apiClient.get<{
                success: boolean;
                data: DailyChallenge[];
                message?: string;
                timestamp: string;
                requestId: string;
            }>('/api/daily-challenges/today');

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch today\'s challenges');
        }
    }

    /**
     * Get daily challenges for a specific date
     */
    async getDailyChallenges(date: string) {
        try {
            const response = await apiClient.get<{
                success: boolean;
                data: DailyChallenge[];
                message?: string;
            }>(`/api/daily-challenges/${date}`);

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch daily challenges');
        }
    }

    /**
     * Complete a daily challenge
     */
    async completeChallenge(completion: DailyChallengeCompletion) {
        try {
            const response = await apiClient.post<{
                success: boolean;
                data: DailyChallenge;
                message: string;
            }>(`/api/daily-challenges/${completion.challengeId}/complete`, completion.completionData);

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to complete challenge');
        }
    }

    /**
     * Skip a daily challenge
     */
    async skipChallenge(challengeId: string, reason?: string) {
        try {
            const response = await apiClient.post<{
                success: boolean;
                message: string;
            }>(`/api/daily-challenges/${challengeId}/skip`, {
                reason: reason || 'User skipped'
            });

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to skip challenge');
        }
    }

    /**
     * Get daily challenge statistics
     */
    async getChallengeStats(timeRange: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' = 'MONTH') {
        try {
            const response = await apiClient.get<{
                success: boolean;
                data: DailyChallengeStats;
            }>(`/api/daily-challenges/stats?timeRange=${timeRange}`);

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch challenge statistics');
        }
    }

    /**
     * Get challenge history
     */
    async getChallengeHistory(params: {
        page?: number;
        size?: number;
        status?: 'COMPLETED' | 'SKIPPED' | 'PENDING';
        fromDate?: string;
        toDate?: string;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page !== undefined) queryParams.append('page', params.page.toString());
            if (params.size !== undefined) queryParams.append('size', params.size.toString());
            if (params.status) queryParams.append('status', params.status);
            if (params.fromDate) queryParams.append('fromDate', params.fromDate);
            if (params.toDate) queryParams.append('toDate', params.toDate);

            const url = `/api/daily-challenges/history?${queryParams.toString()}`;
            const response = await apiClient.get<{
                success: boolean;
                data: {
                    content: DailyChallenge[];
                    page: number;
                    size: number;
                    totalElements: number;
                    totalPages: number;
                    first: boolean;
                    last: boolean;
                };
            }>(url);

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch challenge history');
        }
    }

    /**
     * Generate new challenges for a user (admin/system function)
     */
    async generateChallenges(params: {
        targetDate: string;
        difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
        subjectAreas?: string[];
        count?: number;
    }) {
        try {
            const response = await apiClient.post<{
                success: boolean;
                data: DailyChallenge[];
                message: string;
            }>('/api/daily-challenges/generate', params);

            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to generate challenges');
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

export const dailyChallengesService = new DailyChallengesService();
