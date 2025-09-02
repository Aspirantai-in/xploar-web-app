'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Target,
  Plus,
  Brain,
  CheckCircle2,
  CalendarDays,
  BarChart3,
  Trophy,
  Flame,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import { Badge } from '@/components/ui/Badge';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TaskList } from './TaskList';
import { CreateTaskModal } from './CreateTaskModal';
import { DailyProgress } from './DailyProgress';
import { useStudyPlans } from '@/lib/hooks/useStudyPlans';
import { useTaskManagement } from '@/lib/hooks/useTaskManagement';
import { TaskStatus, TaskType, SubjectArea, TaskPriority } from '@/lib/types/study-planner';

export function DailyPlanner() {
  const { currentPlan } = useStudyPlans();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  // Convert date to API format (YYYY-MM-DD)
  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Use the task management hook with the selected date
  const {
    tasks,
    dailyPlan,
    loading,
    error,
    stats,
    createTask,
    startTask,
    completeTask,
    deferTask,
    deleteTask,
    refresh,
    clearError
  } = useTaskManagement({
    studyPlanId: currentPlan?.planId,
    date: formatDateForAPI(selectedDate),
    autoRefresh: true,
    refreshInterval: 60000 // Refresh every minute
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Navigate to different dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  // Check if selected date is today
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Handle task actions
  const handleTaskAction = async (taskId: string, action: 'start' | 'complete' | 'defer' | 'edit' | 'delete') => {
    try {
      switch (action) {
        case 'start':
          await startTask(taskId);
          break;
        case 'complete':
          // For now, use default completion data - could be enhanced with a modal
          await completeTask(taskId, {
            actualDurationMinutes: 60,
            completionPercentage: 100
          });
          break;
        case 'defer':
          // For now, defer to tomorrow - could be enhanced with a modal
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          await deferTask(taskId, {
            reason: 'User requested deferral',
            deferToDate: formatDateForAPI(tomorrow)
          });
          break;
        case 'delete':
          deleteTask(taskId);
          break;
        case 'edit':
          // TODO: Implement edit functionality
          console.log('Edit task:', taskId);
          break;
      }
    } catch (error) {
      console.error('Error performing task action:', error);
    }
  };

  // Handle task creation
  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    type: TaskType;
    subject: SubjectArea;
    priority: TaskPriority;
    estimatedDuration: number;
    dueDate: string;
    dueTime?: string;
    scheduledStartTime?: string;
    scheduledEndTime?: string;
    isMandatory: boolean;
    isRecurring: boolean;
    taskMetadata?: {
      chapter?: string;
      pageRange?: string;
      keyTopics?: string[];
    };
    resources?: {
      books?: string[];
      videos?: string[];
      notes?: string[];
    };
  }) => {
    try {
      // Transform the form data to match the API structure
      const apiTaskData = {
        title: taskData.title,
        description: taskData.description,
        taskType: taskData.type as TaskType,
        subjectArea: taskData.subject as SubjectArea,
        subject: taskData.subject,
        priority: taskData.priority as TaskPriority,
        estimatedDurationMinutes: taskData.estimatedDuration,
        dueDate: taskData.dueDate,
        isMandatory: taskData.priority === 'HIGH',
        isRecurring: false
      };

      await createTask(apiTaskData);
      setShowCreateTask(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    if (activeTab === 'today') {
      return tasks.filter(task => task.status !== TaskStatus.COMPLETED);
    } else if (activeTab === 'tasks') {
      return tasks;
    }
    return [];
  };

  // Show error banner if there's an error
  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Daily Planner</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-3">
              <Button onClick={clearError} variant="outline">
                Dismiss
              </Button>
              <Button onClick={refresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daily Planner</h1>
              <p className="text-gray-600 mt-1">
                {currentPlan ? `Planning for: ${currentPlan.title}` : 'No active study plan'}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigateDate('prev')}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Calendar className="h-4 w-4" />
                Previous Day
              </Button>

              <Button
                variant="default"
                onClick={() => setSelectedDate(new Date())}
                className={`flex items-center gap-2 ${isToday ? 'bg-blue-600' : 'bg-gray-600'}`}
                disabled={loading}
              >
                <CalendarDays className="h-4 w-4" />
                Today
              </Button>

              <Button
                variant="outline"
                onClick={() => navigateDate('next')}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Calendar className="h-4 w-4" />
                Next Day
              </Button>

              <Button
                variant="outline"
                onClick={refresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Date Display */}
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {formatDate(selectedDate)}
            </h2>
            {isToday && (
              <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Today
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-lg font-semibold">{stats.totalTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-lg font-semibold">{stats.completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-lg font-semibold">{stats.inProgressTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-lg font-semibold">{stats.pendingTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'today', label: 'Today\'s Plan', icon: CalendarDays },
              { id: 'tasks', label: 'All Tasks', icon: Target },
              { id: 'progress', label: 'Daily Progress', icon: BarChart3 },
              { id: 'achievements', label: 'Achievements', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <LoadingSpinner size="lg" text="Loading your daily planner..." />
                <p className="text-gray-600 mt-4">Fetching your tasks and progress...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Content */}
        {!loading && (
          <ErrorBoundary fallback={
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Content</h3>
                <p className="text-gray-600 mb-4">There was an error loading the {activeTab} content.</p>
                <Button onClick={refresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          }>
            <div className="space-y-6">
              {activeTab === 'today' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* AI Suggested Tasks */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          <CardTitle>Today's Tasks</CardTitle>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {dailyPlan ? 'AI Powered' : 'Loading...'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {dailyPlan
                          ? `Tasks for ${formatDate(selectedDate)} - ${dailyPlan.completionPercentage}% complete`
                          : 'Loading your daily plan...'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TaskList
                        tasks={getFilteredTasks()}
                        onTaskAction={handleTaskAction}
                        loading={loading}
                      />
                    </CardContent>
                  </Card>

                  {/* Daily Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Progress</CardTitle>
                      <CardDescription>Your progress for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DailyProgress
                        date={selectedDate}
                        dailyPlan={dailyPlan}
                        stats={stats}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
                      <p className="text-sm text-gray-600">Manage and track all your tasks</p>
                    </div>
                    <Button
                      onClick={() => setShowCreateTask(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!currentPlan}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>

                  <TaskList
                    tasks={tasks}
                    onTaskAction={handleTaskAction}
                    loading={loading}
                  />
                </div>
              )}

              {activeTab === 'progress' && (
                <DailyProgress
                  date={selectedDate}
                  dailyPlan={dailyPlan}
                  stats={stats}
                  detailed={true}
                />
              )}

              {activeTab === 'achievements' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Your learning milestones and accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No achievements yet. Keep studying to earn badges!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ErrorBoundary>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          onSubmit={handleCreateTask}
          date={selectedDate}
          studyPlanId={currentPlan?.planId}
        />
      )}
    </div>
  );
}
