import { ProgressService as ApiProgressService } from '../api/progress';
import { StorageUtils } from '../utils/storage';
import { DateUtils } from '../utils/date';

export class ProgressService {
  private static instance: ProgressService;
  private apiService: ApiProgressService;

  private constructor() {
    this.apiService = new ApiProgressService();
  }

  public static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  /**
   * Get overall progress summary
   */
  async getOverallProgress() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.sessionStorage.get('xploar_overall_progress');
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getOverallProgress();
      if (response.success && response.data) {
        // Cache the progress data
        StorageUtils.sessionStorage.set('xploar_overall_progress', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch overall progress');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get study plan progress
   */
  async getStudyPlanProgress(planId?: string) {
    try {
      const response = await this.apiService.getStudyPlanProgress(planId);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(response.message || 'Failed to fetch study plan progress');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get subject-wise progress
   */
  async getSubjectProgress(subjectId?: string) {
    try {
      const response = await this.apiService.getSubjectProgress(subjectId);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(response.message || 'Failed to fetch subject progress');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get streak information
   */
  async getStreakInfo() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.sessionStorage.get('xploar_streak_info');
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getStreakInfo();
      if (response.success && response.data) {
        // Cache the streak data
        StorageUtils.sessionStorage.set('xploar_streak_info', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch streak information');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics(timeframe: 'week' | 'month' | 'year' = 'week') {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_performance_analytics_${timeframe}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getPerformanceAnalytics(timeframe);
      if (response.success && response.data) {
        // Cache the analytics data
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch performance analytics');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get learning insights
   */
  async getLearningInsights() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.sessionStorage.get('xploar_learning_insights');
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getLearningInsights();

      // For now, generate mock insights
      const mockInsights = this.generateMockLearningInsights();

      // Cache the insights
      StorageUtils.sessionStorage.set('xploar_learning_insights', mockInsights);
      return { success: true, data: mockInsights };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get goal tracking data
   */
  async getGoalTracking() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.localStorage.get('xploar_goal_tracking');
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getGoalTracking();

      // For now, generate mock goal data
      const mockGoals = this.generateMockGoalTracking();

      // Cache the goals
      StorageUtils.localStorage.set('xploar_goal_tracking', mockGoals);
      return { success: true, data: mockGoals };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(goalId: string, progress: number) {
    try {
      // Update cached goal
      const cached = StorageUtils.localStorage.get('xploar_goal_tracking') || [];
      const goalIndex = cached.findIndex((goal: StudyGoal) => goal.goalId === goalId);

      if (goalIndex !== -1) {
        cached[goalIndex].currentProgress = progress;
        cached[goalIndex].lastUpdated = new Date().toISOString();

        // Check if goal is completed
        if (progress >= cached[goalIndex].target) {
          cached[goalIndex].status = 'completed';
          cached[goalIndex].completedAt = new Date().toISOString();
        }

        StorageUtils.localStorage.set('xploar_goal_tracking', cached);
      }

      // In a real app, you would also send this to the API
      // await this.apiService.updateGoalProgress(goalId, progress);

      return { success: true, data: cached[goalIndex] };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new goal
   */
  async createGoal(goalData: {
    title: string;
    description?: string;
    target: number;
    unit: string;
    deadline?: string;
    category: 'study' | 'performance' | 'habit' | 'skill';
    priority: 'low' | 'medium' | 'high';
  }) {
    try {
      // Validate goal data
      if (!goalData.title.trim()) {
        throw new Error('Goal title is required');
      }

      if (goalData.target <= 0) {
        throw new Error('Goal target must be greater than 0');
      }

      if (goalData.deadline && !DateUtils.isValidDate(goalData.deadline)) {
        throw new Error('Invalid deadline format');
      }

      // Create new goal
      const newGoal = {
        id: this.generateGoalId(),
        ...goalData,
        currentProgress: 0,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      // Add to cached goals
      const cached = StorageUtils.localStorage.get('xploar_goal_tracking') || [];
      cached.push(newGoal);
      StorageUtils.localStorage.set('xploar_goal_tracking', cached);

      // In a real app, you would also send this to the API
      // await this.apiService.createGoal(goalData);

      return { success: true, data: newGoal };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get study session history
   */
  async getStudySessionHistory(timeframe: 'week' | 'month' | 'year' = 'week') {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_study_session_history_${timeframe}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getStudySessionHistory(timeframe);

      // For now, generate mock session history
      const mockHistory = this.generateMockStudySessionHistory(timeframe);

      // Cache the history
      StorageUtils.sessionStorage.set(cacheKey, mockHistory);
      return { success: true, data: mockHistory };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get topic performance breakdown
   */
  async getTopicPerformance() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.sessionStorage.get('xploar_topic_performance');
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getTopicPerformance();

      // For now, generate mock topic performance
      const mockTopicPerformance = this.generateMockTopicPerformance();

      // Cache the topic performance
      StorageUtils.sessionStorage.set('xploar_topic_performance', mockTopicPerformance);
      return { success: true, data: mockTopicPerformance };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate mock learning insights
   */
  private generateMockLearningInsights() {
    return {
      strengths: [
        { topic: 'Mathematics', score: 85, trend: 'improving' },
        { topic: 'Physics', score: 78, trend: 'stable' },
        { topic: 'Chemistry', score: 72, trend: 'improving' },
      ],
      weaknesses: [
        { topic: 'Biology', score: 45, trend: 'declining' },
        { topic: 'History', score: 52, trend: 'stable' },
      ],
      recommendations: [
        'Focus more on Biology concepts, especially cell biology',
        'Practice more problem-solving in Mathematics',
        'Review historical timelines and events',
        'Take more mock tests to improve time management',
      ],
      studyPatterns: {
        bestTime: 'Morning (6 AM - 10 AM)',
        optimalDuration: '25 minutes',
        preferredSubjects: ['Mathematics', 'Physics'],
        studyFrequency: 'Daily',
      },
    };
  }

  /**
   * Generate mock goal tracking
   */
  private generateMockGoalTracking() {
    return [
      {
        id: 'goal_1',
        title: 'Complete 100 Mathematics Problems',
        description: 'Solve 100 practice problems across all topics',
        target: 100,
        currentProgress: 67,
        unit: 'problems',
        category: 'study',
        priority: 'high',
        deadline: '2024-02-15',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastUpdated: '2024-01-20T00:00:00.000Z',
      },
      {
        id: 'goal_2',
        title: 'Achieve 80% in Mock Tests',
        description: 'Maintain 80% or higher score in all mock tests',
        target: 80,
        currentProgress: 75,
        unit: 'percentage',
        category: 'performance',
        priority: 'medium',
        deadline: '2024-03-01',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastUpdated: '2024-01-20T00:00:00.000Z',
      },
      {
        id: 'goal_3',
        title: 'Study for 2 Hours Daily',
        description: 'Maintain consistent daily study routine',
        target: 30,
        currentProgress: 20,
        unit: 'days',
        category: 'habit',
        priority: 'high',
        deadline: '2024-02-01',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastUpdated: '2024-01-20T00:00:00.000Z',
      },
    ];
  }

  /**
   * Generate mock study session history
   */
  private generateMockStudySessionHistory(timeframe: string) {
    const now = new Date();
    const history = [];

    // Generate realistic mock data based on timeframe
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Generate 1-3 sessions per day
      const sessionsCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < sessionsCount; j++) {
        const sessionStart = new Date(date);
        sessionStart.setHours(Math.floor(Math.random() * 12) + 6); // 6 AM - 6 PM
        sessionStart.setMinutes(Math.floor(Math.random() * 60));

        const duration = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
        const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);

        history.push({
          id: `session_${i}_${j}`,
          date: date.toISOString().split('T')[0],
          startTime: sessionStart.toISOString(),
          endTime: sessionEnd.toISOString(),
          duration,
          subject: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History'][Math.floor(Math.random() * 5)],
          tasksCompleted: Math.floor(Math.random() * 5) + 1,
          efficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
        });
      }
    }

    return history;
  }

  /**
   * Generate mock topic performance
   */
  private generateMockTopicPerformance() {
    const topics = [
      'Algebra', 'Geometry', 'Calculus', 'Trigonometry',
      'Mechanics', 'Thermodynamics', 'Electromagnetism',
      'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry',
      'Cell Biology', 'Genetics', 'Ecology', 'Evolution',
      'Ancient History', 'Modern History', 'World Wars',
      'Poetry', 'Prose', 'Drama', 'Literature Analysis',
    ];

    return topics.map(topic => ({
      topic,
      score: Math.floor(Math.random() * 40) + 30, // 30-70%
      questionsAttempted: Math.floor(Math.random() * 50) + 10,
      questionsCorrect: Math.floor(Math.random() * 30) + 5,
      timeSpent: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      lastStudied: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
    }));
  }

  /**
   * Generate a unique goal ID
   */
  private generateGoalId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || 'Progress tracking operation failed');
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
export const progressService = ProgressService.getInstance();
