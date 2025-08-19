'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import { UPSC_FOUNDATION } from '@/lib/data/topics';

export function ProgressSidebar() {
    const { studyPlan, dailyStreak } = useAppStore();

    const getTopicProgress = () => {
        const topicStats = UPSC_FOUNDATION.map(topic => {
            const topicTasks = studyPlan.flatMap(day =>
                day.tasks.filter(task => task.topicId === topic.id)
            );
            const completedTasks = topicTasks.filter(task => task.isDone).length;
            const totalTasks = topicTasks.length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return {
                topic: topic.name,
                progress,
                completed: completedTasks,
                total: totalTasks
            };
        });

        return topicStats;
    };

    const topicProgress = getTopicProgress();
    const overallProgress = studyPlan.length > 0
        ? (studyPlan.reduce((acc, day) =>
            acc + day.tasks.filter(task => task.isDone).length, 0
        ) / studyPlan.reduce((acc, day) => acc + day.tasks.length, 0)) * 100
        : 0;

    return (
        <motion.aside
            className="w-80 p-6 border-l border-electric-aqua/20 bg-ice-white/50"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="space-y-6">
                {/* Overall Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-lg">
                            <TrendingUp className="h-5 w-5 text-electric-aqua" />
                            <span>Overall Progress</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Study Plan</span>
                                <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                            </div>
                            <Progress value={overallProgress} className="h-2" />

                            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-electric-aqua">{dailyStreak}</div>
                                    <div className="text-xs text-void-black/70">Day Streak</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neon-lilac">{studyPlan.length}</div>
                                    <div className="text-xs text-void-black/70">Total Days</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Topic Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-electric-aqua" />
                            <span>Topic Progress</span>
                        </CardTitle>
                        <CardDescription>Progress across different subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topicProgress.map((topic, index) => (
                                <motion.div
                                    key={topic.topic}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="space-y-1"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium truncate">{topic.topic}</span>
                                        <span className="text-xs text-void-black/70">
                                            {topic.completed}/{topic.total}
                                        </span>
                                    </div>
                                    <Progress value={topic.progress} className="h-1" />
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-electric-aqua" />
                            <span>Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-void-black/70">
                                <div className="w-2 h-2 bg-electric-aqua rounded-full" />
                                <span>Study plan generated</span>
                            </div>
                            <div className="flex items-center space-x-2 text-void-black/70">
                                <div className="w-2 h-2 bg-neon-lilac rounded-full" />
                                <span>Daily streak: {dailyStreak} days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.aside>
    );
}