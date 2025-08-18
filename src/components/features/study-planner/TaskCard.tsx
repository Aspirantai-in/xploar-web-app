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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { cn } from '@/lib/utils';

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const { toggleTaskCompletion, deferTask } = useAppStore();
    const topic = UPSC_FOUNDATION.find(t => t.id === task.topicId);

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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className={cn(
                "transition-all duration-200 cursor-pointer",
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
                                    <CheckCircle2 className="h-5 w-5 text-electric-aqua" />
                                ) : (
                                    <Circle className="h-5 w-5 text-void-black/40" />
                                )}
                            </Button>

                            <div className="flex items-center space-x-2">
                                <TaskIcon className={cn("h-4 w-4", getTaskColor(task.kind))} />
                                <span className={cn(
                                    "font-medium",
                                    task.isDone && "line-through text-void-black/60"
                                )}>
                                    {task.kind}
                                </span>
                            </div>

                            <div className="flex-1">
                                <p className={cn(
                                    "font-medium",
                                    task.isDone && "line-through text-void-black/60"
                                )}>
                                    {topic?.name || 'Unknown Topic'}
                                </p>
                                <div className="flex items-center space-x-2 text-sm text-void-black/70">
                                    <Clock className="h-3 w-3" />
                                    <span>{task.durationMins} minutes</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deferTask(task.id)}
                                className="h-8 px-2"
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