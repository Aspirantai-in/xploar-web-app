'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Target, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';

import { PomodoroTimer } from './PomodoroTimer';
import { ProgressSidebar } from './ProgressSidebar';
import { useStudyPlanner } from '@/lib/context/StudyPlannerContext';
import { formatDate } from '@/lib/utils/dateUtils';
import { useState } from 'react';


export function StudyPlanner() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dayRange, setDayRange] = useState({ start: 1, end: 5 });
    const { currentPlan, isLoading, error } = useStudyPlanner();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showCreatePlan, setShowCreatePlan] = useState(false);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <Target className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Error Loading Study Plan</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button
                        variant="default"
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Retry
                    </Button>
                </motion.div>
            </div>
        );
    }

    // No study plan found
    if (!currentPlan) {
        return (
            <div className="p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Study Plan Found</h2>
                    <p className="text-gray-600 mb-4">
                        You haven't created a study plan yet. Let's set up your personalized learning journey.
                    </p>
                    <Button
                        variant="default"
                        onClick={() => setShowCreatePlan(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Study Plan
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Calculate progress from the real API data
    const progressPercentage = currentPlan.completionPercentage || 0;
    const totalDays = currentPlan.totalDays || 0;
    const completedDays = currentPlan.completedDays || 0;

    return (
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header Stats */}
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {currentPlan.title}
                            </h1>
                            <p className="text-gray-600">{currentPlan.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{completedDays}</div>
                                <div className="text-sm text-gray-500">Days Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{totalDays}</div>
                                <div className="text-sm text-gray-500">Total Days</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                            <span className="text-sm font-medium text-gray-700">{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                    >
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Target className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <div className="text-2xl font-bold">{currentPlan.targetHoursPerDay}h</div>
                                        <div className="text-sm text-gray-500">Daily Target</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    <div>
                                        <div className="text-2xl font-bold">{currentPlan.difficultyLevel}</div>
                                        <div className="text-sm text-gray-500">Difficulty</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <div className="text-2xl font-bold">{currentPlan.status}</div>
                                        <div className="text-sm text-gray-500">Status</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {new Date(currentPlan.createdDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">Created</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Study Plan Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-electric-aqua" />
                                        <span>Study Plan Overview</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Your personalized study schedule and progress tracking
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h3 className="font-semibold text-blue-900 mb-2">Plan Details</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-blue-700">Start Date:</span>
                                                    <span className="ml-2 text-blue-900">{formatDate(currentPlan.startDate)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700">End Date:</span>
                                                    <span className="ml-2 text-blue-900">{formatDate(currentPlan.endDate)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700">Subjects:</span>
                                                    <span className="ml-2 text-blue-900">
                                                        {currentPlan.subjects.mandatory.join(', ')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700">Version:</span>
                                                    <span className="ml-2 text-blue-900">{currentPlan.version || 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pomodoro Timer */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6"
                        >
                            <PomodoroTimer />
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <ProgressSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}