import { apiClient } from './client';

export interface AnalyticsTimeRange {
    startDate: string;
    endDate: string;
    granularity?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface PerformanceMetrics {
    totalQuestionsAttempted: number;
    correctAnswers: number;
    accuracyPercentage: number;
    averageResponseTime: number;
    totalStudyTime: number;
    topicsCovered: number;
    strengthAreas: string[];
    improvementAreas: string[];
}

export interface TopicPerformance {
    topicId: string;
    topicName: string;
    questionsAttempted: number;
    correctAnswers: number;
    accuracyPercentage: number;
    averageResponseTime: number;
    timeSpent: number;
    lastAttempted: string;
    proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface StudyPatterns {
    dailyStudyTime: {
        date: string;
        minutes: number;
    }[];
    preferredStudyTimes: {
        hour: number;
        frequency: number;
    }[];
    studyStreak: number;
    longestStreak: number;
    averageSessionLength: number;
    mostProductiveDays: string[];
}

export interface LearningInsights {
    recommendedTopics: string[];
    suggestedStudySchedule: {
        day: string;
        topics: string[];
        estimatedTime: number;
    }[];
    performanceTrends: {
        period: string;
        improvement: number;
        areas: string[];
    }[];
    personalizedTips: string[];
}

export interface MockTestAnalytics {
    totalTestsTaken: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    improvementRate: number;
    topicBreakdown: {
        topicId: string;
        topicName: string;
        averageScore: number;
        testsTaken: number;
    }[];
    timeManagement: {
        averageTimePerQuestion: number;
        timeUtilization: number;
    };
}

export interface ComparativeAnalytics {
    peerComparison: {
        percentile: number;
        rank: number;
        totalUsers: number;
    };
    benchmarkComparison: {
        yourScore: number;
        averageScore: number;
        topScore: number;
        gap: number;
    };
    historicalComparison: {
        period: string;
        yourPerformance: number;
        previousPerformance: number;
        improvement: number;
    }[];
}

export interface GoalTracking {
    currentGoals: {
        id: string;
        title: string;
        targetDate: string;
        progress: number;
        status: 'on_track' | 'behind' | 'ahead';
    }[];
    completedGoals: {
        id: string;
        title: string;
        completedDate: string;
        achievement: string;
    }[];
    goalAnalytics: {
        successRate: number;
        averageCompletionTime: number;
        mostSuccessfulGoalType: string;
    };
}

export class AnalyticsService {
    // Performance Overview
    async getPerformanceOverview(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/performance/overview', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch performance overview');
        }
    }

    async getDetailedPerformanceMetrics(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/performance/detailed', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch detailed performance metrics');
        }
    }

    // Topic Performance
    async getTopicPerformance(topicIds?: string[], timeRange?: AnalyticsTimeRange) {
        try {
            const payload = {
                topicIds,
                timeRange: timeRange || {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date().toISOString(),
                    granularity: 'week'
                }
            };

            const response = await apiClient.post('/api/analytics/topics/performance', payload);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch topic performance');
        }
    }

    async getTopicComparison(topicIds: string[], timeRange: AnalyticsTimeRange) {
        try {
            const payload = { topicIds, timeRange };
            const response = await apiClient.post('/api/analytics/topics/comparison', payload);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch topic comparison');
        }
    }

    async getTopicProgress(topicId: string, timeRange: AnalyticsTimeRange) {
        try {
            const payload = { topicId, timeRange };
            const response = await apiClient.post(`/api/analytics/topics/${topicId}/progress`, payload);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch topic progress');
        }
    }

    // Study Patterns
    async getStudyPatterns(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/study/patterns', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch study patterns');
        }
    }

    async getStudyEfficiency(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/study/efficiency', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch study efficiency');
        }
    }

    async getStudyRecommendations(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/study/recommendations', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch study recommendations');
        }
    }

    // Mock Test Analytics
    async getMockTestAnalytics(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/mock-tests/overview', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mock test analytics');
        }
    }

    async getMockTestBreakdown(testId: string) {
        try {
            const response = await apiClient.get(`/api/analytics/mock-tests/${testId}/breakdown`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mock test breakdown');
        }
    }

    async getMockTestTrends(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/mock-tests/trends', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mock test trends');
        }
    }

    // Comparative Analytics
    async getPeerComparison(timeRange: AnalyticsTimeRange, topicIds?: string[]) {
        try {
            const payload = { timeRange, topicIds };
            const response = await apiClient.post('/api/analytics/comparison/peer', payload);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch peer comparison');
        }
    }

    async getBenchmarkComparison(timeRange: AnalyticsTimeRange, benchmarkType: 'overall' | 'topic' | 'exam') {
        try {
            const payload = { timeRange, benchmarkType };
            const response = await apiClient.post('/api/analytics/comparison/benchmark', payload);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch benchmark comparison');
        }
    }

    async getHistoricalComparison(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/comparison/historical', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch historical comparison');
        }
    }

    // Learning Insights
    async getLearningInsights(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/insights/learning', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch learning insights');
        }
    }

    async getPersonalizedRecommendations(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/insights/recommendations', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch personalized recommendations');
        }
    }

    async getStudyOptimizationTips(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/insights/optimization', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch study optimization tips');
        }
    }

    // Goal Tracking
    async getGoalProgress(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/goals/progress', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch goal progress');
        }
    }

    async getGoalAnalytics(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/goals/analytics', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch goal analytics');
        }
    }

    // Custom Reports
    async generateCustomReport(reportConfig: {
        metrics: string[];
        timeRange: AnalyticsTimeRange;
        topicIds?: string[];
        groupBy?: string;
        filters?: Record<string, string | number | boolean>;
    }) {
        try {
            const response = await apiClient.post('/api/analytics/reports/custom', reportConfig);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to generate custom report');
        }
    }

    async exportAnalyticsData(timeRange: AnalyticsTimeRange, format: 'csv' | 'pdf' | 'excel') {
        try {
            const payload = { timeRange, format };
            const response = await apiClient.post('/api/analytics/export', payload);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to export analytics data');
        }
    }

    // Real-time Analytics
    async getRealTimeMetrics() {
        try {
            const response = await apiClient.get('/api/analytics/realtime/metrics');
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch real-time metrics');
        }
    }

    async getLiveProgress() {
        try {
            const response = await apiClient.get('/api/analytics/realtime/progress');
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch live progress');
        }
    }

    // Predictive Analytics
    async getPerformancePredictions(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/predictions/performance', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch performance predictions');
        }
    }

    async getExamReadinessScore(timeRange: AnalyticsTimeRange) {
        try {
            const response = await apiClient.post('/api/analytics/predictions/exam-readiness', timeRange);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch exam readiness score');
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

export const analyticsService = new AnalyticsService();
