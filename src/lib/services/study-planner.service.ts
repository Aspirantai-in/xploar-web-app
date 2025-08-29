import { StudyPlannerService as ApiStudyPlannerService } from '../api/study-planner';
import { ValidationUtils } from '../utils/validation';
import { StorageUtils } from '../utils/storage';
import { DateUtils } from '../utils/date';

export class StudyPlannerService {
  private static instance: StudyPlannerService;
  private apiService: ApiStudyPlannerService;

  private constructor() {
    this.apiService = new ApiStudyPlannerService();
  }

  public static getInstance(): StudyPlannerService {
    if (!StudyPlannerService.instance) {
      StudyPlannerService.instance = new StudyPlannerService();
    }
    return StudyPlannerService.instance;
  }

  /**
   * Create a new study plan
   */
  async createStudyPlan(planData: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    subjects: string[];
    goals?: string[];
    estimatedHoursPerDay?: number;
  }) {
    try {
      // Validate plan data
      const validation = ValidationUtils.validateStudyPlan(planData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.createPlan(planData);
      if (response.success && response.data) {
        // Cache the new plan
        this.cacheStudyPlan(response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to create study plan');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all study plans for the user
   */
  async getStudyPlans() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.sessionStorage.get('xploar_study_plans');
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getPlans();
      if (response.success && response.data) {
        // Cache the plans
        StorageUtils.sessionStorage.set('xploar_study_plans', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch study plans');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific study plan by ID
   */
  async getStudyPlan(planId: string) {
    try {
      // Try to get from cache first
      const cachedPlans = StorageUtils.sessionStorage.get('xploar_study_plans');
      if (cachedPlans) {
        const cachedPlan = cachedPlans.find((plan: any) => plan.id === planId);
        if (cachedPlan) {
          return { success: true, data: cachedPlan };
        }
      }

      const response = await this.apiService.getPlan(planId);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(response.message || 'Failed to fetch study plan');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a study plan
   */
  async updateStudyPlan(planId: string, updates: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    subjects?: string[];
    goals?: string[];
    estimatedHoursPerDay?: number;
    status?: 'active' | 'completed' | 'paused';
  }) {
    try {
      const response = await this.apiService.updatePlan(planId, updates);
      if (response.success && response.data) {
        // Update cached plan
        this.updateCachedStudyPlan(planId, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to update study plan');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a study plan
   */
  async deleteStudyPlan(planId: string) {
    try {
      const response = await this.apiService.deletePlan(planId);
      if (response.success) {
        // Remove from cache
        this.removeCachedStudyPlan(planId);
        return response;
      }
      throw new Error(response.message || 'Failed to delete study plan');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: {
    title: string;
    description?: string;
    studyPlanId: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    estimatedTime: number;
    subject: string;
    tags?: string[];
  }) {
    try {
      // Validate task data
      const validation = ValidationUtils.validateTask(taskData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.createTask(taskData);
      if (response.success && response.data) {
        // Cache the new task
        this.cacheTask(response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to create task');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tasks for a study plan
   */
  async getTasks(studyPlanId?: string) {
    try {
      // Try to get from cache first
      const cached = StorageUtils.sessionStorage.get('xploar_tasks');
      if (cached) {
        if (studyPlanId) {
          const filteredTasks = cached.filter((task: any) => task.studyPlanId === studyPlanId);
          return { success: true, data: filteredTasks };
        }
        return { success: true, data: cached };
      }

      const response = await this.apiService.getTasks(studyPlanId);
      if (response.success && response.data) {
        // Cache the tasks
        StorageUtils.sessionStorage.set('xploar_tasks', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch tasks');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a task
   */
  async updateTask(taskId: string, updates: {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    estimatedTime?: number;
    subject?: string;
    tags?: string[];
    status?: 'pending' | 'in-progress' | 'completed' | 'deferred';
  }) {
    try {
      const response = await this.apiService.updateTask(taskId, updates);
      if (response.success && response.data) {
        // Update cached task
        this.updateCachedTask(taskId, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to update task');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string) {
    try {
      const response = await this.apiService.deleteTask(taskId);
      if (response.success) {
        // Remove from cache
        this.removeCachedTask(taskId);
        return response;
      }
      throw new Error(response.message || 'Failed to delete task');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start a study session
   */
  async startStudySession(sessionData: {
    studyPlanId: string;
    taskIds: string[];
    duration: number;
    subject: string;
  }) {
    try {
      // Validate session data
      if (sessionData.duration < 5 || sessionData.duration > 480) {
        throw new Error('Study session duration must be between 5 minutes and 8 hours');
      }

      if (sessionData.taskIds.length === 0) {
        throw new Error('At least one task must be selected for a study session');
      }

      const response = await this.apiService.startSession(sessionData);
      if (response.success && response.data) {
        // Cache the session
        this.cacheStudySession(response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to start study session');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * End a study session
   */
  async endStudySession(sessionId: string, sessionData: {
    completedTaskIds: string[];
    actualDuration: number;
    notes?: string;
    rating?: number;
  }) {
    try {
      const response = await this.apiService.endSession(sessionId, sessionData);
      if (response.success && response.data) {
        // Update cached session
        this.updateCachedStudySession(sessionId, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to end study session');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get daily plan for a specific date
   */
  async getDailyPlan(date: string) {
    try {
      // Validate date
      if (!ValidationUtils.isValidDate(date)) {
        throw new Error('Invalid date format');
      }

      const response = await this.apiService.getDailyPlan(date);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(response.message || 'Failed to fetch daily plan');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Complete daily plan
   */
  async completeDailyPlan(date: string, completionData: {
    completedTaskIds: string[];
    totalStudyTime: number;
    notes?: string;
  }) {
    try {
      const response = await this.apiService.completeDailyPlan(date, completionData);
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Failed to complete daily plan');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get study statistics
   */
  async getStudyStatistics(timeframe: 'week' | 'month' | 'year' = 'week') {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_study_stats_${timeframe}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getStatistics(timeframe);
      
      // For now, generate mock statistics
      const mockStats = this.generateMockStudyStatistics(timeframe);
      
      // Cache the statistics
      StorageUtils.sessionStorage.set(cacheKey, mockStats);
      return { success: true, data: mockStats };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate mock study statistics (temporary)
   */
  private generateMockStudyStatistics(timeframe: string) {
    const now = new Date();
    const stats = {
      totalStudyTime: 0,
      completedTasks: 0,
      averageSessionLength: 0,
      subjects: {} as Record<string, any>,
      dailyProgress: [] as any[],
      streaks: {
        current: 0,
        longest: 0,
        total: 0,
      },
    };

    // Generate realistic mock data based on timeframe
    if (timeframe === 'week') {
      stats.totalStudyTime = Math.floor(Math.random() * 20) + 10; // 10-30 hours
      stats.completedTasks = Math.floor(Math.random() * 15) + 5; // 5-20 tasks
      stats.averageSessionLength = Math.floor(Math.random() * 30) + 25; // 25-55 minutes
      stats.streaks.current = Math.floor(Math.random() * 7) + 1; // 1-7 days
      stats.streaks.longest = Math.floor(Math.random() * 14) + 7; // 7-21 days
    } else if (timeframe === 'month') {
      stats.totalStudyTime = Math.floor(Math.random() * 80) + 40; // 40-120 hours
      stats.completedTasks = Math.floor(Math.random() * 60) + 20; // 20-80 tasks
      stats.averageSessionLength = Math.floor(Math.random() * 30) + 25; // 25-55 minutes
      stats.streaks.current = Math.floor(Math.random() * 7) + 1; // 1-7 days
      stats.streaks.longest = Math.floor(Math.random() * 30) + 15; // 15-45 days
    }

    // Generate subject breakdown
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature'];
    subjects.forEach(subject => {
      stats.subjects[subject] = {
        studyTime: Math.floor(Math.random() * 10) + 2,
        completedTasks: Math.floor(Math.random() * 8) + 1,
        progress: Math.floor(Math.random() * 40) + 30,
      };
    });

    // Generate daily progress
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      stats.dailyProgress.push({
        date: date.toISOString().split('T')[0],
        studyTime: Math.floor(Math.random() * 4) + 1,
        completedTasks: Math.floor(Math.random() * 3) + 0,
      });
    }

    return stats;
  }

  /**
   * Cache a study plan
   */
  private cacheStudyPlan(plan: any) {
    const cached = StorageUtils.sessionStorage.get('xploar_study_plans') || [];
    cached.push(plan);
    StorageUtils.sessionStorage.set('xploar_study_plans', cached);
  }

  /**
   * Update cached study plan
   */
  private updateCachedStudyPlan(planId: string, updatedPlan: any) {
    const cached = StorageUtils.sessionStorage.get('xploar_study_plans') || [];
    const index = cached.findIndex((plan: any) => plan.id === planId);
    if (index !== -1) {
      cached[index] = updatedPlan;
      StorageUtils.sessionStorage.set('xploar_study_plans', cached);
    }
  }

  /**
   * Remove cached study plan
   */
  private removeCachedStudyPlan(planId: string) {
    const cached = StorageUtils.sessionStorage.get('xploar_study_plans') || [];
    const filtered = cached.filter((plan: any) => plan.id !== planId);
    StorageUtils.sessionStorage.set('xploar_study_plans', filtered);
  }

  /**
   * Cache a task
   */
  private cacheTask(task: any) {
    const cached = StorageUtils.sessionStorage.get('xploar_tasks') || [];
    cached.push(task);
    StorageUtils.sessionStorage.set('xploar_tasks', cached);
  }

  /**
   * Update cached task
   */
  private updateCachedTask(taskId: string, updatedTask: any) {
    const cached = StorageUtils.sessionStorage.get('xploar_tasks') || [];
    const index = cached.findIndex((task: any) => task.id === taskId);
    if (index !== -1) {
      cached[index] = updatedTask;
      StorageUtils.sessionStorage.set('xploar_tasks', cached);
    }
  }

  /**
   * Remove cached task
   */
  private removeCachedTask(taskId: string) {
    const cached = StorageUtils.sessionStorage.get('xploar_tasks') || [];
    const filtered = cached.filter((task: any) => task.id !== taskId);
    StorageUtils.sessionStorage.set('xploar_tasks', filtered);
  }

  /**
   * Cache a study session
   */
  private cacheStudySession(session: any) {
    const cached = StorageUtils.sessionStorage.get('xploar_study_sessions') || [];
    cached.push(session);
    StorageUtils.sessionStorage.set('xploar_study_sessions', cached);
  }

  /**
   * Update cached study session
   */
  private updateCachedStudySession(sessionId: string, updatedSession: any) {
    const cached = StorageUtils.sessionStorage.get('xploar_study_sessions') || [];
    const index = cached.findIndex((session: any) => session.id === sessionId);
    if (index !== -1) {
      cached[index] = updatedSession;
      StorageUtils.sessionStorage.set('xploar_study_sessions', cached);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || 'Study planner operation failed');
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
export const studyPlannerService = StudyPlannerService.getInstance();
