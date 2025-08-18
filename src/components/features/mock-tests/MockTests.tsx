'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Trophy, Play, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MockRunner } from './MockRunner';
import { MockHistory } from './MockHistory';
import { useAppStore } from '@/lib/store';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { APP_CONFIG } from '@/lib/utils/constants';

export function MockTests() {
    const { mockTestHistory } = useAppStore();
    const [view, setView] = useState<'dashboard' | 'test' | 'history'>('dashboard');
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [useNegativeMarking, setUseNegativeMarking] = useState(true);

    const handleStartTest = () => {
        if (selectedTopic) {
            setView('test');
        }
    };

    if (view === 'test' && selectedTopic) {
        return (
            <MockRunner
                topicId={selectedTopic}
                useNegativeMarking={useNegativeMarking}
                onComplete={() => setView('dashboard')}
            />
        );
    }

    if (view === 'history') {
        return <MockHistory onBack={() => setView('dashboard')} />;
    }

    const getTopicStats = (topicId: string) => {
        const topicTests = mockTestHistory.filter(test => test.topicId === topicId);
        if (topicTests.length === 0) return null;

        const avgScore = topicTests.reduce((acc, test) => acc + test.score, 0) / topicTests.length;
        const bestScore = Math.max(...topicTests.map(test => test.score));

        return { avgScore, bestScore, attempts: topicTests.length };
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">Mock Tests</h1>
                <p className="text-void-black/70">
                    Practice with timed mock tests to evaluate your preparation level
                </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Target className="h-5 w-5 text-electric-aqua" />
                            <div>
                                <p className="text-sm text-void-black/70">Total Tests</p>
                                <p className="text-2xl font-bold">{mockTestHistory.length}</p>
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
                                <p className="text-2xl font-bold">
                                    {mockTestHistory.length > 0
                                        ? `${Math.max(...mockTestHistory.map(t => t.score))}/${APP_CONFIG.QUESTIONS_PER_MOCK}`
                                        : '-'
                                    }
                                </p>
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
                                <p className="text-2xl font-bold">
                                    {mockTestHistory.length > 0
                                        ? `${Math.round(mockTestHistory.reduce((acc, t) => acc + t.timeTakenMins, 0) / mockTestHistory.length)}m`
                                        : '-'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Start New Test */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Start New Mock Test</CardTitle>
                        <CardDescription>
                            Select a topic and configure your test settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Topic</label>
                                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UPSC_FOUNDATION.map((topic) => (
                                            <SelectItem key={topic.id} value={topic.id}>
                                                {topic.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Test Settings</label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={useNegativeMarking}
                                            onChange={(e) => setUseNegativeMarking(e.target.checked)}
                                            className="rounded border-electric-aqua/20"
                                        />
                                        <span className="text-sm">Negative Marking</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-electric-aqua/20">
                            <div className="text-sm text-void-black/70">
                                <p>• {APP_CONFIG.QUESTIONS_PER_MOCK} questions</p>
                                <p>• {APP_CONFIG.MOCK_TEST_DURATION} minutes duration</p>
                                <p>• {useNegativeMarking ? 'Negative marking enabled (-0.33)' : 'No negative marking'}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setView('history')}
                                >
                                    <History className="h-4 w-4 mr-2" />
                                    View History
                                </Button>
                                <Button
                                    variant="gradient"
                                    onClick={handleStartTest}
                                    disabled={!selectedTopic}
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Test
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Topic Performance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Topic Performance</CardTitle>
                        <CardDescription>
                            Your performance across different subjects
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {UPSC_FOUNDATION.map((topic, index) => {
                                const stats = getTopicStats(topic.id);

                                return (
                                    <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-electric-aqua/5 rounded-lg"
                                    >
                                        <div>
                                            <h3 className="font-medium">{topic.name}</h3>
                                            {stats ? (
                                                <p className="text-sm text-void-black/70">
                                                    {stats.attempts} attempts • Avg: {stats.avgScore.toFixed(1)} • Best: {stats.bestScore}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-void-black/70">No attempts yet</p>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedTopic(topic.id);
                                                handleStartTest();
                                            }}
                                        >
                                            Practice
                                        </Button>
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
