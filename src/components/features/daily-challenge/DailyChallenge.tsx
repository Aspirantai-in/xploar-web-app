'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Newspaper, Brain, Target, CheckCircle, Circle, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { FEATURES } from '@/lib/utils/constants';

// Define the structure for our daily tasks
interface DailyTask {
    id: string;
    type: 'Current Affairs Quiz' | 'Polity MCQs' | 'CSAT Practice' | 'History Revision';
    title: string;
    description: string;
    goal: number; // e.g., number of questions or minutes
    icon: React.ElementType;
    isCompleted: boolean;
}

// Generate a static set of daily tasks for the demo
const getDailyTasks = (): DailyTask[] => [
    { id: 'task1', type: 'Current Affairs Quiz', title: 'Today\'s Current Affairs Quiz', description: 'Test your knowledge of recent events.', goal: 5, icon: Newspaper, isCompleted: false },
    { id: 'task2', type: 'Polity MCQs', title: '20 Polity MCQs', description: 'Strengthen your fundamentals in Indian Polity.', goal: 20, icon: Target, isCompleted: false },
    { id: 'task3', type: 'CSAT Practice', title: 'CSAT Logical Reasoning', description: 'Solve 2 problems to sharpen your analytical skills.', goal: 2, icon: Brain, isCompleted: false },
    { id: 'task4', type: 'History Revision', title: 'Revise Modern History Flashcards', description: 'Quick 15-minute revision session.', goal: 15, icon: BrainCircuit, isCompleted: false },
];


export function DailyChallenge() {
    const { navigateTo } = useAppStore();
    const [tasks, setTasks] = useState<DailyTask[]>(getDailyTasks());

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const totalTasks = tasks.length;
    const progress = (completedCount / totalTasks) * 100;

    const handleTaskToggle = (taskId: string) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
    };

    const handleTakeAction = (task: DailyTask) => {
        // This simulates navigating to the relevant section and then marks the task complete
        switch (task.type) {
            case 'Current Affairs Quiz':
            case 'Polity MCQs':
                alert(`Starting ${task.title}...`);
                navigateTo(FEATURES.MOCK_TESTS);
                break;
            case 'History Revision':
                alert(`Navigating to Flashcards for revision...`);
                navigateTo(FEATURES.CONTENT_HUB);
                break;
            case 'CSAT Practice':
                alert(`Starting ${task.title}...`);
                navigateTo(FEATURES.MOCK_TESTS);
                break;
        }
        // For the demo, we'll auto-complete it after the alert.
        // In a real app, this would be marked complete after the activity is finished.
        if (!task.isCompleted) {
            handleTaskToggle(task.id);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <ShieldCheck className="h-16 w-16 text-electric-aqua mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-void-black mb-2">Prelims Daily Essentials</h1>
                <p className="text-void-black/70">
                    Complete these essential tasks every day to build a winning routine.
                </p>
            </motion.div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Today's Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <span className="font-bold text-2xl text-electric-aqua">{completedCount}/{totalTasks} Tasks Done</span>
                        <Progress value={progress} className="w-full" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Daily Checklist</CardTitle>
                    <CardDescription>Click on a task to start and mark it as complete.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {tasks.map((task, index) => {
                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={cn("transition-all", task.isCompleted ? "bg-green-50 border-green-200" : "bg-white")}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleTaskToggle(task.id)}>
                                                {task.isCompleted ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-gray-300" />}
                                            </button>
                                            <div className={cn(task.isCompleted && "line-through text-gray-500")}>
                                                <p className="font-semibold">{task.title}</p>
                                                <p className="text-sm text-void-black/70">{task.description}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleTakeAction(task)}
                                            disabled={task.isCompleted}
                                        >
                                            Start
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
