'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
// Removed dummy data import

export function WeeklyReport() {
    const { studyPlan, mockTestHistory, studyConfiguration } = useAppStore();

    const weeklyStats = useMemo(() => {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const weeklyPlanDays = studyPlan.filter(day => {
            const dayDate = new Date(day.date);
            return dayDate >= lastWeek && dayDate <= today;
        });

        const weeklyMockTests = mockTestHistory.filter(test => {
            const testDate = new Date(test.date);
            return testDate >= lastWeek && testDate <= today;
        });

        const tasksCompleted = weeklyPlanDays.flatMap(d => d.tasks).filter(t => t.isDone).length;
        const tasksPlanned = weeklyPlanDays.flatMap(d => d.tasks).length;
        const coveragePercent = tasksPlanned > 0 ? (tasksCompleted / tasksPlanned) * 100 : 0;

        const hoursStudied = weeklyPlanDays.flatMap(d => d.tasks).filter(t => t.isDone).reduce((acc, task) => acc + task.durationMins, 0) / 60;
        const hoursGoal = weeklyPlanDays.length * studyConfiguration.hoursPerDay;
        const timeEfficiency = hoursGoal > 0 ? (hoursStudied / hoursGoal) * 100 : 0;

        const topicsCovered = new Set(weeklyPlanDays.flatMap(d => d.tasks).filter(t => t.isDone).map(t => t.topicId));

        const avgAccuracy = weeklyMockTests.length > 0
            ? weeklyMockTests.reduce((acc, test) => acc + (test.score / test.totalQuestions) * 100, 0) / weeklyMockTests.length
            : 0;

        const reportSummary = `This week, you completed ${tasksCompleted} out of ${tasksPlanned} planned tasks, achieving a syllabus coverage of ${coveragePercent.toFixed(0)}%. Your time efficiency was ${timeEfficiency.toFixed(0)}% of your goal. In mock tests, you maintained an average accuracy of ${avgAccuracy.toFixed(0)}%. Keep up the consistent effort!`;

        return {
            tasksCompleted,
            tasksPlanned,
            coveragePercent,
            hoursStudied,
            timeEfficiency,
            topicsCovered: topicsCovered.size,
            avgAccuracy,
            testsTaken: weeklyMockTests.length,
            reportSummary
        };
    }, [studyPlan, mockTestHistory, studyConfiguration]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
                <CardHeader>
                    <CardTitle>Your Weekly Performance Report</CardTitle>
                    <CardDescription>An AI-generated summary of your progress over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <Card>
                            <CardContent className="p-4">
                                <BookOpen className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                                <p className="text-2xl font-bold">{weeklyStats.coveragePercent.toFixed(0)}%</p>
                                <p className="text-sm text-void-black/70">Syllabus Coverage</p>
                                <p className="text-xs text-void-black/50">{weeklyStats.tasksCompleted}/{weeklyStats.tasksPlanned} tasks</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <Clock className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                                <p className="text-2xl font-bold">{weeklyStats.timeEfficiency.toFixed(0)}%</p>
                                <p className="text-sm text-void-black/70">Time Efficiency</p>
                                <p className="text-xs text-void-black/50">{weeklyStats.hoursStudied.toFixed(1)}h studied</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <Target className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                                <p className="text-2xl font-bold">{weeklyStats.avgAccuracy.toFixed(0)}%</p>
                                <p className="text-sm text-void-black/70">Avg. Accuracy</p>
                                <p className="text-xs text-void-black/50">{weeklyStats.testsTaken} tests taken</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <TrendingUp className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                                <p className="text-2xl font-bold">{weeklyStats.topicsCovered}</p>
                                <p className="text-sm text-void-black/70">Topics Covered</p>
                                <p className="text-xs text-void-black/50">topics covered</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">AI Evaluation & Recommendations</h3>
                        <div className="p-4 bg-dark-blue/5 rounded-lg border border-dark-blue/10">
                            <p className="text-sm text-void-black/90 leading-relaxed">{weeklyStats.reportSummary}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

