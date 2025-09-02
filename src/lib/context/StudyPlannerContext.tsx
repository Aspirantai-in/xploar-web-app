'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { StudyPlannerService } from '@/lib/services/study-planner.service';
import {
  StudyPlan,
  Task,
  DailyPlan,
  CreateStudyPlanRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  DeferTaskRequest,
  ApiResponse
} from '@/lib/types';

interface StudyPlannerContextType {
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
  getStudyPlan: (planId: string) => Promise<void>;

  // Task management
  createTask: (taskData: CreateTaskRequest) => Promise<boolean>;
  updateTask: (taskId: string, updates: UpdateTaskRequest) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  startTask: (taskId: string) => Promise<boolean>;
  completeTask: (taskId: string, completionData: CompleteTaskRequest) => Promise<boolean>;
  deferTask: (taskId: string, deferData: DeferTaskRequest) => Promise<boolean>;

  // Daily plan management
  getDailyPlan: (date: string) => Promise<void>;
  getTodayPlan: () => Promise<void>;
  completeDay: (date: string, completionData: { notes?: string; performanceMetrics?: Record<string, unknown> }) => Promise<boolean>;

  // Utility
  clearError: () => void;
  setCurrentPlan: (plan: StudyPlan | null) => void;
}

const StudyPlannerContext = createContext<StudyPlannerContextType | undefined>(undefined);

interface StudyPlannerProviderProps {
  children: ReactNode;
}

export function StudyPlannerProvider({ children }: StudyPlannerProviderProps) {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get service instance
  const studyPlannerService = StudyPlannerService.getInstance();

  // Load study plans on mount
  useEffect(() => {
    loadStudyPlans();
  }, []);

  const loadStudyPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.getStudyPlans();

      if (response.success && response.data) {
        setStudyPlans(response.data);

        // Set first active plan as current if none selected
        if (!currentPlan && response.data.length > 0) {
          const activePlan = response.data.find((plan: StudyPlan) => plan.status === 'ACTIVE');
          if (activePlan) {
            setCurrentPlan(activePlan);
            await loadStudyPlanDetails(activePlan.planId);
          }
        }
      } else {
        setError(response.message || 'Failed to load study plans');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load study plans';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPlan]);

  const loadStudyPlanDetails = useCallback(async (planId: string) => {
    try {
      const response = await studyPlannerService.getStudyPlan(planId);
      if (response.success && response.data) {
        setCurrentPlan(response.data);
      }
    } catch (err) {
      console.error('Failed to load study plan details:', err);
    }
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

      // Note: deleteStudyPlan method doesn't exist in the API service yet
      // For now, we'll just remove it from local state
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
    await loadStudyPlans();
  }, [loadStudyPlans]);

  const getStudyPlan = useCallback(async (planId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.getStudyPlan(planId);

      if (response.success && response.data) {
        const plan = response.data;
        setCurrentPlan(plan);

        // Load tasks for this plan
        await loadTasksForPlan(planId);

        // Load today's plan
        await getTodayPlan();
      } else {
        setError(response.message || 'Failed to load study plan');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load study plan';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTasksForPlan = useCallback(async (planId: string) => {
    try {
      // Fetch tasks for the specific plan
      const response = await studyPlannerService.getTasks(planId);

      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Failed to load tasks for plan:', err);
      setTasks([]);
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

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Note: deleteTask method doesn't exist in the API service yet
      // For now, we'll just remove it from local state
      setTasks(prev => prev.filter(task => task.taskId !== taskId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
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

  const completeTask = useCallback(async (taskId: string, completionData: CompleteTaskRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.completeTask(taskId, completionData);

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

  const deferTask = useCallback(async (taskId: string, deferData: DeferTaskRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.deferTask(taskId, deferData);

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

  const completeDay = useCallback(async (date: string, completionData: { notes?: string; performanceMetrics?: Record<string, unknown> }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studyPlannerService.completeDay(date, completionData);

      if (response.success && response.data) {
        const updatedDailyPlan = response.data;
        setDailyPlan(updatedDailyPlan);
        return true;
      } else {
        setError(response.message || 'Failed to complete day');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete day';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: StudyPlannerContextType = {
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
    getStudyPlan,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    deferTask,
    getDailyPlan,
    getTodayPlan,
    completeDay,
    clearError,
    setCurrentPlan,
  };

  return (
    <StudyPlannerContext.Provider value={value}>
      {children}
    </StudyPlannerContext.Provider>
  );
}

export function useStudyPlanner(): StudyPlannerContextType {
  const context = useContext(StudyPlannerContext);
  if (context === undefined) {
    throw new Error('useStudyPlanner must be used within a StudyPlannerProvider');
  }
  return context;
}
