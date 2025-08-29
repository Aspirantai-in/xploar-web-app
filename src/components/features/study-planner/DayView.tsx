'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { TaskCard } from './TaskCard';
import { PlanDay } from '@/lib/types';
import { formatDate } from '@/lib/utils/dateUtils';

interface DayViewProps {
    day: PlanDay;
}

export function DayView({ day }: DayViewProps) {
    const completedTasks = day.tasks.filter(task => task.isDone).length;
    const totalTasks = day.tasks.length;
    const totalDuration = day.tasks.reduce((acc, task) => acc + task.durationMins, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-electric-aqua" />
                        <span>Day {day.day} - {formatDate(day.date)}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                        <span>{completedTasks}/{totalTasks} tasks completed</span>
                        <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}m total</span>
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {day.tasks.map((task, index) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <TaskCard task={task} />
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
