'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Target, Clock, CheckCircle, Play, Pause, X } from 'lucide-react';
import { useStudyPlanner } from '@/lib/context/StudyPlannerContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading, CardSkeleton, PageSkeleton } from '@/components/ui/Loading';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { cn } from '@/lib/utils';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: any) => Promise<void>;
}

function CreatePlanModal({ isOpen, onClose, onSubmit }: CreatePlanModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    targetHoursPerDay: 8,
    difficultyLevel: 'INTERMEDIATE',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        targetHoursPerDay: 8,
        difficultyLevel: 'INTERMEDIATE',
      });
    } catch (error) {
      console.error('Failed to create plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Study Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours per Day
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={formData.targetHoursPerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, targetHoursPerDay: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loading size="sm" /> : 'Create Plan'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function StudyPlannerDashboard() {
  const { user } = useAuth();
  const {
    studyPlans,
    currentPlan,
    dailyPlan,
    tasks,
    isLoading,
    error,
    createStudyPlan,
    getStudyPlans,
    getStudyPlan,
    clearError,
  } = useStudyPlanner();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (studyPlans.length === 0) {
      getStudyPlans();
    }
  }, [studyPlans.length, getStudyPlans]);

  useEffect(() => {
    if (selectedPlanId) {
      getStudyPlan(selectedPlanId);
    }
  }, [selectedPlanId, getStudyPlan]);

  const handleCreatePlan = async (planData: any) => {
    try {
      const success = await createStudyPlan(planData);
      if (success) {
        await getStudyPlans();
      }
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  if (isLoading && studyPlans.length === 0) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading study plans
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    clearError();
                    getStudyPlans();
                  }}
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Planner</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName}! Let's make today productive.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Plan</span>
        </Button>
      </div>

      {/* Study Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="cursor-pointer"
            onClick={() => handlePlanSelect(plan.id)}
          >
            <Card className={cn(
              "transition-all duration-200",
              selectedPlanId === plan.id && "ring-2 ring-blue-500 shadow-lg"
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.title}</CardTitle>
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    plan.status === 'ACTIVE' && "bg-green-100 text-green-800",
                    plan.status === 'PAUSED' && "bg-yellow-100 text-yellow-800",
                    plan.status === 'COMPLETED' && "bg-blue-100 text-blue-800"
                  )}>
                    {plan.status}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{plan.totalDays} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Daily Target</span>
                    <span className="font-medium">{plan.targetHoursPerDay}h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium">{plan.difficultyLevel}</span>
                  </div>
                  {plan.completionPercentage !== undefined && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{plan.completionPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${plan.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Empty State */}
        {studyPlans.length === 0 && !isLoading && (
          <div className="col-span-full">
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No study plans yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first study plan to get started with organized learning.
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Current Plan Details */}
      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Current Plan: {currentPlan.title}
            </h2>

            {/* Plan Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentPlan.totalDays}
                  </div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentPlan.completedDays || 0}
                  </div>
                  <div className="text-sm text-gray-600">Completed Days</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentPlan.targetHoursPerDay}h
                  </div>
                  <div className="text-sm text-gray-600">Daily Target</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentPlan.completionPercentage?.toFixed(1) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Plan */}
            {dailyPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Today's Plan</span>
                  </CardTitle>
                  <CardDescription>
                    {dailyPlan.planDate} • {dailyPlan.totalTasks} tasks planned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Daily Progress</span>
                      <span className="text-sm text-gray-600">
                        {dailyPlan.completedTasks}/{dailyPlan.totalTasks} tasks completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${dailyPlan.totalTasks > 0 ? (dailyPlan.completedTasks / dailyPlan.totalTasks) * 100 : 0}%`
                        }}
                      />
                    </div>

                    {/* Task List */}
                    {dailyPlan.tasks && dailyPlan.tasks.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Today's Tasks</h4>
                        {dailyPlan.tasks.map((task) => (
                          <div
                            key={task.taskId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                "w-3 h-3 rounded-full",
                                task.status === 'COMPLETED' && "bg-green-500",
                                task.status === 'IN_PROGRESS' && "bg-blue-500",
                                task.status === 'PENDING' && "bg-gray-400"
                              )} />
                              <div>
                                <div className="font-medium text-sm">{task.title}</div>
                                <div className="text-xs text-gray-600">
                                  {task.taskType} • {task.estimatedDurationMinutes}min
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {task.status === 'PENDING' && (
                                <Button size="sm" variant="outline">
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                              {task.status === 'IN_PROGRESS' && (
                                <Button size="sm" variant="outline">
                                  <Pause className="w-3 h-3" />
                                </Button>
                              )}
                              {task.status === 'COMPLETED' && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      )}

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePlan}
      />
    </div>
  );
}

// Wrap with Error Boundary
export default function StudyPlannerDashboardWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <StudyPlannerDashboard />
    </ErrorBoundary>
  );
}
