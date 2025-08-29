import { MockTestsService as ApiMockTestsService } from '../api/mock-tests';
import { ValidationUtils } from '../utils/validation';
import { StorageUtils } from '../utils/storage';
import { DateUtils } from '../utils/date';

export class MockTestsService {
  private static instance: MockTestsService;
  private apiService: ApiMockTestsService;

  private constructor() {
    this.apiService = new ApiMockTestsService();
  }

  public static getInstance(): MockTestsService {
    if (!MockTestsService.instance) {
      MockTestsService.instance = new MockTestsService();
    }
    return MockTestsService.instance;
  }

  /**
   * Get available mock tests
   */
  async getAvailableTests(filters?: {
    subject?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    duration?: number;
    questionCount?: number;
  }) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_available_tests_${JSON.stringify(filters || {})}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getAvailableTests(filters);
      if (response.success && response.data) {
        // Cache the available tests
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch available tests');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start a mock test session
   */
  async startTestSession(testId: string, sessionData: {
    userId: string;
    startTime: string;
    expectedDuration: number;
  }) {
    try {
      // Validate session data
      if (!ValidationUtils.isValidDate(sessionData.startTime)) {
        throw new Error('Invalid start time format');
      }

      if (sessionData.expectedDuration <= 0) {
        throw new Error('Expected duration must be greater than 0');
      }

      const response = await this.apiService.startTestSession(testId, sessionData);
      if (response.success && response.data) {
        // Cache the active session
        StorageUtils.sessionStorage.set('xploar_active_test_session', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to start test session');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current test session
   */
  async getCurrentTestSession() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.sessionStorage.get('xploar_active_test_session');
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API to get the current session
      // const response = await this.apiService.getCurrentTestSession();
      
      return { success: true, data: null };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * End a test session
   */
  async endTestSession(sessionId: string, sessionData: {
    endTime: string;
    answers: Record<string, string>;
    timeSpent: number;
  }) {
    try {
      // Validate session data
      if (!ValidationUtils.isValidDate(sessionData.endTime)) {
        throw new Error('Invalid end time format');
      }

      if (sessionData.timeSpent < 0) {
        throw new Error('Time spent cannot be negative');
      }

      const response = await this.apiService.endTestSession(sessionId, sessionData);
      if (response.success && response.data) {
        // Clear active session cache
        StorageUtils.sessionStorage.remove('xploar_active_test_session');
        
        // Cache the completed session
        const completedSessions = StorageUtils.sessionStorage.get('xploar_completed_test_sessions') || [];
        completedSessions.push(response.data);
        StorageUtils.sessionStorage.set('xploar_completed_test_sessions', completedSessions);
        
        return response;
      }
      throw new Error(response.message || 'Failed to end test session');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Pause a test session
   */
  async pauseTestSession(sessionId: string) {
    try {
      const response = await this.apiService.pauseTestSession(sessionId);
      if (response.success && response.data) {
        // Update active session cache
        StorageUtils.sessionStorage.set('xploar_active_test_session', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to pause test session');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Resume a test session
   */
  async resumeTestSession(sessionId: string) {
    try {
      const response = await this.apiService.resumeTestSession(sessionId);
      if (response.success && response.data) {
        // Update active session cache
        StorageUtils.sessionStorage.set('xploar_active_test_session', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to resume test session');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get test questions
   */
  async getTestQuestions(testId: string, sessionId?: string) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_test_questions_${testId}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getTestQuestions(testId, sessionId);
      if (response.success && response.data) {
        // Cache the questions
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch test questions');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit test answers
   */
  async submitTestAnswers(sessionId: string, answers: Record<string, string>) {
    try {
      if (Object.keys(answers).length === 0) {
        throw new Error('No answers provided');
      }

      const response = await this.apiService.submitTestAnswers(sessionId, answers);
      if (response.success && response.data) {
        // Update active session cache with answers
        const activeSession = StorageUtils.sessionStorage.get('xploar_active_test_session');
        if (activeSession && activeSession.id === sessionId) {
          activeSession.answers = { ...activeSession.answers, ...answers };
          StorageUtils.sessionStorage.set('xploar_active_test_session', activeSession);
        }
        
        return response;
      }
      throw new Error(response.message || 'Failed to submit test answers');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get test results
   */
  async getTestResults(sessionId: string) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_test_results_${sessionId}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getTestResults(sessionId);
      if (response.success && response.data) {
        // Cache the results
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch test results');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get test history
   */
  async getTestHistory(userId: string, filters?: {
    subject?: string;
    dateRange?: { start: string; end: string };
    status?: 'completed' | 'in-progress' | 'paused';
  }) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_test_history_${userId}_${JSON.stringify(filters || {})}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getTestHistory(userId, filters);
      
      // For now, use cached completed sessions
      const completedSessions = StorageUtils.sessionStorage.get('xploar_completed_test_sessions') || [];
      
      // Apply filters if provided
      let filteredHistory = completedSessions;
      
      if (filters?.subject) {
        filteredHistory = filteredHistory.filter((session: any) => 
          session.subject === filters.subject
        );
      }
      
      if (filters?.dateRange) {
        filteredHistory = filteredHistory.filter((session: any) => {
          const sessionDate = new Date(session.startTime);
          const startDate = new Date(filters.dateRange!.start);
          const endDate = new Date(filters.dateRange!.end);
          return sessionDate >= startDate && sessionDate <= endDate;
        });
      }
      
      if (filters?.status) {
        filteredHistory = filteredHistory.filter((session: any) => 
          session.status === filters.status
        );
      }
      
      // Cache the filtered history
      StorageUtils.sessionStorage.set(cacheKey, filteredHistory);
      return { success: true, data: filteredHistory };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics(userId: string, timeframe: 'week' | 'month' | 'year' = 'month') {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_test_performance_analytics_${userId}_${timeframe}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getPerformanceAnalytics(userId, timeframe);
      
      // For now, generate mock analytics from completed sessions
      const completedSessions = StorageUtils.sessionStorage.get('xploar_completed_test_sessions') || [];
      const mockAnalytics = this.generateMockPerformanceAnalytics(completedSessions, timeframe);
      
      // Cache the analytics
      StorageUtils.sessionStorage.set(cacheKey, mockAnalytics);
      return { success: true, data: mockAnalytics };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get test recommendations
   */
  async getTestRecommendations(userId: string, limit: number = 5) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_test_recommendations_${userId}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached.slice(0, limit) };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getTestRecommendations(userId, limit);
      
      // For now, generate mock recommendations
      const mockRecommendations = this.generateMockTestRecommendations(limit);
      
      // Cache the recommendations
      StorageUtils.sessionStorage.set(cacheKey, mockRecommendations);
      return { success: true, data: mockRecommendations.slice(0, limit) };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a custom mock test
   */
  async createCustomTest(testData: {
    title: string;
    description?: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
    duration: number;
    questionCount: number;
    topics: string[];
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation?: string;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
  }) {
    try {
      // Validate test data
      const validation = this.validateCustomTestData(testData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.createCustomTest(testData);
      if (response.success && response.data) {
        // Clear available tests cache to refresh data
        this.clearAvailableTestsCache();
        return response;
      }
      throw new Error(response.message || 'Failed to create custom test');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate custom test data
   */
  private validateCustomTestData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.title.trim()) {
      errors.title = 'Test title is required';
    }

    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!['easy', 'medium', 'hard'].includes(data.difficulty)) {
      errors.difficulty = 'Invalid difficulty level';
    }

    if (data.duration <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }

    if (data.questionCount <= 0) {
      errors.questionCount = 'Question count must be greater than 0';
    }

    if (!data.topics || data.topics.length === 0) {
      errors.topics = 'At least one topic is required';
    }

    if (!data.questions || data.questions.length === 0) {
      errors.questions = 'At least one question is required';
    }

    if (data.questions && data.questions.length !== data.questionCount) {
      errors.questions = 'Question count must match the number of questions provided';
    }

    // Validate individual questions
    if (data.questions) {
      data.questions.forEach((question: any, index: number) => {
        if (!question.question.trim()) {
          errors[`questions.${index}.question`] = 'Question text is required';
        }

        if (!question.options || question.options.length < 2) {
          errors[`questions.${index}.options`] = 'At least 2 options are required';
        }

        if (!question.correctAnswer) {
          errors[`questions.${index}.correctAnswer`] = 'Correct answer is required';
        }

        if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
          errors[`questions.${index}.difficulty`] = 'Invalid question difficulty level';
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Generate mock performance analytics
   */
  private generateMockPerformanceAnalytics(completedSessions: any[], timeframe: string) {
    const now = new Date();
    const analytics = {
      totalTests: completedSessions.length,
      averageScore: 0,
      totalTimeSpent: 0,
      subjectBreakdown: {} as Record<string, any>,
      difficultyBreakdown: {} as Record<string, any>,
      timeTrend: [] as any[],
      scoreTrend: [] as any[],
      strengths: [] as string[],
      weaknesses: [] as string[],
    };

    if (completedSessions.length === 0) {
      return analytics;
    }

    // Calculate basic metrics
    let totalScore = 0;
    let totalTime = 0;
    const subjectStats: Record<string, { count: number; totalScore: number; totalTime: number }> = {};
    const difficultyStats: Record<string, { count: number; totalScore: number; totalTime: number }> = {};

    completedSessions.forEach((session: any) => {
      totalScore += session.score || 0;
      totalTime += session.timeSpent || 0;

      // Subject breakdown
      if (!subjectStats[session.subject]) {
        subjectStats[session.subject] = { count: 0, totalScore: 0, totalTime: 0 };
      }
      subjectStats[session.subject].count++;
      subjectStats[session.subject].totalScore += session.score || 0;
      subjectStats[session.subject].totalTime += session.timeSpent || 0;

      // Difficulty breakdown
      if (!difficultyStats[session.difficulty]) {
        difficultyStats[session.difficulty] = { count: 0, totalScore: 0, totalTime: 0 };
      }
      difficultyStats[session.difficulty].count++;
      difficultyStats[session.difficulty].totalScore += session.score || 0;
      difficultyStats[session.difficulty].totalTime += session.timeSpent || 0;
    });

    analytics.averageScore = totalScore / completedSessions.length;
    analytics.totalTimeSpent = totalTime;

    // Process subject breakdown
    Object.entries(subjectStats).forEach(([subject, stats]) => {
      analytics.subjectBreakdown[subject] = {
        count: stats.count,
        averageScore: stats.totalScore / stats.count,
        averageTime: stats.totalTime / stats.count,
        totalTime: stats.totalTime,
      };
    });

    // Process difficulty breakdown
    Object.entries(difficultyStats).forEach(([difficulty, stats]) => {
      analytics.difficultyBreakdown[difficulty] = {
        count: stats.count,
        averageScore: stats.totalScore / stats.count,
        averageTime: stats.totalTime / stats.count,
        totalTime: stats.totalTime,
      };
    });

    // Generate time and score trends
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const daySessions = completedSessions.filter((session: any) => 
        session.startTime.startsWith(dateStr)
      );

      const dayScore = daySessions.length > 0 
        ? daySessions.reduce((sum: number, session: any) => sum + (session.score || 0), 0) / daySessions.length
        : 0;

      const dayTime = daySessions.reduce((sum: number, session: any) => sum + (session.timeSpent || 0), 0);

      analytics.timeTrend.push({ date: dateStr, time: dayTime });
      analytics.scoreTrend.push({ date: dateStr, score: dayScore });
    }

    // Identify strengths and weaknesses
    Object.entries(analytics.subjectBreakdown).forEach(([subject, stats]) => {
      if (stats.averageScore >= 80) {
        analytics.strengths.push(subject);
      } else if (stats.averageScore <= 50) {
        analytics.weaknesses.push(subject);
      }
    });

    return analytics;
  }

  /**
   * Generate mock test recommendations
   */
  private generateMockTestRecommendations(limit: number) {
    const recommendations = [
      {
        id: 'rec_1',
        title: 'Advanced Mathematics Challenge',
        description: 'Test your skills with complex mathematical problems',
        subject: 'Mathematics',
        difficulty: 'hard',
        duration: 120,
        questionCount: 50,
        reason: 'Based on your strong performance in basic math',
        estimatedScore: 85,
      },
      {
        id: 'rec_2',
        title: 'Physics Fundamentals Review',
        description: 'Comprehensive review of core physics concepts',
        subject: 'Physics',
        difficulty: 'medium',
        duration: 90,
        questionCount: 40,
        reason: 'To improve your understanding of basic concepts',
        estimatedScore: 70,
      },
      {
        id: 'rec_3',
        title: 'Chemistry Quick Assessment',
        description: 'Quick assessment of your chemistry knowledge',
        subject: 'Chemistry',
        difficulty: 'easy',
        duration: 45,
        questionCount: 25,
        reason: 'To build confidence in chemistry',
        estimatedScore: 75,
      },
      {
        id: 'rec_4',
        title: 'Biology Comprehensive Test',
        description: 'Full-length biology test covering all topics',
        subject: 'Biology',
        difficulty: 'medium',
        duration: 150,
        questionCount: 60,
        reason: 'To identify areas for improvement',
        estimatedScore: 65,
      },
      {
        id: 'rec_5',
        title: 'Mixed Subject Practice',
        description: 'Practice test covering multiple subjects',
        subject: 'Mixed',
        difficulty: 'medium',
        duration: 180,
        questionCount: 75,
        reason: 'To prepare for comprehensive exams',
        estimatedScore: 72,
      },
    ];

    return recommendations.slice(0, limit);
  }

  /**
   * Clear available tests cache
   */
  private clearAvailableTestsCache() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('xploar_available_tests_')) {
        StorageUtils.sessionStorage.remove(key);
      }
    });
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || 'Mock test operation failed');
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
export const mockTestsService = MockTestsService.getInstance();
