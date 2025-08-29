'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Trophy, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { useAppStore } from '@/lib/store';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { formatDate } from '@/lib/utils/dateUtils';

interface MockHistoryProps {
    onBack: () => void;
}

export function MockHistory({ onBack }: MockHistoryProps) {
    const { mockTestHistory } = useAppStore();

    const getTopicName = (topicId: string) => {
        return UPSC_FOUNDATION.find(t => t.id === topicId)?.name || 'Unknown Topic';
    };

    const getOverallStats = () => {
        if (mockTestHistory.length === 0) return null;

        const totalScore = mockTestHistory.reduce((acc, test) => acc + test.score, 0);
        const avgScore = totalScore / mockTestHistory.length;
        const bestScore = Math.max(...mockTestHistory.map(test => test.score));
        const avgTime = mockTestHistory.reduce((acc, test) => acc + test.timeTakenMins, 0) / mockTestHistory.length;

        return { avgScore, bestScore, avgTime, totalTests: mockTestHistory.length };
    };

    const stats = getOverallStats();

    if (mockTestHistory.length === 0) {
        return (
            <div className="p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <Target className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Test History</h2>
                    <p className="text-void-black/70 mb-4">
                        You haven't taken any mock tests yet. Start your first test to see your progress here.
                    </p>
                    <Button variant="gradient" onClick={onBack}>
                        Take Your First Test
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-4 mb-8"
            >
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-void-black">Test History</h1>
                    <p className="text-void-black/70">Track your progress and performance over time</p>
                </div>
            </motion.div>

            {/* Overall Statistics */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Target className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalTests}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-sm text-void-black/70">Average Score</p>
                                    <p className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Trophy className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-sm text-void-black/70">Best Score</p>
                                    <p className="text-2xl font-bold">{stats.bestScore}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-electric-aqua" />
                                <div>
                                    <p className="text-sm text-void-black/70">Avg Time</p>
                                    <p className="text-2xl font-bold">{Math.round(stats.avgTime)}m</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Test History List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Tests</CardTitle>
                        <CardDescription>Your test history and performance details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockTestHistory
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((test, index) => {
                                    const accuracy = (test.score / test.totalQuestions) * 100;

                                    return (
                                        <motion.div
                                            key={test.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 bg-electric-aqua/5 rounded-lg hover:bg-electric-aqua/10 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <h3 className="font-semibold">{getTopicName(test.topicId)}</h3>
                                                        <div className="flex items-center space-x-4 text-sm text-void-black/70">
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>{formatDate(test.date)}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{test.timeTakenMins}m</span>
                                                            </div>
                                                            {test.usesNegativeMarking && (
                                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                                                    Negative Marking
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-electric-aqua">
                                                        {test.score}/{test.totalQuestions}
                                                    </div>
                                                    <div className="text-xs text-void-black/70">Score</div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-neon-lilac">
                                                        {accuracy.toFixed(0)}%
                                                    </div>
                                                    <div className="text-xs text-void-black/70">Accuracy</div>
                                                </div>

                                                <div className="w-32">
                                                    <Progress value={accuracy} className="h-2" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}