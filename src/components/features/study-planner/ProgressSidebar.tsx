'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TrendingUp, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { useAppStore } from '@/lib/store';
import { progressService } from '@/lib/api/progress';

export function ProgressSidebar() {
    const { studyPlans, dailyStreak } = useAppStore();
    const [topicProgress, setTopicProgress] = useState<Array<{ topic: string; progress: number; completed: number; total: number }>>([]);
    const [overallProgress, setOverallProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch real data from backend APIs
    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                setIsLoading(true);

                // Get overall progress from progress API
                const overallResponse = await progressService.getOverallProgress();
                if (overallResponse.success && overallResponse.data) {
                    setOverallProgress(overallResponse.data.overallStats.overallCompletion);
                }

                // Get topic progress from progress API
                const topicResponse = await progressService.getSubjectProgress('GENERAL_STUDIES_1');
                if (topicResponse.success && topicResponse.data) {
                    // Transform API response to component format
                    const topics = Object.entries(topicResponse.data).map(([subject, data]) => ({
                        topic: subject,
                        progress: data.completionPercentage,
                        completed: data.completedTasks,
                        total: data.totalTasks
                    }));
                    setTopicProgress(topics);
                }
            } catch (error) {
                console.error('Failed to fetch progress data:', error);
                // Fallback to study plans data if API fails
                if (studyPlans.length > 0) {
                    const totalPlans = studyPlans.length;
                    const completedPlans = studyPlans.filter(plan => plan.status === 'COMPLETED').length;
                    setOverallProgress(totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgressData();
    }, [studyPlans.length]);

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
                                    <div className="text-2xl font-bold text-neon-lilac">{studyPlans.length}</div>
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
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-electric-aqua mx-auto"></div>
                                    <p className="text-xs text-void-black/50 mt-2">Loading progress...</p>
                                </div>
                            ) : topicProgress.length === 0 ? (
                                <div className="text-center py-4 text-void-black/50">
                                    <p className="text-xs">No progress data available</p>
                                </div>
                            ) : (
                                topicProgress.map((topic, index) => (
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
                                ))
                            ))
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