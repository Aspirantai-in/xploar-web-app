'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Video,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  Play,
  SkipForward,
  Edit3,
  Trash2,
  Sparkles,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Task, TaskStatus, TaskType, TaskPriority } from '@/lib/types/study-planner';

interface TaskListProps {
  tasks: Task[];
  onTaskAction: (taskId: string, action: 'start' | 'complete' | 'defer' | 'edit' | 'delete') => void;
  loading?: boolean;
}

export function TaskList({ tasks, onTaskAction, loading = false }: TaskListProps) {
  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.READING: return <BookOpen className="h-4 w-4" />;
      case TaskType.PRACTICE_MCQ: return <Target className="h-4 w-4" />;
      case TaskType.ESSAY_WRITING: return <FileText className="h-4 w-4" />;
      case TaskType.VIDEO_LECTURE: return <Video className="h-4 w-4" />;
      case TaskType.REVISION: return <Brain className="h-4 w-4" />;
      case TaskType.MOCK_TEST: return <Target className="h-4 w-4" />;
      case TaskType.NOTE_MAKING: return <FileText className="h-4 w-4" />;
      case TaskType.GROUP_DISCUSSION: return <Brain className="h-4 w-4" />;
      case TaskType.CURRENT_AFFAIRS: return <Clock className="h-4 w-4" />;
      case TaskType.CUSTOM: return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case TaskPriority.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      case TaskPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TaskPriority.LOW: return 'bg-green-100 text-green-800 border-green-200';
      case TaskPriority.OPTIONAL: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case TaskStatus.PENDING: return 'bg-gray-100 text-gray-800 border-gray-200';
      case TaskStatus.DEFERRED: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TaskStatus.SKIPPED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case TaskStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      case TaskStatus.BLOCKED: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubjectDisplayName = (subject: string) => {
    return subject.replace(/_/g, ' ');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-gray-400 animate-pulse" />
        </div>
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">
          No tasks available for this date. Create a new task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.taskId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center space-x-2">
                        {/* Task source indicator */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${task.taskMetadata?.source === 'AI_SUGGESTION'
                          ? 'bg-purple-100'
                          : 'bg-blue-100'
                          }`}>
                          {task.taskMetadata?.source === 'AI_SUGGESTION' ? (
                            <Brain className="h-4 w-4 text-purple-600" />
                          ) : (
                            <User className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        {getTaskIcon(task.taskType)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          {task.taskMetadata?.source === 'AI_SUGGESTION' && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Suggested
                            </Badge>
                          )}
                          {task.isMandatory && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              Mandatory
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(task.estimatedDurationMinutes)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>{getSubjectDisplayName(task.subject)}</span>
                          </span>
                          {task.completionPercentage > 0 && (
                            <span className="flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{task.completionPercentage}%</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mt-3">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          {task.isOverdue && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              Overdue
                            </Badge>
                          )}
                        </div>

                        {/* Task metadata */}
                        {task.taskMetadata && (
                          <div className="mt-2 text-xs text-gray-500">
                            {task.taskMetadata.chapter && (
                              <span className="mr-3">Chapter: {task.taskMetadata.chapter}</span>
                            )}
                            {task.taskMetadata.pageRange && (
                              <span className="mr-3">Pages: {task.taskMetadata.pageRange}</span>
                            )}
                            {task.taskMetadata.keyTopics && task.taskMetadata.keyTopics.length > 0 && (
                              <span>Topics: {task.taskMetadata.keyTopics.join(', ')}</span>
                            )}
                          </div>
                        )}

                        {/* Task resources */}
                        {task.resources && (
                          <div className="mt-2">
                            {task.resources.books && task.resources.books.length > 0 && (
                              <div className="text-xs text-gray-500 mb-1">
                                📚 {task.resources.books.join(', ')}
                              </div>
                            )}
                            {task.resources.videos && task.resources.videos.length > 0 && (
                              <div className="text-xs text-gray-500 mb-1">
                                🎥 {task.resources.videos.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {/* Action buttons based on task status */}
                    {task.status === TaskStatus.PENDING && task.canBeStarted && (
                      <Button
                        size="sm"
                        onClick={() => onTaskAction(task.taskId, 'start')}
                        className="bg-green-600 hover:bg-green-700"
                        title="Start Task"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    {task.status === TaskStatus.IN_PROGRESS && task.canBeCompleted && (
                      <Button
                        size="sm"
                        onClick={() => onTaskAction(task.taskId, 'complete')}
                        className="bg-blue-600 hover:bg-blue-700"
                        title="Complete Task"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}

                    {task.status !== TaskStatus.COMPLETED && task.canBeDeferred && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTaskAction(task.taskId, 'defer')}
                        title="Defer Task"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Edit and delete for user-created tasks */}
                    {task.taskMetadata?.source !== 'AI_SUGGESTION' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onTaskAction(task.taskId, 'edit')}
                          title="Edit Task"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onTaskAction(task.taskId, 'delete')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
