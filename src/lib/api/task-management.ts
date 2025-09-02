import { apiClient } from './client';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  DeferTaskRequest,
  UUID
} from '../types/study-planner';
import { PaginatedResponse } from '../types';

/**
 * Task Management API Service
 * Implements all 7 Task Management endpoints from API Documentation v2.0
 */
export class TaskManagementService {
  private static readonly BASE_PATH = '/api/study-planner/tasks';

  /**
   * Create a new task
   * POST /api/study-planner/tasks
   */
  static async createTask(request: CreateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(this.BASE_PATH, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create task');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Get a specific task by ID
   * GET /api/study-planner/tasks/{taskId}
   */
  static async getTask(taskId: UUID): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`${this.BASE_PATH}/${taskId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch task');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   * PUT /api/study-planner/tasks/{taskId}
   */
  static async updateTask(
    taskId: UUID,
    request: UpdateTaskRequest
  ): Promise<Task> {
    try {
      const response = await apiClient.put<Task>(`${this.BASE_PATH}/${taskId}`, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update task');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Start a task (mark as IN_PROGRESS)
   * POST /api/study-planner/tasks/{taskId}/start
   */
  static async startTask(taskId: UUID): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`${this.BASE_PATH}/${taskId}/start`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to start task');
      }
      return response.data;
    } catch (error) {
      console.error('Error starting task:', error);
      throw error;
    }
  }

  /**
   * Complete a task
   * POST /api/study-planner/tasks/{taskId}/complete
   */
  static async completeTask(
    taskId: UUID,
    request: CompleteTaskRequest
  ): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`${this.BASE_PATH}/${taskId}/complete`, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to complete task');
      }
      return response.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  /**
   * Defer a task to a later date
   * POST /api/study-planner/tasks/{taskId}/defer
   */
  static async deferTask(
    taskId: UUID,
    request: DeferTaskRequest
  ): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`${this.BASE_PATH}/${taskId}/defer`, request);
      if (!response.success) {
        throw new Error(response.message || 'Failed to defer task');
      }
      return response.data;
    } catch (error) {
      console.error('Error deferring task:', error);
      throw error;
    }
  }

  /**
   * List tasks with optional filtering and pagination
   * GET /api/study-planner/tasks
   */
  static async listTasks(params?: {
    studyPlanId?: UUID;
    dailyPlanId?: UUID;
    status?: string;
    priority?: string;
    subjectArea?: string;
    dueDate?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<Task>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Task>>(this.BASE_PATH, { params });
      if (!response.success) {
        throw new Error(response.message || 'Failed to list tasks');
      }
      return response.data;
    } catch (error) {
      console.error('Error listing tasks:', error);
      throw error;
    }
  }

  /**
   * Get tasks for a specific date
   * GET /api/study-planner/tasks?dueDate={date}
   */
  static async getTasksForDate(date: string): Promise<PaginatedResponse<Task>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Task>>(this.BASE_PATH, { params: { dueDate: date } });
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch tasks for date');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks for date:', error);
      throw error;
    }
  }

  /**
   * Get today's tasks
   * GET /api/study-planner/tasks?dueDate=today
   */
  static async getTodayTasks(): Promise<PaginatedResponse<Task>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Task>>(this.BASE_PATH, { params: { dueDate: 'today' } });
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch today\'s tasks');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const taskManagementService = new TaskManagementService();
