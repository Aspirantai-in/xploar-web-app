import { apiClient } from './client';
import {
  StudyPlan,
  CreateStudyPlanRequest,
  PlanStatus,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  DeferTaskRequest,
  DailyPlan,
  CompleteDayRequest,
  OverallProgress,
  StreakInfo,
  // New imports
  StudyGoal,
  CreateGoalRequest,
  UpdateGoalRequest,
  StudyReminder,
  CreateReminderRequest,
  UpdateReminderRequest,
  StudySession,
  CreateSessionRequest,
  UpdateSessionRequest,
  StartSessionRequest,
  EndSessionRequest,
  TaskDependency,
  CreateTaskDependencyRequest,
  DeleteStudyPlanRequest,
  PauseStudyPlanRequest,
  ResumeStudyPlanRequest,
  StudyPlanActionResponse
} from '@/lib/types/study-planner';
import { ApiResponse, PaginatedResponse, SubjectProgress, PerformanceTrends } from '@/lib/types';
export class StudyPlannerService {
  // Feature 1: Study Plan Management
  async createStudyPlan(planData: CreateStudyPlanRequest): Promise<StudyPlan> {
    try {
      const response = await apiClient.post<StudyPlan>('/api/study-planner/plans', planData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create study plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create study plan');
    }
  }

  async getStudyPlan(planId: string): Promise<StudyPlan> {
    try {
      const response = await apiClient.get<StudyPlan>(`/api/study-planner/plans/${planId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch study plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch study plan');
    }
  }

  async updateStudyPlan(planId: string, updates: Partial<StudyPlan>): Promise<StudyPlan> {
    try {
      const response = await apiClient.put<StudyPlan>(`/api/study-planner/plans/${planId}`, updates);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update study plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update study plan');
    }
  }

  async listStudyPlans(params: {
    page?: number;
    size?: number;
    status?: PlanStatus;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<PaginatedResponse<StudyPlan>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get<PaginatedResponse<StudyPlan>>(`/api/study-planner/plans?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch study plans');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch study plans');
    }
  }

  // Feature 2: Task Management
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<Task>('/api/study-planner/tasks', taskData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create task');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create task');
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`/api/study-planner/tasks/${taskId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch task');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch task');
    }
  }

  async updateTask(taskId: string, updates: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.put<Task>(`/api/study-planner/tasks/${taskId}`, updates);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update task');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update task');
    }
  }

  async startTask(taskId: string): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`/api/study-planner/tasks/${taskId}/start`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to start task');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to start task');
    }
  }

  async completeTask(taskId: string, completionData: CompleteTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`/api/study-planner/tasks/${taskId}/complete`, completionData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to complete task');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to complete task');
    }
  }

  async deferTask(taskId: string, deferData: DeferTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`/api/study-planner/tasks/${taskId}/defer`, deferData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to defer task');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to defer task');
    }
  }

  async listTasks(params: {
    page?: number;
    size?: number;
    status?: string;
    priority?: string;
    subjectArea?: string;
    taskType?: string;
    dueDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<PaginatedResponse<Task>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.subjectArea) queryParams.append('subjectArea', params.subjectArea);
      if (params.taskType) queryParams.append('taskType', params.taskType);
      if (params.dueDate) queryParams.append('dueDate', params.dueDate);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get<PaginatedResponse<Task>>(`/api/study-planner/tasks?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch tasks');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch tasks');
    }
  }

  // Feature 3: Daily Plan Management
  /**
   * Get daily plan for a specific date
   */
  async getDailyPlan(date: string): Promise<DailyPlan> {
    try {
      const response = await apiClient.get<DailyPlan>(`/api/study-planner/daily/${date}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch daily plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch daily plan');
    }
  }

  // Enhanced Study Plan Management
  /**
   * Delete study plan (soft delete)
   */
  async deleteStudyPlan(planId: string, request: DeleteStudyPlanRequest): Promise<StudyPlanActionResponse> {
    try {
      const response = await apiClient.delete<StudyPlanActionResponse>(`/api/study-planner/plans/${planId}`, {
        data: request
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete study plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to delete study plan');
    }
  }

  /**
   * Pause study plan
   */
  async pauseStudyPlan(planId: string, request: PauseStudyPlanRequest): Promise<StudyPlanActionResponse> {
    try {
      const response = await apiClient.post<StudyPlanActionResponse>(`/api/study-planner/plans/${planId}/pause`, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to pause study plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to pause study plan');
    }
  }

  /**
   * Resume study plan
   */
  async resumeStudyPlan(planId: string, request: ResumeStudyPlanRequest): Promise<StudyPlanActionResponse> {
    try {
      const response = await apiClient.post<StudyPlanActionResponse>(`/api/study-planner/plans/${planId}/resume`, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to resume study plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to resume study plan');
    }
  }

  // Goals Management
  /**
   * Create study goal
   */
  async createGoal(goalData: CreateGoalRequest): Promise<StudyGoal> {
    try {
      const response = await apiClient.post<StudyGoal>('/api/study-planner/goals', goalData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create goal');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create goal');
    }
  }

  /**
   * Get study goals
   */
  async getGoals(params: {
    page?: number;
    size?: number;
    status?: string;
    goalType?: string;
    studyPlanId?: string;
  } = {}): Promise<PaginatedResponse<StudyGoal>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.goalType) queryParams.append('goalType', params.goalType);
      if (params.studyPlanId) queryParams.append('studyPlanId', params.studyPlanId);

      const response = await apiClient.get<PaginatedResponse<StudyGoal>>(`/api/study-planner/goals?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch goals');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch goals');
    }
  }

  /**
   * Update study goal
   */
  async updateGoal(goalId: string, updates: UpdateGoalRequest): Promise<StudyGoal> {
    try {
      const response = await apiClient.put<StudyGoal>(`/api/study-planner/goals/${goalId}`, updates);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update goal');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update goal');
    }
  }

  /**
   * Delete study goal
   */
  async deleteGoal(goalId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/study-planner/goals/${goalId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete goal');
      }
    } catch (error) {
      throw this.handleError(error, 'Failed to delete goal');
    }
  }

  // Reminders Management
  /**
   * Create reminder
   */
  async createReminder(reminderData: CreateReminderRequest): Promise<StudyReminder> {
    try {
      const response = await apiClient.post<StudyReminder>('/api/study-planner/reminders', reminderData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create reminder');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create reminder');
    }
  }

  /**
   * Get reminders
   */
  async getReminders(params: {
    page?: number;
    size?: number;
    isActive?: boolean;
    reminderType?: string;
  } = {}): Promise<PaginatedResponse<StudyReminder>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params.reminderType) queryParams.append('reminderType', params.reminderType);

      const response = await apiClient.get<PaginatedResponse<StudyReminder>>(`/api/study-planner/reminders?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch reminders');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch reminders');
    }
  }

  /**
   * Update reminder
   */
  async updateReminder(reminderId: string, updates: UpdateReminderRequest): Promise<StudyReminder> {
    try {
      const response = await apiClient.put<StudyReminder>(`/api/study-planner/reminders/${reminderId}`, updates);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update reminder');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update reminder');
    }
  }

  /**
   * Delete reminder
   */
  async deleteReminder(reminderId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/study-planner/reminders/${reminderId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete reminder');
      }
    } catch (error) {
      throw this.handleError(error, 'Failed to delete reminder');
    }
  }

  // Study Sessions Management
  /**
   * Create study session
   */
  async createSession(sessionData: CreateSessionRequest): Promise<StudySession> {
    try {
      const response = await apiClient.post<StudySession>('/api/study-planner/sessions', sessionData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create session');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create session');
    }
  }

  /**
   * Get study sessions
   */
  async getSessions(params: {
    page?: number;
    size?: number;
    status?: string;
    studyPlanId?: string;
    date?: string;
  } = {}): Promise<PaginatedResponse<StudySession>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.studyPlanId) queryParams.append('studyPlanId', params.studyPlanId);
      if (params.date) queryParams.append('date', params.date);

      const response = await apiClient.get<PaginatedResponse<StudySession>>(`/api/study-planner/sessions?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch sessions');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch sessions');
    }
  }

  /**
   * Start study session
   */
  async startSession(sessionId: string, request: StartSessionRequest): Promise<StudySession> {
    try {
      const response = await apiClient.post<StudySession>(`/api/study-planner/sessions/${sessionId}/start`, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to start session');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to start session');
    }
  }

  /**
   * End study session
   */
  async endSession(sessionId: string, request: EndSessionRequest): Promise<StudySession> {
    try {
      const response = await apiClient.post<StudySession>(`/api/study-planner/sessions/${sessionId}/end`, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to end session');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to end session');
    }
  }

  /**
   * Update study session
   */
  async updateSession(sessionId: string, updates: UpdateSessionRequest): Promise<StudySession> {
    try {
      const response = await apiClient.put<StudySession>(`/api/study-planner/sessions/${sessionId}`, updates);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update session');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update session');
    }
  }

  // Task Dependencies Management
  /**
   * Create task dependency
   */
  async createTaskDependency(dependencyData: CreateTaskDependencyRequest): Promise<TaskDependency> {
    try {
      const response = await apiClient.post<TaskDependency>('/api/study-planner/tasks/dependencies', dependencyData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create task dependency');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create task dependency');
    }
  }

  /**
   * Get task dependencies
   */
  async getTaskDependencies(taskId: string): Promise<TaskDependency[]> {
    try {
      const response = await apiClient.get<TaskDependency[]>(`/api/study-planner/tasks/${taskId}/dependencies`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch task dependencies');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch task dependencies');
    }
  }

  /**
   * Delete task dependency
   */
  async deleteTaskDependency(dependencyId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/study-planner/tasks/dependencies/${dependencyId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete task dependency');
      }
    } catch (error) {
      throw this.handleError(error, 'Failed to delete task dependency');
    }
  }

  async getTodayPlan(): Promise<DailyPlan> {
    try {
      const response = await apiClient.get<DailyPlan>('/api/study-planner/daily/today');
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch today\'s plan');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch today\'s plan');
    }
  }

  async completeDay(date: string, completionData: CompleteDayRequest): Promise<DailyPlan> {
    try {
      const response = await apiClient.post<DailyPlan>(`/api/study-planner/daily/${date}/complete`, completionData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to complete day');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to complete day');
    }
  }

  async navigateDailyPlans(params: {
    direction: 'NEXT' | 'PREVIOUS' | 'SPECIFIC';
    currentDate: string;
    targetDate?: string;
  }): Promise<DailyPlan> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('direction', params.direction);
      queryParams.append('currentDate', params.currentDate);
      if (params.targetDate) queryParams.append('targetDate', params.targetDate);

      const response = await apiClient.get<DailyPlan>(`/api/study-planner/daily/navigate?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to navigate daily plans');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to navigate daily plans');
    }
  }

  // Feature 4: Progress Tracking
  async getOverallProgress(): Promise<OverallProgress> {
    try {
      const response = await apiClient.get<OverallProgress>('/api/study-planner/progress/overall');
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch overall progress');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch overall progress');
    }
  }

  async getStudyPlanProgress(planId: string): Promise<OverallProgress> {
    try {
      const response = await apiClient.get<OverallProgress>(`/api/study-planner/progress/study-plan/${planId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch study plan progress');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch study plan progress');
    }
  }

  async getSubjectProgress(subjectArea: string, timeRange: string = 'MONTH'): Promise<SubjectProgress> {
    try {
      const response = await apiClient.get<ApiResponse<SubjectProgress>>(`/api/study-planner/progress/subject/${subjectArea}?timeRange=${timeRange}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subject progress');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch subject progress');
    }
  }

  async getStreaks(): Promise<StreakInfo> {
    try {
      const response = await apiClient.get<StreakInfo>('/api/study-planner/progress/streaks');
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch streaks');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch streaks');
    }
  }

  async getPerformanceAnalytics(params: {
    timeRange: string;
    metrics: string;
  }): Promise<PerformanceTrends> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('timeRange', params.timeRange);
      queryParams.append('metrics', params.metrics);

      const response = await apiClient.get<ApiResponse<PerformanceTrends>>(`/api/study-planner/progress/analytics?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch performance analytics');
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch performance analytics');
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

export const studyPlannerService = new StudyPlannerService();
