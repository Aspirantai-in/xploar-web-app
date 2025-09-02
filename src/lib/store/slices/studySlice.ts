/**
 * Study Management Store Slice
 * Handles study plans, tasks, and learning progress
 */

import type { StateCreator } from 'zustand';
import type { StudyPlan, StudyConfig, TaskID, Task } from '@/lib/types';
import { DifficultyLevel, SubjectArea, StudyPattern } from '@/lib/types';
import { ErrorHandler } from '@/lib/utils/errorHandler';
import { unifiedApiClient } from '@/lib/api/unified-client';

export interface StudySlice {
    // State
    studyConfiguration: StudyConfig;
    studyPlans: StudyPlan[];
    currentStudyPlan: StudyPlan | null;
    isGeneratingPlan: boolean;

    // Actions
    updateStudyConfig: (config: Partial<StudyConfig>) => void;
    generateStudyPlan: () => Promise<void>;
    setCurrentStudyPlan: (plan: StudyPlan | null) => void;
    addStudyPlan: (plan: StudyPlan) => void;
    updateStudyPlan: (planId: string, updates: Partial<StudyPlan>) => void;
    removeStudyPlan: (planId: string) => void;
    toggleTaskCompletion: (taskId: TaskID) => void;
    deferTask: (taskId: TaskID, newDate?: string) => void;
    addTaskToPlan: (planId: string, task: Task) => void;
    removeTaskFromPlan: (planId: string, taskId: TaskID) => void;
}

export const createStudySlice: StateCreator<
    StudySlice,
    [],
    [],
    StudySlice
> = (set, get) => ({
    // State
    studyConfiguration: {
        goal: '',
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 90,
        hoursPerDay: 4,
    },
    studyPlans: [],
    currentStudyPlan: null,
    isGeneratingPlan: false,

    // Actions
    updateStudyConfig: (config: Partial<StudyConfig>) => {
        try {
            set((state) => ({
                studyConfiguration: {
                    ...state.studyConfiguration,
                    ...config,
                },
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Study config update error');
            throw error;
        }
    },

    generateStudyPlan: async () => {
        try {
            set({ isGeneratingPlan: true });

            const config = get().studyConfiguration;

            // Validate configuration
            if (!config.goal || !config.startDate || config.hoursPerDay <= 0) {
                throw new Error('Invalid study configuration');
            }

            // Calculate end date
            const endDate = new Date(config.startDate);
            endDate.setDate(endDate.getDate() + config.durationDays);

            // Create study plan via API
            const response = await unifiedApiClient.createStudyPlan({
                title: `${config.goal} Study Plan`,
                description: `Generated study plan for ${config.goal}`,
                startDate: config.startDate,
                endDate: endDate.toISOString().split('T')[0],
                targetHoursPerDay: config.hoursPerDay,
                difficultyLevel: DifficultyLevel.INTERMEDIATE,
                subjects: {
                    mandatory: [SubjectArea.GENERAL_STUDIES_1, SubjectArea.GENERAL_STUDIES_2],
                    optional: [SubjectArea.HISTORY, SubjectArea.GEOGRAPHY],
                },
                preferences: {
                    studyPattern: StudyPattern.MORNING_PERSON,
                    breakDuration: 15,
                    weeklyOffDays: ['SUNDAY'],
                    aiRecommendations: true
                }
            });

            if (response.success && response.data) {
                set((state) => ({
                    studyPlans: [...state.studyPlans, response.data],
                    currentStudyPlan: response.data,
                    isGeneratingPlan: false,
                }));
            } else {
                throw new Error('Failed to create study plan');
            }
        } catch (error) {
            ErrorHandler.logError(error, 'Study plan generation error');
            set({ isGeneratingPlan: false });
            throw error;
        }
    },

    setCurrentStudyPlan: (plan: StudyPlan | null) => {
        set({ currentStudyPlan: plan });
    },

    addStudyPlan: (plan: StudyPlan) => {
        try {
            set((state) => ({
                studyPlans: [...state.studyPlans, plan],
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Add study plan error');
            throw error;
        }
    },

    updateStudyPlan: (planId: string, updates: Partial<StudyPlan>) => {
        try {
            set((state) => ({
                studyPlans: state.studyPlans.map((plan) =>
                    plan.planId === planId
                        ? { ...plan, ...updates }
                        : plan
                ),
                currentStudyPlan:
                    state.currentStudyPlan?.planId === planId
                        ? { ...state.currentStudyPlan, ...updates }
                        : state.currentStudyPlan,
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Update study plan error');
            throw error;
        }
    },

    removeStudyPlan: (planId: string) => {
        try {
            set((state) => ({
                studyPlans: state.studyPlans.filter((plan) => plan.planId !== planId),
                currentStudyPlan:
                    state.currentStudyPlan?.planId === planId
                        ? null
                        : state.currentStudyPlan,
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Remove study plan error');
            throw error;
        }
    },

    toggleTaskCompletion: (taskId: TaskID) => {
        try {
            set((state) => ({
                studyPlans: state.studyPlans.map((plan) => ({
                    ...plan,
                    tasks: plan.tasks?.map((task) =>
                        task.id === taskId
                            ? { ...task, isDone: !task.isDone }
                            : task
                    ),
                })),
                currentStudyPlan: state.currentStudyPlan
                    ? {
                        ...state.currentStudyPlan,
                        tasks: state.currentStudyPlan.tasks?.map((task) =>
                            task.id === taskId
                                ? { ...task, isDone: !task.isDone }
                                : task
                        ),
                    }
                    : null,
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Toggle task completion error');
            throw error;
        }
    },

    deferTask: (taskId: TaskID, newDate?: string) => {
        try {
            const deferDate = newDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString().split('T')[0];

            set((state) => ({
                studyPlans: state.studyPlans.map((plan) => ({
                    ...plan,
                    tasks: plan.tasks?.map((task) =>
                        task.id === taskId
                            ? { ...task, deferredTo: deferDate }
                            : task
                    ),
                })),
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Defer task error');
            throw error;
        }
    },

    addTaskToPlan: (planId: string, task: Task) => {
        try {
            set((state) => ({
                studyPlans: state.studyPlans.map((plan) =>
                    plan.planId === planId
                        ? {
                            ...plan,
                            tasks: [...(plan.tasks || []), task],
                        }
                        : plan
                ),
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Add task to plan error');
            throw error;
        }
    },

    removeTaskFromPlan: (planId: string, taskId: TaskID) => {
        try {
            set((state) => ({
                studyPlans: state.studyPlans.map((plan) =>
                    plan.planId === planId
                        ? {
                            ...plan,
                            tasks: plan.tasks?.filter((task) => task.id !== taskId),
                        }
                        : plan
                ),
            }));
        } catch (error) {
            ErrorHandler.logError(error, 'Remove task from plan error');
            throw error;
        }
    },
});
