import { useState, useEffect, useCallback } from 'react';
import { TaskManagementService } from '../api/task-management';
import { DailyPlanningService } from '../api/daily-planning';
import {
  Task,
  DailyPlan,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  DeferTaskRequest,
  TaskStatus,
  DateString
} from '../types/study-planner';

interface UseTaskManagementOptions {
  studyPlanId?: string;
  date?: DateString;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface TaskManagementState {
  tasks: Task[];
  dailyPlan: DailyPlan | null;
  loading: boolean;
  error: string | null;
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    deferredTasks: number;
  };
}

export function useTaskManagement(options: UseTaskManagementOptions = {}) {
  const {
    studyPlanId,
    date,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const [state, setState] = useState<TaskManagementState>({
    tasks: [],
    dailyPlan: null,
    loading: false,
    error: null,
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      deferredTasks: 0
    }
  });

  // Calculate stats from tasks
  const calculateStats = useCallback((tasks: Task[]) => {
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      inProgressTasks: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      pendingTasks: tasks.filter(t => t.status === TaskStatus.PENDING).length,
      deferredTasks: tasks.filter(t => t.status === TaskStatus.DEFERRED).length
    };
  }, []);

  // Fetch tasks for a specific date
  const fetchTasksForDate = useCallback(async (targetDate: DateString) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const paginatedResponse = await TaskManagementService.getTasksForDate(targetDate);
      const tasks = paginatedResponse.content;
      const stats = calculateStats(tasks);
      setState(prev => ({
        ...prev,
        tasks,
        stats,
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching tasks for date:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        loading: false
      }));
    }
  }, [calculateStats]);

  // Fetch today's tasks
  const fetchTodayTasks = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const paginatedResponse = await TaskManagementService.getTodayTasks();
      const tasks = paginatedResponse.content;
      const stats = calculateStats(tasks);
      setState(prev => ({
        ...prev,
        tasks,
        stats,
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch today\'s tasks',
        loading: false
      }));
    }
  }, [calculateStats]);

  // Fetch daily plan
  const fetchDailyPlan = useCallback(async (targetDate: DateString) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await DailyPlanningService.getDailyPlan(targetDate);
      if (response.success) {
        setState(prev => ({
          ...prev,
          dailyPlan: response.data,
          loading: false
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch daily plan');
      }
    } catch (error) {
      console.error('Error fetching daily plan:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch daily plan',
        loading: false
      }));
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData: CreateTaskRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const newTask = await TaskManagementService.createTask(taskData);
      setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
        stats: calculateStats([...prev.tasks, newTask]),
        loading: false
      }));
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create task',
        loading: false
      }));
      throw error;
    }
  }, [calculateStats]);

  // Update a task
  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedTask = await TaskManagementService.updateTask(taskId, updates);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.taskId === taskId ? updatedTask : t),
        stats: calculateStats(prev.tasks.map(t => t.taskId === taskId ? updatedTask : t)),
        loading: false
      }));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update task',
        loading: false
      }));
      throw error;
    }
  }, [calculateStats]);

  // Start a task
  const startTask = useCallback(async (taskId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedTask = await TaskManagementService.startTask(taskId);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.taskId === taskId ? updatedTask : t),
        stats: calculateStats(prev.tasks.map(t => t.taskId === taskId ? updatedTask : t)),
        loading: false
      }));
      return updatedTask;
    } catch (error) {
      console.error('Error starting task:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start task',
        loading: false
      }));
      throw error;
    }
  }, [calculateStats]);

  // Complete a task
  const completeTask = useCallback(async (taskId: string, completionData: CompleteTaskRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedTask = await TaskManagementService.completeTask(taskId, completionData);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.taskId === taskId ? updatedTask : t),
        stats: calculateStats(prev.tasks.map(t => t.taskId === taskId ? updatedTask : t)),
        loading: false
      }));
      return updatedTask;
    } catch (error) {
      console.error('Error completing task:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to complete task',
        loading: false
      }));
      throw error;
    }
  }, [calculateStats]);

  // Defer a task
  const deferTask = useCallback(async (taskId: string, deferData: DeferTaskRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedTask = await TaskManagementService.deferTask(taskId, deferData);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.taskId === taskId ? updatedTask : t),
        stats: calculateStats(prev.tasks.map(t => t.taskId === taskId ? updatedTask : t)),
        loading: false
      }));
      return updatedTask;
    } catch (error) {
      console.error('Error deferring task:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to defer task',
        loading: false
      }));
      throw error;
    }
  }, [calculateStats]);

  // Delete a task (remove from local state)
  const deleteTask = useCallback((taskId: string) => {
    setState(prev => {
      const updatedTasks = prev.tasks.filter(t => t.taskId !== taskId);
      return {
        ...prev,
        tasks: updatedTasks,
        stats: calculateStats(updatedTasks)
      };
    });
  }, [calculateStats]);

  // Refresh data
  const refresh = useCallback(() => {
    if (date) {
      fetchTasksForDate(date);
      fetchDailyPlan(date);
    } else {
      fetchTodayTasks();
    }
  }, [date, fetchTasksForDate, fetchDailyPlan, fetchTodayTasks]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  // Initial data fetch
  useEffect(() => {
    if (date) {
      fetchTasksForDate(date);
      fetchDailyPlan(date);
    } else {
      fetchTodayTasks();
    }
  }, [date, studyPlanId, fetchTasksForDate, fetchDailyPlan, fetchTodayTasks]);

  return {
    ...state,
    createTask,
    updateTask,
    startTask,
    completeTask,
    deferTask,
    deleteTask,
    refresh,
    clearError,
    fetchTasksForDate,
    fetchTodayTasks,
    fetchDailyPlan
  };
}
