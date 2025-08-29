import { apiClient } from './client';

export interface MockTestParams {
    topicId?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    useNegativeMarking?: boolean;
    page?: number;
    size?: number;
}

export interface MockTestConfig {
    topicId: string;
    useNegativeMarking: boolean;
    timeLimit?: number;
    questionCount?: number;
}

export interface MockTestSubmission {
    testId: string;
    answers: Record<number, number>;
    timeTaken: number;
    completedAt: string;
}

export interface MockTestResult {
    testId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeTaken: number;
    completedAt: string;
    topicId: string;
    useNegativeMarking: boolean;
}

export class MockTestsService {
    // Get available mock tests
    async getAvailableTests(params: MockTestParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicId) queryParams.append('topicId', params.topicId);
            if (params.difficulty) queryParams.append('difficulty', params.difficulty);
            if (params.useNegativeMarking !== undefined) queryParams.append('useNegativeMarking', params.useNegativeMarking.toString());
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/mock-tests/available?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch available tests');
        }
    }

    // Start a new mock test
    async startMockTest(config: MockTestConfig) {
        try {
            const response = await apiClient.post('/api/mock-tests/start', config);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to start mock test');
        }
    }

    // Get test questions
    async getTestQuestions(testId: string) {
        try {
            const response = await apiClient.get(`/api/mock-tests/${testId}/questions`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch test questions');
        }
    }

    // Submit test answers
    async submitMockTest(submission: MockTestSubmission) {
        try {
            const response = await apiClient.post(`/api/mock-tests/${submission.testId}/submit`, submission);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to submit mock test');
        }
    }

    // Get test results
    async getTestResult(testId: string) {
        try {
            const response = await apiClient.get(`/api/mock-tests/${testId}/result`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch test result');
        }
    }

    // Get user's mock test history
    async getMockTestHistory(params: {
        topicId?: string;
        page?: number;
        size?: number;
        sortBy?: 'date' | 'score' | 'timeTaken';
        sortOrder?: 'asc' | 'desc';
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicId) queryParams.append('topicId', params.topicId);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());
            if (params.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

            const url = `/api/mock-tests/history?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mock test history');
        }
    }

    // Get performance analytics
    async getPerformanceAnalytics(params: {
        topicId?: string;
        timeRange?: 'week' | 'month' | 'quarter' | 'year';
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicId) queryParams.append('topicId', params.topicId);
            if (params.timeRange) queryParams.append('timeRange', params.timeRange);

            const url = `/api/mock-tests/analytics?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch performance analytics');
        }
    }

    // Get topic-wise performance
    async getTopicPerformance() {
        try {
            const response = await apiClient.get('/api/mock-tests/topic-performance');
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch topic performance');
        }
    }

    // Get recommended tests based on performance
    async getRecommendedTests() {
        try {
            const response = await apiClient.get('/api/mock-tests/recommendations');
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch recommended tests');
        }
    }

    // Pause a test (for later completion)
    async pauseMockTest(testId: string) {
        try {
            const response = await apiClient.post(`/api/mock-tests/${testId}/pause`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to pause mock test');
        }
    }

    // Resume a paused test
    async resumeMockTest(testId: string) {
        try {
            const response = await apiClient.post(`/api/mock-tests/${testId}/resume`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to resume mock test');
        }
    }

    // Get test statistics
    async getTestStatistics() {
        try {
            const response = await apiClient.get('/api/mock-tests/statistics');
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch test statistics');
        }
    }

    private handleError(error: any, defaultMessage: string): Error {
        if (error.response?.data?.error?.message) {
            return new Error(error.response.data.error.message);
        }
        return new Error(error.message || defaultMessage);
    }
}

export const mockTestsService = new MockTestsService();
