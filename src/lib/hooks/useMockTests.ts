import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { mockTestsService, MockTestParams, MockTestCreate, MockTestUpdate, QuestionSubmission } from '@/lib/api';
import { MockRun, TopicID } from '@/lib/types';

export interface UseMockTestsReturn {
    // Available Tests
    availableTests: any[];
    availableTestsLoading: boolean;
    availableTestsError: string | null;
    fetchAvailableTests: (params?: MockTestParams) => Promise<void>;

    // Test Session
    currentTest: any | null;
    currentTestLoading: boolean;
    currentTestError: string | null;
    startTest: (testId: string, params?: any) => Promise<void>;
    endTest: (testId: string) => Promise<void>;
    pauseTest: (testId: string) => Promise<void>;
    resumeTest: (testId: string) => Promise<void>;

    // Test Questions
    testQuestions: any[];
    questionsLoading: boolean;
    questionsError: string | null;
    fetchTestQuestions: (testId: string, params?: any) => Promise<void>;
    submitAnswer: (questionId: string, answer: string, timeSpent?: number) => Promise<void>;
    markForReview: (questionId: string) => Promise<void>;

    // Test Results
    testResults: any[];
    resultsLoading: boolean;
    resultsError: string | null;
    fetchTestResults: (testId: string) => Promise<void>;
    getTestResult: (testId: string) => any | null;

    // Test History
    testHistory: any[];
    historyLoading: boolean;
    historyError: string | null;
    fetchTestHistory: (params?: any) => Promise<void>;

    // Performance Analytics
    performanceAnalytics: any | null;
    analyticsLoading: boolean;
    analyticsError: string | null;
    fetchPerformanceAnalytics: (params?: any) => Promise<void>;

    // Topic Performance
    topicPerformance: any[];
    topicPerformanceLoading: boolean;
    topicPerformanceError: string | null;
    fetchTopicPerformance: (topicIds?: TopicID[]) => Promise<void>;

    // Test Recommendations
    recommendedTests: any[];
    recommendationsLoading: boolean;
    recommendationsError: string | null;
    fetchRecommendedTests: (params?: any) => Promise<void>;

    // Utilities
    clearErrors: () => void;
    refreshAll: () => Promise<void>;
    getTestProgress: (testId: string) => number;
    getTestTimeRemaining: (testId: string) => number;
}

export function useMockTests(): UseMockTestsReturn {
    const { saveMockTest } = useAppStore();

    // Available Tests State
    const [availableTests, setAvailableTests] = useState<any[]>([]);
    const [availableTestsLoading, setAvailableTestsLoading] = useState(false);
    const [availableTestsError, setAvailableTestsError] = useState<string | null>(null);

    // Current Test State
    const [currentTest, setCurrentTest] = useState<any | null>(null);
    const [currentTestLoading, setCurrentTestLoading] = useState(false);
    const [currentTestError, setCurrentTestError] = useState<string | null>(null);

    // Test Questions State
    const [testQuestions, setTestQuestions] = useState<any[]>([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState<string | null>(null);

    // Test Results State
    const [testResults, setTestResults] = useState<any[]>([]);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [resultsError, setResultsError] = useState<string | null>(null);

    // Test History State
    const [testHistory, setTestHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    // Performance Analytics State
    const [performanceAnalytics, setPerformanceAnalytics] = useState<any | null>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);

    // Topic Performance State
    const [topicPerformance, setTopicPerformance] = useState<any[]>([]);
    const [topicPerformanceLoading, setTopicPerformanceLoading] = useState(false);
    const [topicPerformanceError, setTopicPerformanceError] = useState<string | null>(null);

    // Test Recommendations State
    const [recommendedTests, setRecommendedTests] = useState<any[]>([]);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);
    const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

    // Clear all errors
    const clearErrors = useCallback(() => {
        setAvailableTestsError(null);
        setCurrentTestError(null);
        setQuestionsError(null);
        setResultsError(null);
        setHistoryError(null);
        setAnalyticsError(null);
        setTopicPerformanceError(null);
        setRecommendationsError(null);
    }, []);

    // Available Tests
    const fetchAvailableTests = useCallback(async (params?: MockTestParams) => {
        try {
            setAvailableTestsLoading(true);
            setAvailableTestsError(null);

            const response = await mockTestsService.getAvailableTests(params);

            if (response.data) {
                setAvailableTests(response.data);
            }
        } catch (err: any) {
            setAvailableTestsError(err.message || 'Failed to fetch available tests');
        } finally {
            setAvailableTestsLoading(false);
        }
    }, []);

    // Test Session Management
    const startTest = useCallback(async (testId: string, params?: any) => {
        try {
            setCurrentTestLoading(true);
            setCurrentTestError(null);

            const response = await mockTestsService.startTest(testId, params);

            if (response.data) {
                setCurrentTest(response.data);
                // Also fetch questions for the test
                await fetchTestQuestions(testId);
            }
        } catch (err: any) {
            setCurrentTestError(err.message || 'Failed to start test');
            throw err;
        } finally {
            setCurrentTestLoading(false);
        }
    }, []);

    const endTest = useCallback(async (testId: string) => {
        try {
            setCurrentTestError(null);

            const response = await mockTestsService.endTest(testId);

            if (response.data) {
                // Save the test result to the store
                const mockRun: MockRun = {
                    id: response.data.id,
                    testId: testId,
                    startTime: currentTest?.startTime || new Date().toISOString(),
                    endTime: new Date().toISOString(),
                    score: response.data.score,
                    totalQuestions: response.data.totalQuestions,
                    correctAnswers: response.data.correctAnswers,
                    timeSpent: response.data.timeSpent,
                    topicBreakdown: response.data.topicBreakdown || {},
                };

                saveMockTest(mockRun);

                // Clear current test
                setCurrentTest(null);
                setTestQuestions([]);
            }
        } catch (err: any) {
            setCurrentTestError(err.message || 'Failed to end test');
            throw err;
        }
    }, [currentTest, saveMockTest]);

    const pauseTest = useCallback(async (testId: string) => {
        try {
            setCurrentTestError(null);

            await mockTestsService.pauseTest(testId);

            // Update current test status
            setCurrentTest(prev => prev ? { ...prev, status: 'paused' } : null);
        } catch (err: any) {
            setCurrentTestError(err.message || 'Failed to pause test');
            throw err;
        }
    }, []);

    const resumeTest = useCallback(async (testId: string) => {
        try {
            setCurrentTestError(null);

            await mockTestsService.resumeTest(testId);

            // Update current test status
            setCurrentTest(prev => prev ? { ...prev, status: 'in_progress' } : null);
        } catch (err: any) {
            setCurrentTestError(err.message || 'Failed to resume test');
            throw err;
        }
    }, []);

    // Test Questions
    const fetchTestQuestions = useCallback(async (testId: string, params?: any) => {
        try {
            setQuestionsLoading(true);
            setQuestionsError(null);

            const response = await mockTestsService.getTestQuestions(testId, params);

            if (response.data) {
                setTestQuestions(response.data);
            }
        } catch (err: any) {
            setQuestionsError(err.message || 'Failed to fetch test questions');
        } finally {
            setQuestionsLoading(false);
        }
    }, []);

    const submitAnswer = useCallback(async (questionId: string, answer: string, timeSpent?: number) => {
        try {
            setQuestionsError(null);

            const submission: QuestionSubmission = {
                questionId,
                selectedAnswer: answer,
                timeSpent: timeSpent || 0,
                isMarkedForReview: false,
            };

            const response = await mockTestsService.submitAnswer(questionId, submission);

            if (response.data) {
                // Update the question with the submission result
                setTestQuestions(prev => prev.map(q =>
                    q.id === questionId ? { ...q, userAnswer: answer, isAnswered: true, timeSpent } : q
                ));
            }
        } catch (err: any) {
            setQuestionsError(err.message || 'Failed to submit answer');
            throw err;
        }
    }, []);

    const markForReview = useCallback(async (questionId: string) => {
        try {
            setQuestionsError(null);

            await mockTestsService.markQuestionForReview(questionId);

            // Update the question locally
            setTestQuestions(prev => prev.map(q =>
                q.id === questionId ? { ...q, isMarkedForReview: !q.isMarkedForReview } : q
            ));
        } catch (err: any) {
            setQuestionsError(err.message || 'Failed to mark question for review');
            throw err;
        }
    }, []);

    // Test Results
    const fetchTestResults = useCallback(async (testId: string) => {
        try {
            setResultsLoading(true);
            setResultsError(null);

            const response = await mockTestsService.getTestResult(testId);

            if (response.data) {
                // Update or add the result
                setTestResults(prev => {
                    const existingIndex = prev.findIndex(r => r.testId === testId);
                    if (existingIndex >= 0) {
                        const updated = [...prev];
                        updated[existingIndex] = response.data;
                        return updated;
                    }
                    return [response.data, ...prev];
                });
            }
        } catch (err: any) {
            setResultsError(err.message || 'Failed to fetch test result');
        } finally {
            setResultsLoading(false);
        }
    }, []);

    const getTestResult = useCallback((testId: string) => {
        return testResults.find(result => result.testId === testId) || null;
    }, [testResults]);

    // Test History
    const fetchTestHistory = useCallback(async (params?: any) => {
        try {
            setHistoryLoading(true);
            setHistoryError(null);

            const response = await mockTestsService.getTestHistory(params);

            if (response.data) {
                setTestHistory(response.data);
            }
        } catch (err: any) {
            setHistoryError(err.message || 'Failed to fetch test history');
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    // Performance Analytics
    const fetchPerformanceAnalytics = useCallback(async (params?: any) => {
        try {
            setAnalyticsLoading(true);
            setAnalyticsError(null);

            const response = await mockTestsService.getPerformanceAnalytics(params);

            if (response.data) {
                setPerformanceAnalytics(response.data);
            }
        } catch (err: any) {
            setAnalyticsError(err.message || 'Failed to fetch performance analytics');
        } finally {
            setAnalyticsLoading(false);
        }
    }, []);

    // Topic Performance
    const fetchTopicPerformance = useCallback(async (topicIds?: TopicID[]) => {
        try {
            setTopicPerformanceLoading(true);
            setTopicPerformanceError(null);

            const response = await mockTestsService.getTopicPerformance(topicIds);

            if (response.data) {
                setTopicPerformance(response.data);
            }
        } catch (err: any) {
            setTopicPerformanceError(err.message || 'Failed to fetch topic performance');
        } finally {
            setTopicPerformanceLoading(false);
        }
    }, []);

    // Test Recommendations
    const fetchRecommendedTests = useCallback(async (params?: any) => {
        try {
            setRecommendationsLoading(true);
            setRecommendationsError(null);

            const response = await mockTestsService.getRecommendedTests(params);

            if (response.data) {
                setRecommendedTests(response.data);
            }
        } catch (err: any) {
            setRecommendationsError(err.message || 'Failed to fetch recommended tests');
        } finally {
            setRecommendationsLoading(false);
        }
    }, []);

    // Utility Functions
    const getTestProgress = useCallback((testId: string) => {
        const questions = testQuestions.filter(q => q.testId === testId);
        if (questions.length === 0) return 0;

        const answeredQuestions = questions.filter(q => q.isAnswered);
        return (answeredQuestions.length / questions.length) * 100;
    }, [testQuestions]);

    const getTestTimeRemaining = useCallback((testId: string) => {
        const test = availableTests.find(t => t.id === testId);
        if (!test || !currentTest) return 0;

        const elapsed = Date.now() - new Date(currentTest.startTime).getTime();
        const remaining = (test.duration * 60 * 1000) - elapsed;
        return Math.max(0, remaining);
    }, [availableTests, currentTest]);

    // Refresh all data
    const refreshAll = useCallback(async () => {
        await Promise.all([
            fetchAvailableTests(),
            fetchTestHistory(),
            fetchPerformanceAnalytics(),
            fetchTopicPerformance(),
            fetchRecommendedTests(),
        ]);
    }, [fetchAvailableTests, fetchTestHistory, fetchPerformanceAnalytics, fetchTopicPerformance, fetchRecommendedTests]);

    // Load initial data on mount
    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return {
        // Available Tests
        availableTests,
        availableTestsLoading,
        availableTestsError,
        fetchAvailableTests,

        // Test Session
        currentTest,
        currentTestLoading,
        currentTestError,
        startTest,
        endTest,
        pauseTest,
        resumeTest,

        // Test Questions
        testQuestions,
        questionsLoading,
        questionsError,
        fetchTestQuestions,
        submitAnswer,
        markForReview,

        // Test Results
        testResults,
        resultsLoading,
        resultsError,
        fetchTestResults,
        getTestResult,

        // Test History
        testHistory,
        historyLoading,
        historyError,
        fetchTestHistory,

        // Performance Analytics
        performanceAnalytics,
        analyticsLoading,
        analyticsError,
        fetchPerformanceAnalytics,

        // Topic Performance
        topicPerformance,
        topicPerformanceLoading,
        topicPerformanceError,
        fetchTopicPerformance,

        // Test Recommendations
        recommendedTests,
        recommendationsLoading,
        recommendationsError,
        fetchRecommendedTests,

        // Utilities
        clearErrors,
        refreshAll,
        getTestProgress,
        getTestTimeRemaining,
    };
}
