/**
 * Progress Tracking Store Slice
 * Handles learning progress, analytics, and performance metrics
 */

import type { StateCreator } from 'zustand';
import type { MockRun, MCQResult, TopicID, AIRecommendation } from '@/lib/types';
import { ErrorHandler } from '@/lib/utils/errorHandler';
import { getTodayString } from '@/lib/utils/dateUtils';

export interface ProgressSlice {
    // State
    dailyStreak: number;
    lastStreakUpdateDate: string | null;
    mcqPerformance: MCQResult;
    mockTestHistory: MockRun[];
    recommendations: AIRecommendation[];
    weeklyGoals: {
        target: number;
        completed: number;
        week: string;
    }[];

    // Actions
    updateStreak: () => void;
    resetStreak: () => void;
    recordMcqResult: (topicId: TopicID, correct: number, total: number) => void;
    saveMockTest: (runData: MockRun) => void;
    clearMockTestHistory: () => void;
    addRecommendation: (recommendation: AIRecommendation) => void;
    markRecommendationAsDone: (recommendationId: string) => void;
    removeRecommendation: (recommendationId: string) => void;
    setWeeklyGoal: (target: number) => void;
    updateWeeklyProgress: (completed: number) => void;

    // Analytics
    getStudyAnalytics: () => {
        totalStudyDays: number;
        averageScore: number;
        improvementRate: number;
        strongTopics: string[];
        weakTopics: string[];
    };
}

export const createProgressSlice: StateCreator<
    ProgressSlice,
    [],
    [],
    ProgressSlice
> = (set, get) => ({
    // State
    dailyStreak: 0,
    lastStreakUpdateDate: null,
    mcqPerformance: {},
    mockTestHistory: [],
    recommendations: [],
    weeklyGoals: [],

    // Actions
    updateStreak: () => {
        try {
            const today = getTodayString();
            const lastUpdate = get().lastStreakUpdateDate;

            if (lastUpdate !== today) {
                // Check if yesterday was the last update (consecutive day)
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toISOString().split('T')[0];

                if (lastUpdate === yesterdayString) {
                    // Consecutive day - increment streak
                    set((state) => ({
                        dailyStreak: state.dailyStreak + 1,
                        lastStreakUpdateDate: today,
                    }));
                } else if (lastUpdate === null) {
                    // First day
                    set({
                        dailyStreak: 1,
                        lastStreakUpdateDate: today,
                    });
                } else {
                    // Gap in days - reset streak
                    set({
                        dailyStreak: 1,
                        lastStreakUpdateDate: today,
                    });
                }
            }
        } catch (error) {
            ErrorHandler.logError(error, 'Update streak error');
            throw error;
        }
    },

    resetStreak: () => {
        set({
            dailyStreak: 0,
            lastStreakUpdateDate: null,
        });
    },

    recordMcqResult: (topicId: TopicID, correct: number, total: number) => {
        try {
            if (total <= 0 || correct < 0 || correct > total) {
                throw new Error('Invalid MCQ result data');
            }

            set((state) => ({
                mcqPerformance: {
                    ...state.mcqPerformance,
                    [topicId]: { correct, total },
                },
            }));

            // Update streak if this is a good performance
            const accuracy = (correct / total) * 100;
            if (accuracy >= 60) {
                get().updateStreak();
            }
        } catch (error) {
            ErrorHandler.logError(error, 'Record MCQ result error');
            throw error;
        }
    },

    saveMockTest: (runData: MockRun) => {
        try {
            // Validate mock test data
            if (!runData.id || !runData.topicId || runData.score < 0) {
                throw new Error('Invalid mock test data');
            }

            set((state) => ({
                mockTestHistory: [...state.mockTestHistory, runData],
            }));

            // Update streak for good mock test performance
            if (runData.score >= 12) { // Assuming score out of 20
                get().updateStreak();
            }
        } catch (error) {
            ErrorHandler.logError(error, 'Save mock test error');
            throw error;
        }
    },

    clearMockTestHistory: () => {
        set({ mockTestHistory: [] });
    },

    addRecommendation: (recommendation: AIRecommendation) => {
        try {
            if (!recommendation.id || !recommendation.userId) {
                throw new Error('Invalid recommendation data');
            }

            set((state) => ({
                recommendations: [...state.recommendations, recommendation],
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Add recommendation error');
            throw error;
        }
    },

    markRecommendationAsDone: (recommendationId: string) => {
        try {
            set((state) => ({
                recommendations: state.recommendations.map((rec) =>
                    rec.id === recommendationId
                        ? { ...rec, isCompleted: true }
                        : rec
                ),
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Mark recommendation done error');
            throw error;
        }
    },

    removeRecommendation: (recommendationId: string) => {
        try {
            set((state) => ({
                recommendations: state.recommendations.filter(
                    (rec) => rec.id !== recommendationId
                ),
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Remove recommendation error');
            throw error;
        }
    },

    setWeeklyGoal: (target: number) => {
        try {
            if (target <= 0) {
                throw new Error('Weekly goal target must be positive');
            }

            const currentWeek = getTodayString().slice(0, 7); // YYYY-MM format

            set((state) => {
                const existingGoalIndex = state.weeklyGoals.findIndex(
                    (goal) => goal.week === currentWeek
                );

                if (existingGoalIndex >= 0) {
                    // Update existing goal
                    const updatedGoals = [...state.weeklyGoals];
                    updatedGoals[existingGoalIndex] = {
                        ...updatedGoals[existingGoalIndex],
                        target,
                    };
                    return { weeklyGoals: updatedGoals };
                } else {
                    // Create new goal
                    return {
                        weeklyGoals: [
                            ...state.weeklyGoals,
                            { target, completed: 0, week: currentWeek },
                        ],
                    };
                }
            });
        } catch (error) {
            ErrorHandler.logError(error, 'Set weekly goal error');
            throw error;
        }
    },

    updateWeeklyProgress: (completed: number) => {
        try {
            if (completed < 0) {
                throw new Error('Weekly progress cannot be negative');
            }

            const currentWeek = getTodayString().slice(0, 7);

            set((state) => {
                const goalIndex = state.weeklyGoals.findIndex(
                    (goal) => goal.week === currentWeek
                );

                if (goalIndex >= 0) {
                    const updatedGoals = [...state.weeklyGoals];
                    updatedGoals[goalIndex] = {
                        ...updatedGoals[goalIndex],
                        completed,
                    };
                    return { weeklyGoals: updatedGoals };
                }

                return state;
            });
        } catch (error) {
            ErrorHandler.logError(error, 'Update weekly progress error');
            throw error;
        }
    },

    // Analytics
    getStudyAnalytics: () => {
        try {
            const state = get();

            // Calculate total study days
            const totalStudyDays = state.dailyStreak;

            // Calculate average mock test score
            const averageScore = state.mockTestHistory.length > 0
                ? state.mockTestHistory.reduce((sum, test) => sum + test.score, 0) / state.mockTestHistory.length
                : 0;

            // Calculate improvement rate (comparing first and last 5 tests)
            let improvementRate = 0;
            if (state.mockTestHistory.length >= 10) {
                const firstFive = state.mockTestHistory.slice(0, 5);
                const lastFive = state.mockTestHistory.slice(-5);

                const firstAvg = firstFive.reduce((sum, test) => sum + test.score, 0) / 5;
                const lastAvg = lastFive.reduce((sum, test) => sum + test.score, 0) / 5;

                improvementRate = ((lastAvg - firstAvg) / firstAvg) * 100;
            }

            // Identify strong and weak topics
            const topicPerformance = Object.entries(state.mcqPerformance).map(
                ([topicId, result]) => ({
                    topicId,
                    accuracy: (result.correct / result.total) * 100,
                })
            );

            const strongTopics = topicPerformance
                .filter((topic) => topic.accuracy >= 75)
                .map((topic) => topic.topicId);

            const weakTopics = topicPerformance
                .filter((topic) => topic.accuracy < 50)
                .map((topic) => topic.topicId);

            return {
                totalStudyDays,
                averageScore: Math.round(averageScore * 100) / 100,
                improvementRate: Math.round(improvementRate * 100) / 100,
                strongTopics,
                weakTopics,
            };
        } catch (error) {
            ErrorHandler.logError(error, 'Get study analytics error');
            return {
                totalStudyDays: 0,
                averageScore: 0,
                improvementRate: 0,
                strongTopics: [],
                weakTopics: [],
            };
        }
    },
});
