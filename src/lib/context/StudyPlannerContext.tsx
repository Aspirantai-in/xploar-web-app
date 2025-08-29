'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { studyPlannerService } from '@/lib/api/study-planner';
import { StudyPlan, Task, DailyPlan, StudySession } from '@/lib/types';

interface StudyPlannerContextType {
  // State
  studyPlans: StudyPlan[];
  currentPlan: StudyPlan | null;
  dailyPlan: DailyPlan | null;
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createStudyPlan: (planData: any) => Promise<boolean>;
  updateStudyPlan: (planId: string, updates: any) => Promise<boolean>;
  deleteStudyPlan: (planId: string) => Promise<boolean>;
  getStudyPlans: () => Promise<void>;
  getStudyPlan: (planId: string) => Promise<void>;
  
  // Task management
  createTask: (taskData: any) => Promise<boolean>;
  updateTask: (taskId: string, updates: any) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  startTask: (taskId: string) => Promise<boolean>;
  completeTask: (taskId: string, completionData: any) => Promise<boolean>;
  deferTask: (taskId: string, deferData: any) => Promise<boolean>;
  
  // Daily plan management
  getDailyPlan: (date: string) => Promise<void>;
  getTodayPlan: () => Promise<void>;
  completeDay: (date: string, completionData: any) => Promise<boolean>;
  
  // Study sessions
  startStudySession: (sessionData: any) => Promise<boolean>;
  endStudySession: (sessionId: string, endData: any) => Promise<boolean>;
  
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

  // Load study plans on mount
  useEffect(() => {
    loadStudyPlans();
  }, []);

  const loadStudyPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.getStudyPlans();
      
      if (response.success && response.data) {
        setStudyPlans(response.data);
        // Set first active plan as current if none selected
        if (!currentPlan && response.data.length > 0) {
          const activePlan = response.data.find(plan => plan.status === 'ACTIVE');
          if (activePlan) {
            setCurrentPlan(activePlan);
            await loadStudyPlan(activePlan.id);
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
  };

  const createStudyPlan = async (planData: any): Promise<boolean> => {
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
  };

  const updateStudyPlan = async (planId: string, updates: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.updateStudyPlan(planId, updates);
      
      if (response.success && response.data) {
        const updatedPlan = response.data;
        setStudyPlans(prev => prev.map(plan => 
          plan.id === planId ? updatedPlan : plan
        ));
        
        if (currentPlan?.id === planId) {
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
  };

  const deleteStudyPlan = async (planId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.deleteStudyPlan(planId);
      
      if (response.success) {
        setStudyPlans(prev => prev.filter(plan => plan.id !== planId));
        
        if (currentPlan?.id === planId) {
          setCurrentPlan(null);
          setTasks([]);
          setDailyPlan(null);
        }
        return true;
      } else {
        setError(response.message || 'Failed to delete study plan');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete study plan';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getStudyPlans = useCallback(async () => {
    await loadStudyPlans();
  }, []);

  const getStudyPlan = async (planId: string) => {
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
  };

  const loadTasksForPlan = async (planId: string) => {
    try {
      // This would typically come from a separate API call
      // For now, we'll use the tasks from the plan data
      const plan = studyPlans.find(p => p.id === planId);
      if (plan) {
        // In a real implementation, you'd fetch tasks separately
        setTasks([]); // Placeholder
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const createTask = async (taskData: any): Promise<boolean> => {
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
  };

  const updateTask = async (taskId: string, updates: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.updateTask(taskId, updates);
      
      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
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
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.deleteTask(taskId);
      
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        return true;
      } else {
        setError(response.message || 'Failed to delete task');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const startTask = async (taskId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.startTask(taskId);
      
      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
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
  };

  const completeTask = async (taskId: string, completionData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.completeTask(taskId, completionData);
      
      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
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
  };

  const deferTask = async (taskId: string, deferData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.deferTask(taskId, deferData);
      
      if (response.success && response.data) {
        const updatedTask = response.data;
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
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
  };

  const getDailyPlan = async (date: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.getDailyPlan(date);
      
      if (response.success && response.data) {
        setDailyPlan(response.data);
      } else {
        setError(response.message || 'Failed to load daily plan');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load daily plan';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayPlan = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await getDailyPlan(today);
    } catch (err) {
      console.error('Failed to load today\'s plan:', err);
    }
  };

  const completeDay = async (date: string, completionData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.completeDay(date, completionData);
      
      if (response.success) {
        // Refresh the daily plan
        await getDailyPlan(date);
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
  };

  const startStudySession = async (sessionData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.startStudySession(sessionData);
      
      if (response.success && response.data) {
        return true;
      } else {
        setError(response.message || 'Failed to start study session');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start study session';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const endStudySession = async (sessionId: string, endData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await studyPlannerService.endStudySession(sessionId, endData);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to end study session');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end study session';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

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
    startStudySession,
    endStudySession,
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
