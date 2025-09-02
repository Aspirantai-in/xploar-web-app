'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

interface TaskCardProps {
    task: {
        id: string;
        title: string;
        description: string;
        type: string;
        subject: string;
        priority: string;
        estimatedDuration: number;
        status: string;
        isAISuggested: boolean;
        dueDate: Date;
        tags: string[];
    };
    onAction: (taskId: string, action: 'start' | 'complete' | 'defer' | 'edit' | 'delete') => void;
}

export function TaskCard({ task, onAction }: TaskCardProps) {
    const getTaskIcon = (type: string) => {
        switch (type) {
            case 'READING': return <BookOpen className="h-4 w-4" />;
            case 'PRACTICE_MCQ': return <Target className="h-4 w-4" />;
            case 'ESSAY_WRITING': return <FileText className="h-4 w-4" />;
            case 'VIDEO_LECTURE': return <Video className="h-4 w-4" />;
            default: return <Target className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'DEFERRED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-start space-x-3">
                                <div className="flex items-center space-x-2">
                                    {task.isAISuggested ? (
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Brain className="h-4 w-4 text-purple-600" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                    )}
                                    {getTaskIcon(task.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                        {task.isAISuggested && (
                                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                                <Sparkles className="h-3 w-3 mr-1" />
                                                AI Suggested
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="flex items-center space-x-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{task.estimatedDuration}m</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Target className="h-3 w-3" />
                                            <span>{task.subject}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 mt-3">
                                        <Badge className={getPriorityColor(task.priority)}>
                                            {task.priority}
                                        </Badge>
                                        <Badge className={getStatusColor(task.status)}>
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {task.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                            {task.status === 'PENDING' && (
                                <Button
                                    size="sm"
                                    onClick={() => onAction(task.id, 'start')}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Play className="h-4 w-4" />
                                </Button>
                            )}

                            {task.status === 'IN_PROGRESS' && (
                                <Button
                                    size="sm"
                                    onClick={() => onAction(task.id, 'complete')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                </Button>
                            )}

                            {task.status !== 'COMPLETED' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onAction(task.id, 'defer')}
                                >
                                    <SkipForward className="h-4 w-4" />
                                </Button>
                            )}

                            {!task.isAISuggested && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction(task.id, 'edit')}
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction(task.id, 'delete')}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
    );
}
