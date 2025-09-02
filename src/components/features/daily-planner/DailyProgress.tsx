'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { DailyPlan } from '@/lib/types/study-planner';

interface DailyProgressProps {
  date: Date;
  dailyPlan?: DailyPlan | null;
  stats?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    deferredTasks: number;
  };
  detailed?: boolean;
}

export function DailyProgress({ date, dailyPlan, stats, detailed = false }: DailyProgressProps) {
  // Use real data if available, fallback to stats, then to defaults
  const totalTasks = dailyPlan?.totalTasks || stats?.totalTasks || 0;
  const completedTasks = dailyPlan?.completedTasks || stats?.completedTasks || 0;
  const inProgressTasks = dailyPlan?.inProgressTasks || stats?.inProgressTasks || 0;
  const pendingTasks = dailyPlan?.pendingTasks || stats?.pendingTasks || 0;
  const deferredTasks = dailyPlan?.deferredTasks || stats?.deferredTasks || 0;

  const targetHours = dailyPlan?.targetHours || 8;
  const completedHours = dailyPlan?.completedHours || 0;
  const completionPercentage = dailyPlan?.completionPercentage || 0;

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const timeProgressPercentage = targetHours > 0 ? (completedHours / targetHours) * 100 : 0;

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSubjectColor = (subject: string) => {
    const colors = {
      'HISTORY': 'bg-red-100 text-red-800 border-red-200',
      'GEOGRAPHY': 'bg-green-100 text-green-800 border-green-200',
      'POLITICAL_SCIENCE': 'bg-blue-100 text-blue-800 border-blue-200',
      'ECONOMICS': 'bg-purple-100 text-purple-800 border-purple-200',
      'ENVIRONMENT': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'SCIENCE_TECHNOLOGY': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'CURRENT_AFFAIRS': 'bg-orange-100 text-orange-800 border-orange-200',
      'ETHICS': 'bg-pink-100 text-pink-800 border-pink-200',
      'GENERAL_STUDIES_1': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'GENERAL_STUDIES_2': 'bg-violet-100 text-violet-800 border-violet-200',
      'ESSAY': 'bg-amber-100 text-amber-800 border-amber-200',
      'ANSWER_WRITING': 'bg-lime-100 text-lime-800 border-lime-200'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!detailed) {
    // Compact view for sidebar
    return (
      <div className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Progress</span>
            <span className="text-sm text-gray-500">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Time Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Time Spent</span>
            <span className="text-sm text-gray-500">
              {formatTime(completedHours)} / {formatTime(targetHours)}
            </span>
          </div>
          <Progress value={timeProgressPercentage} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">{completionPercentage}%</div>
            <div className="text-xs text-blue-500">Completion</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{completedTasks}</div>
            <div className="text-xs text-green-500">Completed</div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed view for main content
  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Daily Progress Summary</span>
          </CardTitle>
          <CardDescription>
            Your progress for {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Task Completion</span>
                <span className="text-sm text-gray-500">
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(progressPercentage)}% complete
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Time Progress</span>
                <span className="text-sm text-gray-500">
                  {formatTime(completedHours)} / {formatTime(targetHours)}
                </span>
              </div>
              <Progress value={timeProgressPercentage} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(timeProgressPercentage)}% of daily goal
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-blue-600 font-medium">Total Tasks</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-sm text-green-600 font-medium">Completed</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{inProgressTasks}</div>
              <div className="text-sm text-orange-600 font-medium">In Progress</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{pendingTasks}</div>
              <div className="text-sm text-purple-600 font-medium">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status Breakdown</CardTitle>
          <CardDescription>Current status of all your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { status: 'Completed', count: completedTasks, color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
              { status: 'In Progress', count: inProgressTasks, color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
              { status: 'Pending', count: pendingTasks, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Target },
              { status: 'Deferred', count: deferredTasks, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: TrendingUp }
            ].map((item, index) => {
              const Icon = item.icon;
              const percentage = totalTasks > 0 ? (item.count / totalTasks) * 100 : 0;

              return (
                <motion.div
                  key={item.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        {item.status}: {item.count} tasks
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Plan Information */}
      {dailyPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Plan Details</CardTitle>
            <CardDescription>Information about your daily study plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Plan Date</span>
                </div>
                <p className="text-blue-700">{dailyPlan.planDate}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Target Hours</span>
                </div>
                <p className="text-green-700">{formatTime(dailyPlan.targetHours)}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Status</span>
                </div>
                <Badge className={dailyPlan.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                  {dailyPlan.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Completion</span>
                </div>
                <p className="text-orange-700">{dailyPlan.completionPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {dailyPlan?.performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>How you performed today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyPlan.performanceMetrics.focusScore && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dailyPlan.performanceMetrics.focusScore}/10</div>
                  <div className="text-sm text-blue-600 font-medium">Focus Score</div>
                </div>
              )}

              {dailyPlan.performanceMetrics.productivity && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{dailyPlan.performanceMetrics.productivity}/10</div>
                  <div className="text-sm text-green-600 font-medium">Productivity</div>
                </div>
              )}

              {dailyPlan.performanceMetrics.energyLevel && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{dailyPlan.performanceMetrics.energyLevel}</div>
                  <div className="text-sm text-yellow-600 font-medium">Energy Level</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Notes */}
      {dailyPlan?.dailyNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Notes</CardTitle>
            <CardDescription>Your reflections and notes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyPlan.dailyNotes.morning && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">🌅 Morning</h4>
                  <p className="text-yellow-700">{dailyPlan.dailyNotes.morning}</p>
                </div>
              )}

              {dailyPlan.dailyNotes.afternoon && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">☀️ Afternoon</h4>
                  <p className="text-orange-700">{dailyPlan.dailyNotes.afternoon}</p>
                </div>
              )}

              {dailyPlan.dailyNotes.evening && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">🌙 Evening</h4>
                  <p className="text-purple-700">{dailyPlan.dailyNotes.evening}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
