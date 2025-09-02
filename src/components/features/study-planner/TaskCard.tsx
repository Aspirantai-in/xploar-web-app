'use client';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Circle,
    Clock,
    BookOpen,
    Target,
    MessageSquare,
    RotateCcw,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Task } from '@/lib/types';
import { useAppStore } from '@/lib/store';
// Removed dummy data import
import { cn } from '@/lib/utils';

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const { toggleTaskCompletion, deferTask } = useAppStore();
    // TODO: Get topic name from backend API or task.subject
    const topicName = task.subject || 'Unknown Topic';

    const getTaskIcon = (kind: string) => {
        switch (kind) {
            case 'Read': return BookOpen;
            case 'Practice': return Target;
            case 'Explain': return MessageSquare;
            case 'Recall': return RotateCcw;
            default: return BookOpen;
        }
    };

    const getTaskColor = (kind: string) => {
        switch (kind) {
            case 'Read': return 'text-blue-500';
            case 'Practice': return 'text-green-500';
            case 'Explain': return 'text-purple-500';
            case 'Recall': return 'text-orange-500';
            default: return 'text-gray-500';
        }
    };

    const TaskIcon = getTaskIcon(task.kind);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className={cn(
                "transition-all duration-200 cursor-pointer border-2",
                task.isDone
                    ? "bg-gradient-flow/20 border-electric-aqua"
                    : "hover:shadow-md border-electric-aqua/20"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleTaskCompletion(task.id)}
                                className="h-8 w-8 p-0"
                            >
                                {task.isDone ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <Circle className="h-5 w-5" />
                                )}
                            </Button>

                            <div className="flex items-center space-x-2">
                                <TaskIcon className={cn("h-4 w-4", getTaskColor(task.kind))} />
                                <span className={cn(
                                    "font-medium text-sm px-2 py-1 rounded-full",
                                    task.isDone
                                        ? "bg-green-100 text-green-700 line-through"
                                        : "bg-dark-blue/10 text-dark-blue"
                                )}>
                                    {task.kind}
                                </span>
                            </div>

                            <div className="flex-1">
                                <p className={cn(
                                    "font-medium",
                                    task.isDone
                                        ? "line-through text-green-700"
                                        : "text-void-black"
                                )}>
                                    {topicName}
                                </p>
                                <div className="flex items-center space-x-2 text-sm text-void-black/70">
                                    <Clock className="h-3 w-3" />
                                    <span>{task.durationMins} minutes</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deferTask(task.id)}
                                className="h-8 px-3 border-dark-blue/30 text-dark-blue hover:bg-dark-blue hover:text-ice-white hover:border-dark-blue transition-all duration-200"
                            >
                                <Calendar className="h-3 w-3 mr-1" />
                                Defer
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}