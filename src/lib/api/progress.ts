import { apiClient } from './client';

export interface ProgressParams {
  timeRange?: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  metrics?: string;
}

export class ProgressService {
  async getOverallProgress() {
    try {
      const response = await apiClient.get('/api/study-planner/progress/overall');
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch overall progress');
    }
  }

  async getStudyPlanProgress(planId: string) {
    try {
      const response = await apiClient.get(`/api/study-planner/progress/study-plan/${planId}`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch study plan progress');
    }
  }

  async getSubjectProgress(subjectArea: string, params: ProgressParams = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.timeRange) queryParams.append('timeRange', params.timeRange);
      if (params.metrics) queryParams.append('metrics', params.metrics);

      const url = `/api/study-planner/progress/subject/${subjectArea}?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch subject progress');
    }
  }

  async getStreaks() {
    try {
      const response = await apiClient.get('/api/study-planner/progress/streaks');
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch streak information');
    }
  }

  async getPerformanceAnalytics(params: ProgressParams = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.timeRange) queryParams.append('timeRange', params.timeRange);
      if (params.metrics) queryParams.append('metrics', params.metrics);

      const url = `/api/study-planner/progress/analytics?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      return response;
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

export const progressService = new ProgressService();
