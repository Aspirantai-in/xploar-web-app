'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Trophy, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { useAppStore } from '@/lib/store';
import { progressService } from '@/lib/api/progress';
import { formatDate } from '@/lib/utils/dateUtils';
import { useState, useEffect } from 'react';

export function ProgressDashboard() {
    const { studyPlans, mockTestHistory, dailyStreak } = useAppStore();
    const [overallProgress, setOverallProgress] = useState(0);
    const [totalStudyHours, setTotalStudyHours] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [topicProgress, setTopicProgress] = useState<Array<{ topic: string; progress: number; completed: number; total: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch real progress data from backend APIs
    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                setIsLoading(true);

                // Get overall progress from progress API
                const overallResponse = await progressService.getOverallProgress();
                if (overallResponse.success && overallResponse.data) {
                    const data = overallResponse.data as any; // Type assertion for now
                    setOverallProgress(data.overallStats?.overallCompletion || 0);
                    setTotalStudyHours(Math.floor((data.timeStats?.totalStudyTime || 0) / 60));
                    setCompletedTasks(data.overallStats?.completedTasks || 0);
                    setTotalTasks(data.overallStats?.totalTasks || 0);
                }

                // Get topic progress from progress API
                const topicResponse = await progressService.getSubjectProgress('GENERAL_STUDIES_1');
                if (topicResponse.success && topicResponse.data) {
                    // Transform API response to component format
                    const topics = Object.entries(topicResponse.data as any).map(([subject, data]: [string, any]) => ({
                        topic: subject,
                        progress: data.completionPercentage || 0,
                        completed: data.completedTasks || 0,
                        total: data.totalTasks || 0
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
                    setCompletedTasks(completedPlans);
                    setTotalTasks(totalPlans);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgressData();
    }, [studyPlans.length]);

    const avgMockScore = mockTestHistory.length > 0
        ? mockTestHistory.reduce((acc, test) => acc + test.score, 0) / mockTestHistory.length
        : 0;

    const bestMockScore = mockTestHistory.length > 0
        ? Math.max(...mockTestHistory.map(test => test.score))
        : 0;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">Progress Analytics</h1>
                <p className="text-void-black/70">
                    Track your preparation journey and identify areas for improvement
                </p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-8 w-8 text-electric-aqua" />
                            <div>
                                <p className="text-sm text-void-black/70">Overall Progress</p>
                                <p className="text-2xl font-bold text-void-black">{Math.round(overallProgress)}%</p>
                                <p className="text-xs text-void-black/50">{completedTasks}/{totalTasks} tasks</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Trophy className="h-8 w-8 text-electric-aqua" />
                            <div>
                                <p className="text-sm text-void-black/70">Daily Streak</p>
                                <p className="text-2xl font-bold text-void-black">{dailyStreak}</p>
                                <p className="text-xs text-void-black/50">days consistent</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-8 w-8 text-electric-aqua" />
                            <div>
                                <p className="text-sm text-void-black/70">Study Hours</p>
                                <p className="text-2xl font-bold text-void-black">{totalStudyHours}h</p>
                                <p className="text-xs text-void-black/50">total completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Target className="h-8 w-8 text-electric-aqua" />
                            <div>
                                <p className="text-sm text-void-black/70">Mock Average</p>
                                <p className="text-2xl font-bold text-void-black">{avgMockScore.toFixed(1)}</p>
                                <p className="text-xs text-void-black/50">best: {bestMockScore}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts and Detailed Analytics */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Topic Progress */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject-wise Progress</CardTitle>
                            <CardDescription>Your progress across different UPSC topics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topicProgress.map((topic, index) => (
                                <motion.div
                                    key={topic.topic}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{topic.topic}</span>
                                        <span className="text-sm text-void-black/70">
                                            {topic.completed}/{topic.total}
                                        </span>
                                    </div>
                                    <Progress value={topic.progress} className="h-2" />
                                    <div className="text-xs text-void-black/50">
                                        {Math.round(topic.progress)}% complete
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest study sessions and achievements</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Mock Test History */}
                            {mockTestHistory.slice(-5).reverse().map((test) => (
                                <div key={test.id} className="flex items-center space-x-3 p-2 rounded-lg bg-electric-aqua/5">
                                    <Target className="h-4 w-4 text-electric-aqua" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Mock Test Completed</p>
                                        <p className="text-xs text-void-black/70">
                                            {test.topicId}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-electric-aqua">{test.score}/20</p>
                                        <p className="text-xs text-void-black/50">{formatDate(test.date)}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Study Streak Updates */}
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-neon-lilac/10">
                                <Trophy className="h-4 w-4 text-neon-lilac" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Daily Streak Achievement</p>
                                    <p className="text-xs text-void-black/70">
                                        {dailyStreak} consecutive days of study
                                    </p>
                                </div>
                            </div>

                            {mockTestHistory.length === 0 && studyPlans.length === 0 && (
                                <div className="text-center py-8 text-void-black/50">
                                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">No recent activity</p>
                                    <p className="text-xs">Start studying to see your progress here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}