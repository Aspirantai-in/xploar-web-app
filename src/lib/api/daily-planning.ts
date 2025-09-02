import { apiClient } from './client';
import {
  DailyPlan,
  CompleteDayRequest,
  UUID,
  DateString
} from '../types/study-planner';
import { ApiResponse } from './index';

/**
 * Daily Planning API Service
 * Implements all 4 Daily Planning endpoints from API Documentation v2.0
 */
export class DailyPlanningService {
  private static readonly BASE_PATH = '/api/study-planner/daily';

  /**
   * Get daily plan for a specific date
   * GET /api/study-planner/daily/{date}
   */
  static async getDailyPlan(date: DateString): Promise<ApiResponse<DailyPlan>> {
    try {
      const response = await apiClient.get<ApiResponse<DailyPlan>>(
        `${this.BASE_PATH}/${date}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching daily plan:', error);
      throw error;
    }
  }

  /**
   * Get today's daily plan
   * GET /api/study-planner/daily/today
   */
  static async getTodayPlan(): Promise<ApiResponse<DailyPlan>> {
    try {
      const response = await apiClient.get<ApiResponse<DailyPlan>>(
        `${this.BASE_PATH}/today`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s plan:', error);
      throw error;
    }
  }

  /**
   * Mark a day as completed
   * POST /api/study-planner/daily/{date}/complete
   */
  static async completeDay(
    date: DateString,
    request: CompleteDayRequest
  ): Promise<ApiResponse<DailyPlan>> {
    try {
      const response = await apiClient.post<ApiResponse<DailyPlan>>(
        `${this.BASE_PATH}/${date}/complete`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error completing day:', error);
      throw error;
    }
  }

  /**
   * Navigate between daily plans
   * GET /api/study-planner/daily/navigate
   */
  static async navigateDailyPlans(params: {
    currentDate: DateString;
    direction: 'previous' | 'next';
    studyPlanId?: UUID;
  }): Promise<ApiResponse<DailyPlan>> {
    try {
      const response = await apiClient.get<ApiResponse<DailyPlan>>(
        `${this.BASE_PATH}/navigate`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error navigating daily plans:', error);
      throw error;
    }
  }

  /**
   * Get daily plan summary for a date range
   * Convenience method for weekly/monthly views
   */
  static async getDailyPlanSummary(params: {
    startDate: DateString;
    endDate: DateString;
    studyPlanId?: UUID;
  }): Promise<ApiResponse<DailyPlan[]>> {
    try {
      const response = await apiClient.get<ApiResponse<DailyPlan[]>>(
        `${this.BASE_PATH}/summary`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching daily plan summary:', error);
      throw error;
    }
  }

  /**
   * Get daily plan statistics
   * Convenience method for analytics
   */
  static async getDailyPlanStats(params: {
    startDate: DateString;
    endDate: DateString;
    studyPlanId?: UUID;
  }): Promise<ApiResponse<{
    totalDays: number;
    completedDays: number;
    averageCompletion: number;
    totalHours: number;
    completedHours: number;
    streak: number;
  }>> {
    try {
      const response = await apiClient.get<ApiResponse<{
        totalDays: number;
        completedDays: number;
        averageCompletion: number;
        totalHours: number;
        completedHours: number;
        streak: number;
      }>>(
        `${this.BASE_PATH}/stats`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching daily plan stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dailyPlanningService = new DailyPlanningService();
