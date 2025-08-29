import { apiClient } from './client';

export interface StudyPlanData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetHoursPerDay: number;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  subjects: {
    mandatory: string[];
    optional: string[];
    languages: string[];
  };
  preferences: {
    studyPattern: 'MORNING_PERSON' | 'EVENING_PERSON' | 'FLEXIBLE';
    breakDuration: number;
    weeklyOffDays: string[];
    aiRecommendations: boolean;
  };
}

export class StudyPlannerService {
  async createStudyPlan(planData: StudyPlanData) {
    try {
      const response = await apiClient.post('/api/study-planner/plans', planData);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to create study plan');
    }
  }

  async getStudyPlan(planId: string) {
    try {
      const response = await apiClient.get(`/api/study-planner/plans/${planId}`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch study plan');
    }
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.error?.message) {
      return new Error(error.response.data.error.message);
    }
    return new Error(error.message || defaultMessage);
  }
}

export const studyPlannerService = new StudyPlannerService();
