'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DayView } from './DayView';
import { PomodoroTimer } from './PomodoroTimer';
import { ProgressSidebar } from './ProgressSidebar';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils/dateUtils';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function StudyPlanner() {
    const [dayRange, setDayRange] = useState({ start: 1, end: 5 });
    const {
        studyPlan,
        currentVisibleDay,
        studyConfiguration,
        viewDay,
        dailyStreak
    } = useAppStore();

    if (!studyPlan.length) {
        return (
            <div className="p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <Target className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Study Plan Found</h2>
                    <p className="text-void-black/70 mb-4">
                        You haven't created a study plan yet. Let's set up your personalized learning journey.
                    </p>
                    <Button
                        variant="gradient"
                        onClick={() => useAppStore.getState().navigateTo('onboarding')}
                    >
                        Create Study Plan
                    </Button>
                </motion.div>
            </div>
        );
    }

    const currentDay = studyPlan.find(day => day.day === currentVisibleDay);
    const totalTasks = studyPlan.reduce((acc, day) => acc + day.tasks.length, 0);
    const completedTasks = studyPlan.reduce((acc, day) =>
        acc + day.tasks.filter(task => task.isDone).length, 0
    );
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header Stats */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
                >
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-sm text-void-black/70">Current Day</p>
                                    <p className="text-lg font-semibold">{currentVisibleDay} / {studyPlan.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Target className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-sm text-void-black/70">Progress</p>
                                    <p className="text-lg font-semibold">{Math.round(progressPercentage)}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-sm text-void-black/70">Streak</p>
                                    <p className="text-lg font-semibold">{dailyStreak} days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-sm text-void-black/70">Daily Goal</p>
                                    <p className="text-lg font-semibold">{studyConfiguration.hoursPerDay}h</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Progress</CardTitle>
                            <CardDescription>
                                {completedTasks} of {totalTasks} tasks completed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={progressPercentage} className="h-3" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Day Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Study Days</CardTitle>
                                    <CardDescription>Navigate through your study plan</CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDayRange(prev => ({
                                            start: Math.max(1, prev.start - 5),
                                            end: Math.max(5, prev.end - 5)
                                        }))}
                                        disabled={dayRange.start <= 1}
                                    >
                                        Previous 5
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDayRange(prev => ({
                                            start: Math.min(studyPlan.length - 4, prev.start + 5),
                                            end: Math.min(studyPlan.length, prev.end + 5)
                                        }))}
                                        disabled={dayRange.end >= studyPlan.length}
                                    >
                                        Next 5
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-4">
                                {studyPlan
                                    .slice(dayRange.start - 1, dayRange.end)
                                    .map((day) => {
                                        const dayProgress = day.tasks.filter(t => t.isDone).length / day.tasks.length * 100;
                                        const isActive = day.day === currentVisibleDay;
                                        const isCompleted = dayProgress === 100;

                                        return (
                                            <motion.div
                                                key={day.day}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="relative"
                                            >
                                                <Card
                                                    className={cn(
                                                        "cursor-pointer transition-all duration-200 border-2",
                                                        isActive && "ring-2 ring-electric-aqua ring-offset-2",
                                                        isCompleted && "bg-dark-blue/10 border-dark-blue",
                                                        !isCompleted && !isActive && "border-electric-aqua/20 hover:border-electric-aqua/40"
                                                    )}
                                                    onClick={() => viewDay(day.day)}
                                                >
                                                    <CardContent className="p-4 text-center">
                                                        {/* Day Number */}
                                                        <div className={cn(
                                                            "text-lg font-bold mb-2",
                                                            isCompleted ? "text-void-black" :
                                                                isActive ? "text-electric-aqua" : "text-void-black"
                                                        )}>
                                                            Day {day.day}
                                                        </div>

                                                        {/* Date */}
                                                        <div className={cn(
                                                            "text-xs mb-3",
                                                            isCompleted ? "text-void-black/70" : "text-void-black/50"
                                                        )}>
                                                            {formatDate(day.date)}
                                                        </div>

                                                        {/* Progress Circle */}
                                                        <div className="relative w-12 h-12 mx-auto mb-2">
                                                            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                                                <path
                                                                    className="text-gray-200"
                                                                    stroke="currentColor"
                                                                    strokeWidth="3"
                                                                    fill="none"
                                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                />
                                                                <path
                                                                    className={isCompleted ? "text-void-black" : "text-electric-aqua"}
                                                                    stroke="currentColor"
                                                                    strokeWidth="3"
                                                                    strokeLinecap="round"
                                                                    fill="none"
                                                                    strokeDasharray={`${dayProgress}, 100`}
                                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                />
                                                            </svg>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className={cn(
                                                                    "text-xs font-medium",
                                                                    isCompleted ? "text-void-black" : "text-electric-aqua"
                                                                )}>
                                                                    {Math.round(dayProgress)}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Status */}
                                                        <div className={cn(
                                                            "text-xs font-medium",
                                                            isCompleted ? "text-void-black" :
                                                                dayProgress > 0 ? "text-yellow-600" : "text-void-black/50"
                                                        )}>
                                                            {isCompleted ? "Complete" :
                                                                dayProgress > 0 ? "In Progress" : "Not Started"}
                                                        </div>

                                                        {/* Tasks Info */}
                                                        <div className={cn(
                                                            "text-xs mt-1",
                                                            isCompleted ? "text-void-black/70" : "text-void-black/50"
                                                        )}>
                                                            {day.tasks.filter(t => t.isDone).length}/{day.tasks.length} tasks
                                                        </div>
                                                    </CardContent>

                                                    {/* Completion Badge */}
                                                    {isCompleted && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-electric-aqua rounded-full flex items-center justify-center"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 text-void-black" />
                                                        </motion.div>
                                                    )}

                                                    {/* Active Indicator */}
                                                    {isActive && !isCompleted && (
                                                        <motion.div
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="absolute -top-1 -right-1 w-3 h-3 bg-electric-aqua rounded-full"
                                                        />
                                                    )}
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                            </div>

                            {/* Day Range Indicator */}
                            <div className="mt-4 text-center text-sm text-void-black/70">
                                Showing days {dayRange.start} - {Math.min(dayRange.end, studyPlan.length)} of {studyPlan.length}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Current Day View */}
                {currentDay && <DayView day={currentDay} />}

                {/* Pomodoro Timer */}
                <PomodoroTimer />
            </div>

            {/* Progress Sidebar */}
            <ProgressSidebar />
        </div>
    );
}