import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { studyPlannerService, StudyPlanCreate, StudyPlanUpdate, TaskCreate, TaskUpdate } from '@/lib/api';
import { PlanDay, TaskID, TopicID } from '@/lib/types';

export interface UseStudyPlannerReturn {
    // State
    studyPlan: PlanDay[];
    currentDay: PlanDay | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    createStudyPlan: (planData: StudyPlanCreate) => Promise<void>;
    updateStudyPlan: (planId: string, updates: StudyPlanUpdate) => Promise<void>;
    deleteStudyPlan: (planId: string) => Promise<void>;

    // Task Management
    addTask: (taskData: TaskCreate) => Promise<void>;
    updateTask: (taskId: TaskID, updates: TaskUpdate) => Promise<void>;
    deleteTask: (taskId: TaskID) => Promise<void>;
    toggleTaskCompletion: (taskId: TaskID) => Promise<void>;
    deferTask: (taskId: TaskID, newDate: string) => Promise<void>;

    // Day Navigation
    viewDay: (dayNumber: number) => void;
    nextDay: () => void;
    previousDay: () => void;

    // Study Sessions
    startStudySession: (taskId: TaskID) => Promise<void>;
    endStudySession: (taskId: TaskID, duration: number) => Promise<void>;

    // Utilities
    getTasksForDay: (dayNumber: number) => PlanDay | null;
    getTasksByTopic: (topicId: TopicID) => any[];
    clearError: () => void;
    refreshStudyPlan: () => Promise<void>;
}

export function useStudyPlanner(): UseStudyPlannerReturn {
    const {
        studyPlan,
        currentVisibleDay,
        setStudyPlan,
        updateStudyPlan: updateStoreStudyPlan,
        viewDay: storeViewDay,
        toggleTaskCompletion: storeToggleTaskCompletion,
    } = useAppStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get current day from store
    const currentDay = studyPlan.find(day => day.dayNumber === currentVisibleDay) || null;

    // Clear error
    const clearError = useCallback(() => setError(null), []);

    // Create study plan
    const createStudyPlan = useCallback(async (planData: StudyPlanCreate) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await studyPlannerService.createStudyPlan(planData);

            if (response.data) {
                setStudyPlan(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create study plan');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [setStudyPlan]);

    // Update study plan
    const updateStudyPlan = useCallback(async (planId: string, updates: StudyPlanUpdate) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await studyPlannerService.updateStudyPlan(planId, updates);

            if (response.data) {
                // Update the store with the new plan data
                setStudyPlan(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update study plan');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [setStudyPlan]);

    // Delete study plan
    const deleteStudyPlan = useCallback(async (planId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            await studyPlannerService.deleteStudyPlan(planId);

            // Clear the study plan from store
            setStudyPlan([]);
        } catch (err: any) {
            setError(err.message || 'Failed to delete study plan');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [setStudyPlan]);

    // Add task
    const addTask = useCallback(async (taskData: TaskCreate) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await studyPlannerService.createTask(taskData);

            if (response.data) {
                // Refresh the study plan to get updated data
                await refreshStudyPlan();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to add task');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update task
    const updateTask = useCallback(async (taskId: TaskID, updates: TaskUpdate) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await studyPlannerService.updateTask(taskId, updates);

            if (response.data) {
                // Update the store
                updateStoreStudyPlan(taskId, updates);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update task');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [updateStoreStudyPlan]);

    // Delete task
    const deleteTask = useCallback(async (taskId: TaskID) => {
        try {
            setIsLoading(true);
            setError(null);

            await studyPlannerService.deleteTask(taskId);

            // Refresh the study plan to get updated data
            await refreshStudyPlan();
        } catch (err: any) {
            setError(err.message || 'Failed to delete task');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Toggle task completion
    const toggleTaskCompletion = useCallback(async (taskId: TaskID) => {
        try {
            setError(null);

            // Optimistically update the store
            storeToggleTaskCompletion(taskId);

            // Update the task on the server
            const task = studyPlan
                .flatMap(day => day.tasks)
                .find(t => t.id === taskId);

            if (task) {
                await studyPlannerService.updateTask(taskId, {
                    isCompleted: !task.isCompleted,
                    completedAt: !task.isCompleted ? new Date().toISOString() : undefined,
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to toggle task completion');
            // Revert the optimistic update
            storeToggleTaskCompletion(taskId);
            throw err;
        }
    }, [storeToggleTaskCompletion, studyPlan]);

    // Defer task
    const deferTask = useCallback(async (taskId: TaskID, newDate: string) => {
        try {
            setIsLoading(true);
            setError(null);

            await studyPlannerService.deferTask(taskId, newDate);

            // Refresh the study plan to get updated data
            await refreshStudyPlan();
        } catch (err: any) {
            setError(err.message || 'Failed to defer task');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // View day
    const viewDay = useCallback((dayNumber: number) => {
        storeViewDay(dayNumber);
    }, [storeViewDay]);

    // Next day
    const nextDay = useCallback(() => {
        if (currentDay && currentDay.dayNumber < studyPlan.length) {
            viewDay(currentDay.dayNumber + 1);
        }
    }, [currentDay, studyPlan.length, viewDay]);

    // Previous day
    const previousDay = useCallback(() => {
        if (currentDay && currentDay.dayNumber > 1) {
            viewDay(currentDay.dayNumber - 1);
        }
    }, [currentDay, viewDay]);

    // Start study session
    const startStudySession = useCallback(async (taskId: TaskID) => {
        try {
            setError(null);

            await studyPlannerService.startStudySession({
                taskId,
                startTime: new Date().toISOString(),
            });
        } catch (err: any) {
            setError(err.message || 'Failed to start study session');
            throw err;
        }
    }, []);

    // End study session
    const endStudySession = useCallback(async (taskId: TaskID, duration: number) => {
        try {
            setError(null);

            await studyPlannerService.endStudySession(taskId, {
                endTime: new Date().toISOString(),
                duration,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to end study session');
            throw err;
        }
    }, []);

    // Get tasks for a specific day
    const getTasksForDay = useCallback((dayNumber: number): PlanDay | null => {
        return studyPlan.find(day => day.dayNumber === dayNumber) || null;
    }, [studyPlan]);

    // Get tasks by topic
    const getTasksByTopic = useCallback((topicId: TopicID) => {
        return studyPlan
            .flatMap(day => day.tasks)
            .filter(task => task.topicId === topicId);
    }, [studyPlan]);

    // Refresh study plan
    const refreshStudyPlan = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await studyPlannerService.getStudyPlan();

            if (response.data) {
                setStudyPlan(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to refresh study plan');
        } finally {
            setIsLoading(false);
        }
    }, [setStudyPlan]);

    // Load study plan on mount
    useEffect(() => {
        if (studyPlan.length === 0) {
            refreshStudyPlan();
        }
    }, [refreshStudyPlan, studyPlan.length]);

    return {
        // State
        studyPlan,
        currentDay,
        isLoading,
        error,

        // Actions
        createStudyPlan,
        updateStudyPlan,
        deleteStudyPlan,

        // Task Management
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        deferTask,

        // Day Navigation
        viewDay,
        nextDay,
        previousDay,

        // Study Sessions
        startStudySession,
        endStudySession,

        // Utilities
        getTasksForDay,
        getTasksByTopic,
        clearError,
        refreshStudyPlan,
    };
}
