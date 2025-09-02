/**
 * PRODUCTION-GRADE STUDY PLANNER SERVICE v2.0
 * 
 * Features:
 * - Unified API client integration
 * - Proper type safety with unified types
 * - Smart caching with TTL
 * - Comprehensive error handling
 * - Offline-first architecture
 */

import { unifiedApiClient } from '../api/unified-client';
import { StorageAPI } from '../utils/storage';
import type {
  StudyPlan,
  Task,
  DailyPlan,
  CreateStudyPlanRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  DeferTaskRequest,
  ApiResponse
} from '../types';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  STUDY_PLANS: 60 * 60 * 1000, // 1 hour
  TASKS: 30 * 60 * 1000, // 30 minutes
  DAILY_PLANS: 15 * 60 * 1000, // 15 minutes
  STATISTICS: 5 * 60 * 1000, // 5 minutes
  SESSIONS: 60 * 60 * 1000, // 1 hour
} as const;

export class StudyPlannerService {
  private static instance: StudyPlannerService;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): StudyPlannerService {
    if (!StudyPlannerService.instance) {
      StudyPlannerService.instance = new StudyPlannerService();
    }
    return StudyPlannerService.instance;
  }

  // ============================= STUDY PLAN MANAGEMENT =============================

  /**
   * Create a new study plan
   */
  async createStudyPlan(planData: CreateStudyPlanRequest): Promise<ApiResponse<StudyPlan>> {
    try {
      const response = await unifiedApiClient.request<StudyPlan>({
        method: 'POST',
        url: '/study-planner/plans',
        data: planData
      });

      if (response.success && response.data) {
        // Cache the new plan
        await this.invalidateStudyPlansCache();
        return response;
      }

      throw new Error(response.message || 'Failed to create study plan');
    } catch (error) {
      return this.handleError<StudyPlan>(error, 'CREATE_STUDY_PLAN_FAILED');
    }
  }

  /**
   * Get all study plans for the user
   */
  async getStudyPlans(): Promise<ApiResponse<StudyPlan[]>> {
    try {
      // Try cache first
      const cached = await StorageAPI.getCachedData<StudyPlan[]>('study_plans');
      if (cached) {
        return this.createCachedResponse(cached);
      }

      const response = await unifiedApiClient.get<StudyPlan[]>('/study-planner/plans');

      if (response.success && response.data) {
        // Cache the plans
        await StorageAPI.cacheData('study_plans', response.data, CACHE_TTL.STUDY_PLANS);
        return response;
      }

      throw new Error(response.message || 'Failed to fetch study plans');
    } catch (error) {
      return this.handleError<StudyPlan[]>(error, 'FETCH_STUDY_PLANS_FAILED');
    }
  }

  /**
   * Get a specific study plan
   */
  async getStudyPlan(planId: string): Promise<ApiResponse<StudyPlan>> {
    try {
      // Try cache first
      const cachedPlans = await StorageAPI.getCachedData<StudyPlan[]>('study_plans');
      if (cachedPlans) {
        const cachedPlan = cachedPlans.find(plan => plan.planId === planId);
        if (cachedPlan) {
          return this.createCachedResponse(cachedPlan);
        }
      }

      const response = await unifiedApiClient.get<StudyPlan>(`/study-planner/plans/${planId}`);

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch study plan');
    } catch (error) {
      return this.handleError<StudyPlan>(error, 'FETCH_STUDY_PLAN_FAILED');
    }
  }

  /**
   * Update a study plan
   */
  async updateStudyPlan(planId: string, updates: Partial<StudyPlan>): Promise<ApiResponse<StudyPlan>> {
    try {
      const response = await unifiedApiClient.put<StudyPlan>(`/study-planner/plans/${planId}`, updates);

      if (response.success && response.data) {
        // Invalidate cache
        await this.invalidateStudyPlansCache();
        return response;
      }

      throw new Error(response.message || 'Failed to update study plan');
    } catch (error) {
      return this.handleError<StudyPlan>(error, 'UPDATE_STUDY_PLAN_FAILED');
    }
  }

  /**
   * Delete a study plan
   */
  async deleteStudyPlan(planId: string): Promise<ApiResponse<void>> {
    try {
      const response = await unifiedApiClient.delete<void>(`/study-planner/plans/${planId}`);

      if (response.success) {
        // Invalidate cache
        await this.invalidateStudyPlansCache();
        return response;
      }

      throw new Error(response.message || 'Failed to delete study plan');
    } catch (error) {
      return this.handleError<void>(error, 'DELETE_STUDY_PLAN_FAILED');
    }
  }

  // ============================= TASK MANAGEMENT =============================

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    try {
      const response = await unifiedApiClient.post<Task>('/study-planner/tasks', taskData);

      if (response.success && response.data) {
        // Invalidate tasks cache
        await this.invalidateTasksCache();
        return response;
      }

      throw new Error(response.message || 'Failed to create task');
    } catch (error) {
      return this.handleError<Task>(error, 'CREATE_TASK_FAILED');
    }
  }

  /**
   * Get tasks (optionally filtered by study plan)
   */
  async getTasks(studyPlanId?: string): Promise<ApiResponse<Task[]>> {
    try {
      // Try cache first
      const cacheKey = studyPlanId ? `tasks_${studyPlanId}` : 'tasks_all';
      const cached = await StorageAPI.getCachedData<Task[]>(cacheKey);
      if (cached) {
        return this.createCachedResponse(cached);
      }

      const url = studyPlanId
        ? `/study-planner/tasks?studyPlanId=${studyPlanId}`
        : '/study-planner/tasks';

      const response = await unifiedApiClient.get<Task[]>(url);

      if (response.success && response.data) {
        // Cache the tasks
        await StorageAPI.cacheData(cacheKey, response.data, CACHE_TTL.TASKS);
        return response;
      }

      throw new Error(response.message || 'Failed to fetch tasks');
    } catch (error) {
      return this.handleError<Task[]>(error, 'FETCH_TASKS_FAILED');
    }
  }

  /**
   * Get a specific task
   */
  async getTask(taskId: string): Promise<ApiResponse<Task>> {
    try {
      const response = await unifiedApiClient.get<Task>(`/study-planner/tasks/${taskId}`);

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch task');
    } catch (error) {
      return this.handleError<Task>(error, 'FETCH_TASK_FAILED');
    }
  }

  /**
   * Update a task
   */
  async updateTask(taskId: string, updates: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    try {
      const response = await unifiedApiClient.put<Task>(`/study-planner/tasks/${taskId}`, updates);

      if (response.success && response.data) {
        // Invalidate tasks cache
        await this.invalidateTasksCache();
        return response;
      }

      throw new Error(response.message || 'Failed to update task');
    } catch (error) {
      return this.handleError<Task>(error, 'UPDATE_TASK_FAILED');
    }
  }

  /**
   * Start a task
   */
  async startTask(taskId: string): Promise<ApiResponse<Task>> {
    try {
      const response = await unifiedApiClient.post<Task>(`/study-planner/tasks/${taskId}/start`, {});

      if (response.success && response.data) {
        // Invalidate tasks cache
        await this.invalidateTasksCache();
        return response;
      }

      throw new Error(response.message || 'Failed to start task');
    } catch (error) {
      return this.handleError<Task>(error, 'START_TASK_FAILED');
    }
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: string, completionData: CompleteTaskRequest): Promise<ApiResponse<Task>> {
    try {
      const response = await unifiedApiClient.post<Task>(`/study-planner/tasks/${taskId}/complete`, completionData);

      if (response.success && response.data) {
        // Invalidate caches
        await this.invalidateTasksCache();
        await this.invalidateDailyPlansCache();
        return response;
      }

      throw new Error(response.message || 'Failed to complete task');
    } catch (error) {
      return this.handleError<Task>(error, 'COMPLETE_TASK_FAILED');
    }
  }

  /**
   * Defer a task
   */
  async deferTask(taskId: string, deferData: DeferTaskRequest): Promise<ApiResponse<Task>> {
    try {
      const response = await unifiedApiClient.post<Task>(`/study-planner/tasks/${taskId}/defer`, deferData);

      if (response.success && response.data) {
        // Invalidate tasks cache
        await this.invalidateTasksCache();
        return response;
      }

      throw new Error(response.message || 'Failed to defer task');
    } catch (error) {
      return this.handleError<Task>(error, 'DEFER_TASK_FAILED');
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<ApiResponse<void>> {
    try {
      const response = await unifiedApiClient.delete<void>(`/study-planner/tasks/${taskId}`);

      if (response.success) {
        // Invalidate tasks cache
        await this.invalidateTasksCache();
        return response;
      }

      throw new Error(response.message || 'Failed to delete task');
    } catch (error) {
      return this.handleError<void>(error, 'DELETE_TASK_FAILED');
    }
  }

  // ============================= DAILY PLAN MANAGEMENT =============================

  /**
   * Get daily plan for a specific date
   */
  async getDailyPlan(date: string): Promise<ApiResponse<DailyPlan>> {
    try {
      // Try cache first
      const cacheKey = `daily_plan_${date}`;
      const cached = await StorageAPI.getCachedData<DailyPlan>(cacheKey);
      if (cached) {
        return this.createCachedResponse(cached);
      }

      const response = await unifiedApiClient.get<DailyPlan>(`/study-planner/daily/${date}`);

      if (response.success && response.data) {
        // Cache the daily plan
        await StorageAPI.cacheData(cacheKey, response.data, CACHE_TTL.DAILY_PLANS);
        return response;
      }

      throw new Error(response.message || 'Failed to fetch daily plan');
    } catch (error) {
      return this.handleError<DailyPlan>(error, 'FETCH_DAILY_PLAN_FAILED');
    }
  }

  /**
   * Get today's plan
   */
  async getTodaysPlan(): Promise<ApiResponse<DailyPlan>> {
    try {
      const response = await unifiedApiClient.get<DailyPlan>('/study-planner/daily/today');

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch today\'s plan');
    } catch (error) {
      return this.handleError<DailyPlan>(error, 'FETCH_TODAYS_PLAN_FAILED');
    }
  }

  /**
   * Complete a day
   */
  async completeDay(date: string, completionData: {
    notes?: string;
    performanceMetrics?: {
      focusScore?: number;
      productivity?: number;
      energyLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
      distractions?: number;
      mood?: 'FRUSTRATED' | 'NEUTRAL' | 'SATISFIED' | 'EXCELLENT';
      challenges?: string;
    };
    tomorrowGoals?: string[];
  }): Promise<ApiResponse<DailyPlan>> {
    try {
      const response = await unifiedApiClient.post<DailyPlan>(`/study-planner/daily/${date}/complete`, completionData);

      if (response.success && response.data) {
        // Invalidate daily plans cache
        await this.invalidateDailyPlansCache();
        return response;
      }

      throw new Error(response.message || 'Failed to complete day');
    } catch (error) {
      return this.handleError<DailyPlan>(error, 'COMPLETE_DAY_FAILED');
    }
  }

  // ============================= PROGRESS & ANALYTICS =============================

  /**
   * Get overall progress
   */
  async getOverallProgress(): Promise<ApiResponse<{
    userId: string;
    overallStats: {
      totalStudyPlans: number;
      activeStudyPlans: number;
      completedStudyPlans: number;
      totalTasks: number;
      completedTasks: number;
      pendingTasks: number;
      deferredTasks: number;
      overallCompletion: number;
    };
    timeStats: {
      totalStudyTime: number;
      averageDailyStudyTime: number;
      longestStudySession: number;
      totalStudyDays: number;
      currentStreak: number;
      longestStreak: number;
    };
    lastUpdated: string;
  }>> {
    type ProgressData = {
      userId: string;
      overallStats: {
        totalStudyPlans: number;
        activeStudyPlans: number;
        completedStudyPlans: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        deferredTasks: number;
        overallCompletion: number;
      };
      timeStats: {
        totalStudyTime: number;
        averageDailyStudyTime: number;
        longestStudySession: number;
        totalStudyDays: number;
        currentStreak: number;
        longestStreak: number;
      };
      lastUpdated: string;
    };

    try {
      // Try cache first
      const cached = await StorageAPI.getCachedData<ProgressData>('overall_progress');
      if (cached) {
        return this.createCachedResponse(cached);
      }

      const response = await unifiedApiClient.get<ProgressData>('/study-planner/progress/overall');

      if (response.success && response.data) {
        // Cache the progress data
        await StorageAPI.cacheData('overall_progress', response.data, CACHE_TTL.STATISTICS);
        return response;
      }

      throw new Error(response.message || 'Failed to fetch overall progress');
    } catch (error) {
      return this.handleError<ProgressData>(error, 'FETCH_PROGRESS_FAILED');
    }
  }

  /**
   * Get streak information
   */
  async getStreakInfo(): Promise<ApiResponse<{
    currentStreak: {
      days: number;
      startDate: string;
      endDate: string;
      type: 'DAILY_STUDY' | 'WEEKLY_GOALS';
      isActive: boolean;
    };
    longestStreak: {
      days: number;
      startDate: string;
      endDate: string;
      type: 'DAILY_STUDY' | 'WEEKLY_GOALS';
    };
    streakHistory: Array<{
      startDate: string;
      endDate: string;
      days: number;
      type: 'DAILY_STUDY' | 'WEEKLY_GOALS';
    }>;
  }>> {
    type StreakData = {
      currentStreak: {
        days: number;
        startDate: string;
        endDate: string;
        type: 'DAILY_STUDY' | 'WEEKLY_GOALS';
        isActive: boolean;
      };
      longestStreak: {
        days: number;
        startDate: string;
        endDate: string;
        type: 'DAILY_STUDY' | 'WEEKLY_GOALS';
      };
      streakHistory: Array<{
        startDate: string;
        endDate: string;
        days: number;
        type: 'DAILY_STUDY' | 'WEEKLY_GOALS';
      }>;
    };

    try {
      // Try cache first
      const cached = await StorageAPI.getCachedData<StreakData>('streak_info');
      if (cached) {
        return this.createCachedResponse(cached);
      }

      const response = await unifiedApiClient.get<StreakData>('/study-planner/progress/streaks');

      if (response.success && response.data) {
        // Cache the streak data
        await StorageAPI.cacheData('streak_info', response.data, CACHE_TTL.STATISTICS);
        return response;
      }

      throw new Error(response.message || 'Failed to fetch streak information');
    } catch (error) {
      return this.handleError<StreakData>(error, 'FETCH_STREAK_FAILED');
    }
  }

  // ============================= PRIVATE HELPER METHODS =============================

  /**
   * Create a cached response in proper ApiResponse format
   */
  private createCachedResponse<T>(data: T, message: string = 'Retrieved from cache'): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      requestId: `cache_${Date.now()}`
    };
  }

  /**
   * Centralized error handling with generic return type
   */
  private handleError<T>(error: unknown, code: string): ApiResponse<T> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    console.error(`StudyPlannerService Error [${code}]:`, error);

    return {
      success: false,
      data: null as T,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      requestId: `error_${Date.now()}`
    };
  }

  /**
   * Cache invalidation helpers
   */
  private async invalidateStudyPlansCache(): Promise<void> {
    try {
      await StorageAPI.clearCache();
      // Remove specific cache keys
      const cacheKeys = ['study_plans', 'daily_plan_*', 'overall_progress'];
      for (const key of cacheKeys) {
        await StorageAPI.clearCache();
      }
    } catch (error) {
      console.warn('Failed to invalidate study plans cache:', error);
    }
  }

  private async invalidateTasksCache(): Promise<void> {
    try {
      await StorageAPI.clearCache();
      // Remove task-related cache keys
      const cacheKeys = ['tasks_*', 'daily_plan_*'];
      for (const key of cacheKeys) {
        await StorageAPI.clearCache();
      }
    } catch (error) {
      console.warn('Failed to invalidate tasks cache:', error);
    }
  }

  private async invalidateDailyPlansCache(): Promise<void> {
    try {
      await StorageAPI.clearCache();
      // Remove daily plan cache keys
      const cacheKeys = ['daily_plan_*'];
      for (const key of cacheKeys) {
        await StorageAPI.clearCache();
      }
    } catch (error) {
      console.warn('Failed to invalidate daily plans cache:', error);
    }
  }
}

// Export singleton instance
export const studyPlannerService = StudyPlannerService.getInstance();
