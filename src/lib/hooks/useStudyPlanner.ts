import { useState, useEffect, useCallback } from 'react';
import { studyPlannerService } from '@/lib/api/study-planner';
import {
  StudyPlan,
  Task,
  DailyPlan,
  CreateStudyPlanRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  DeferTaskRequest
} from '@/lib/types';

export interface UseStudyPlannerReturn {
  // State
  studyPlans: StudyPlan[];
  currentPlan: StudyPlan | null;
  dailyPlan: DailyPlan | null;
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createStudyPlan: (planData: CreateStudyPlanRequest) => Promise<boolean>;
  updateStudyPlan: (planId: string, updates: Partial<CreateStudyPlanRequest>) => Promise<boolean>;
  deleteStudyPlan: (planId: string) => Promise<boolean>;
  getStudyPlans: () => Promise<void>;
  setCurrentPlan: (plan: StudyPlan) => void;

  // Task management
  createTask: (taskData: CreateTaskRequest) => Promise<boolean>;
  updateTask: (taskId: string, updates: UpdateTaskRequest) => Promise<boolean>;
  startTask: (taskId: string) => Promise<boolean>;
  completeTask: (taskId: string, data: CompleteTaskRequest) => Promise<boolean>;
  deferTask: (taskId: string, data: DeferTaskRequest) => Promise<boolean>;

  // Daily plan management
  getDailyPlan: (date: string) => Promise<void>;
  getTodayPlan: () => Promise<void>;

  // Utility
  clearError: () => void;
}

export function useStudyPlanner(): UseStudyPlannerReturn {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createStudyPlan = useCallback(async (planData: CreateStudyPlanRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.createStudyPlan(planData);

      if (response.success && response.data) {
        const newPlan = response.data;
        setStudyPlans(prev => [...prev, newPlan]);
        setCurrentPlan(newPlan);
        return true;
      } else {
        setError(response.message || 'Failed to create study plan');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create study plan';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStudyPlan = useCallback(async (planId: string, updates: Partial<CreateStudyPlanRequest>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.updateStudyPlan(planId, updates);

      if (response.success && response.data) {
        const updatedPlan = response.data;
        setStudyPlans(prev => prev.map(plan =>
          plan.planId === planId ? updatedPlan : plan
        ));

        if (currentPlan?.planId === planId) {
          setCurrentPlan(updatedPlan);
        }
        return true;
      } else {
        setError(response.message || 'Failed to update study plan');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update study plan';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentPlan]);

  const deleteStudyPlan = useCallback(async (planId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, just remove from local state since delete endpoint might not be implemented
      setStudyPlans(prev => prev.filter(plan => plan.planId !== planId));

      if (currentPlan?.planId === planId) {
        setCurrentPlan(null);
        setTasks([]);
        setDailyPlan(null);
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete study plan';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentPlan]);

  const getStudyPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.getStudyPlans();

      if (response.success && response.data) {
        setStudyPlans(response.data);
      } else {
        setError(response.message || 'Failed to load study plans');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load study plans';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.createTask(taskData);

      if (response.success && response.data) {
        const newTask = response.data;
        setTasks(prev => [...prev, newTask]);
        return true;
      } else {
        setError(response.message || 'Failed to create task');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.updateTask(taskId, updates);

      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task =>
          task.taskId === taskId ? updatedTask : task
        ));
        return true;
      } else {
        setError(response.message || 'Failed to update task');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.startTask(taskId);

      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task =>
          task.taskId === taskId ? updatedTask : task
        ));
        return true;
      } else {
        setError(response.message || 'Failed to start task');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start task';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeTask = useCallback(async (taskId: string, data: CompleteTaskRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.completeTask(taskId, data);

      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task =>
          task.taskId === taskId ? updatedTask : task
        ));
        return true;
      } else {
        setError(response.message || 'Failed to complete task');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete task';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deferTask = useCallback(async (taskId: string, data: DeferTaskRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.deferTask(taskId, data);

      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task =>
          task.taskId === taskId ? updatedTask : task
        ));
        return true;
      } else {
        setError(response.message || 'Failed to defer task');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to defer task';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDailyPlan = useCallback(async (date: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.getDailyPlan(date);

      if (response.success && response.data) {
        setDailyPlan(response.data);
      } else {
        setError(response.message || 'Failed to load daily plan');
        setDailyPlan(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load daily plan';
      setError(errorMessage);
      setDailyPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTodayPlan = useCallback(async () => {
    try {
      const response = await studyPlannerService.getTodaysPlan();
      if (response.success && response.data) {
        setDailyPlan(response.data);
      } else {
        // If no today's plan exists, try to get today's date
        const today = new Date().toISOString().split('T')[0];
        await getDailyPlan(today);
      }
    } catch (err) {
      console.error('Failed to load today\'s plan:', err);
      // Fallback to today's date
      const today = new Date().toISOString().split('T')[0];
      await getDailyPlan(today);
    }
  }, [getDailyPlan]);

  // Load study plans on mount
  useEffect(() => {
    getStudyPlans();
  }, [getStudyPlans]);

  return {
    studyPlans,
    currentPlan,
    dailyPlan,
    tasks,
    isLoading,
    error,
    createStudyPlan,
    updateStudyPlan,
    deleteStudyPlan,
    getStudyPlans,
    setCurrentPlan,
    createTask,
    updateTask,
    startTask,
    completeTask,
    deferTask,
    getDailyPlan,
    getTodayPlan,
    clearError,
  };
}
