'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  FileText,
  Video,
  Brain,
  Target as TargetIcon
} from 'lucide-react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TaskType, SubjectArea, TaskPriority } from '@/lib/types/study-planner';

import { getErrorMessage } from '@/lib/utils/errorHandler';

interface TaskData {
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
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskData) => Promise<void>;
  date: Date;
  studyPlanId?: string;
}

const taskTypes = [
  { id: TaskType.READING, label: 'Reading', icon: BookOpen, description: 'Textbook reading, notes review' },
  { id: TaskType.PRACTICE_MCQ, label: 'Practice MCQ', icon: TargetIcon, description: 'Multiple choice questions' },
  { id: TaskType.ESSAY_WRITING, label: 'Essay Writing', icon: FileText, description: 'Essay and answer writing' },
  { id: TaskType.VIDEO_LECTURE, label: 'Video Lecture', icon: Video, description: 'Online video content' },
  { id: TaskType.REVISION, label: 'Revision', icon: Brain, description: 'Review and consolidate learning' },
  { id: TaskType.MOCK_TEST, label: 'Mock Test', icon: TargetIcon, description: 'Practice test or quiz' },
  { id: TaskType.NOTE_MAKING, label: 'Note Making', icon: FileText, description: 'Create study notes' },
  { id: TaskType.GROUP_DISCUSSION, label: 'Group Discussion', icon: Brain, description: 'Collaborative learning' },
  { id: TaskType.CURRENT_AFFAIRS, label: 'Current Affairs', icon: Clock, description: 'Recent events and news' },
  { id: TaskType.CUSTOM, label: 'Custom', icon: TargetIcon, description: 'Custom learning activity' }
];

const subjects = [
  SubjectArea.HISTORY,
  SubjectArea.GEOGRAPHY,
  SubjectArea.POLITICAL_SCIENCE,
  SubjectArea.ECONOMICS,
  SubjectArea.ENVIRONMENT,
  SubjectArea.SCIENCE_TECHNOLOGY,
  SubjectArea.CURRENT_AFFAIRS,
  SubjectArea.ETHICS,
  SubjectArea.GENERAL_STUDIES_1,
  SubjectArea.GENERAL_STUDIES_2,
  SubjectArea.ESSAY,
  SubjectArea.ANSWER_WRITING
];

const priorities = [
  { id: TaskPriority.CRITICAL, label: 'Critical', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: TaskPriority.HIGH, label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: TaskPriority.MEDIUM, label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: TaskPriority.LOW, label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: TaskPriority.OPTIONAL, label: 'Optional', color: 'bg-gray-100 text-gray-800 border-gray-200' }
];

export function CreateTaskModal({ isOpen, onClose, onSubmit, date, studyPlanId }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: TaskType.READING,
    subject: SubjectArea.HISTORY,
    priority: TaskPriority.MEDIUM,
    estimatedDuration: 60,
    dueDate: date.toISOString().split('T')[0],
    dueTime: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    isMandatory: false,
    isRecurring: false,
    chapter: '',
    pageRange: '',
    keyTopics: [] as string[],
    newTopic: '',
    books: [] as string[],
    newBook: '',
    videos: [] as string[],
    newVideo: '',
    notes: [] as string[],
    newNote: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addItem = (field: 'keyTopics' | 'books' | 'videos' | 'notes', value: string, newField: string) => {
    const arrayField = formData[field] as string[];
    if (value.trim() && !arrayField.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...arrayField, value.trim()],
        [newField]: ''
      }));
    }
  };

  const removeItem = (field: 'keyTopics' | 'books' | 'videos' | 'notes', itemToRemove: string) => {
    const arrayField = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: arrayField.filter((item: string) => item !== itemToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Duration validation
    if (formData.estimatedDuration <= 0) {
      newErrors.estimatedDuration = 'Duration must be greater than 0';
    } else if (formData.estimatedDuration > 480) { // 8 hours max
      newErrors.estimatedDuration = 'Duration cannot exceed 8 hours (480 minutes)';
    } else if (formData.estimatedDuration < 15) {
      newErrors.estimatedDuration = 'Duration must be at least 15 minutes';
    }

    // Due date validation
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Study plan validation
    if (!studyPlanId) {
      newErrors.studyPlan = 'No active study plan found. Please create a study plan first.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Transform form data to match API structure
        const taskData = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          subject: formData.subject,
          priority: formData.priority,
          estimatedDuration: formData.estimatedDuration,
          dueDate: formData.dueDate,
          dueTime: formData.dueTime || undefined,
          scheduledStartTime: formData.scheduledStartTime || undefined,
          scheduledEndTime: formData.scheduledEndTime || undefined,
          isMandatory: formData.isMandatory,
          isRecurring: formData.isRecurring,
          taskMetadata: {
            chapter: formData.chapter || undefined,
            pageRange: formData.pageRange || undefined,
            keyTopics: formData.keyTopics.length > 0 ? formData.keyTopics : undefined
          },
          resources: {
            books: formData.books.length > 0 ? formData.books : undefined,
            videos: formData.videos.length > 0 ? formData.videos : undefined,
            notes: formData.notes.length > 0 ? formData.notes : undefined
          }
        };

        await onSubmit(taskData);
        onClose();
        resetForm();
      } catch (error) {
        console.error('Error creating task:', error);
        const errorMessage = getErrorMessage(error, 'Failed to create task. Please try again.');
        setErrors({ submit: errorMessage });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: TaskType.READING,
      subject: SubjectArea.HISTORY,
      priority: TaskPriority.MEDIUM,
      estimatedDuration: 60,
      dueDate: date.toISOString().split('T')[0],
      dueTime: '',
      scheduledStartTime: '',
      scheduledEndTime: '',
      isMandatory: false,
      isRecurring: false,
      chapter: '',
      pageRange: '',
      keyTopics: [],
      newTopic: '',
      books: [],
      newBook: '',
      videos: [],
      newVideo: '',
      notes: [],
      newNote: ''
    });
    setErrors({});
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'keyTopics' | 'books' | 'videos' | 'notes', value: string, newField: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(field, value, newField);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Create New Task</CardTitle>
                <CardDescription>
                  Add a new task to your daily plan for {date.toLocaleDateString()}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              {/* Basic Task Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="e.g., Read NCERT History Chapter 1"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Area
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Describe what you need to accomplish..."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Task Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {taskTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${formData.type === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={formData.type === type.id}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.type === type.id ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                          <type.icon className={`h-4 w-4 ${formData.type === type.id ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {priorities.map((priority) => (
                      <button
                        key={priority.id}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.id)}
                        className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${formData.priority === priority.id
                          ? priority.color
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration and Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.estimatedDuration ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="60"
                  />
                  {errors.estimatedDuration && (
                    <p className="text-red-600 text-sm mt-1">{errors.estimatedDuration}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Time (optional)
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => handleInputChange('dueTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Task Options */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isMandatory}
                    onChange={(e) => handleInputChange('isMandatory', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Mark as mandatory</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Recurring task</span>
                </label>
              </div>

              {/* Task Metadata */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chapter/Section
                    </label>
                    <input
                      type="text"
                      value={formData.chapter}
                      onChange={(e) => handleInputChange('chapter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Chapter 1, Section A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Range
                    </label>
                    <input
                      type="text"
                      value={formData.pageRange}
                      onChange={(e) => handleInputChange('pageRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 15-25"
                    />
                  </div>
                </div>

                {/* Key Topics */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Topics
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.newTopic}
                        onChange={(e) => handleInputChange('newTopic', e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'keyTopics', formData.newTopic, 'newTopic')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a key topic..."
                      />
                      <Button
                        type="button"
                        onClick={() => addItem('keyTopics', formData.newTopic, 'newTopic')}
                        variant="outline"
                        className="px-4 py-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {formData.keyTopics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.keyTopics.map((topic, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 border border-blue-200 rounded px-2 py-1 flex items-center space-x-1 text-sm"
                          >
                            <Tag className="h-3 w-3" />
                            <span>{topic}</span>
                            <button
                              type="button"
                              onClick={() => removeItem('keyTopics', topic)}
                              className="ml-1 hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resources</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Books */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Books
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={formData.newBook}
                          onChange={(e) => handleInputChange('newBook', e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, 'books', formData.newBook, 'newBook')}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a book..."
                        />
                        <Button
                          type="button"
                          onClick={() => addItem('books', formData.newBook, 'newBook')}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.books.map((book, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                          <span className="text-sm">{book}</span>
                          <button
                            type="button"
                            onClick={() => removeItem('books', book)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Videos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Videos
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={formData.newVideo}
                          onChange={(e) => handleInputChange('newVideo', e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, 'videos', formData.newVideo, 'newVideo')}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a video..."
                        />
                        <Button
                          type="button"
                          onClick={() => addItem('videos', formData.newVideo, 'newVideo')}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                          <span className="text-sm">{video}</span>
                          <button
                            type="button"
                            onClick={() => removeItem('videos', video)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={formData.newNote}
                          onChange={(e) => handleInputChange('newNote', e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, 'notes', formData.newNote, 'newNote')}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a note..."
                        />
                        <Button
                          type="button"
                          onClick={() => addItem('notes', formData.newNote, 'newNote')}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.notes.map((note, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                          <span className="text-sm">{note}</span>
                          <button
                            type="button"
                            onClick={() => removeItem('notes', note)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}
            </CardContent>

            {/* Footer Actions */}
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}