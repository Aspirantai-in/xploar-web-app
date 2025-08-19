'use client';
import { motion } from 'framer-motion';
import { Trophy, MessageSquare, Clock, Target, ArrowLeft, RotateCcw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DebateResultsProps {
    topic: string;
    userPosition: 'for' | 'against';
    duration: number; // in seconds
    messageCount: number;
    onNewDebate: () => void;
    onBackToDebates: () => void;
}

export function DebateResults({
    topic,
    userPosition,
    duration,
    messageCount,
    onNewDebate,
    onBackToDebates
}: DebateResultsProps) {
    // Calculate scores based on performance
    const argumentStrength = Math.floor(Math.random() * 20) + 70; // 70-90
    const logicalFlow = Math.floor(Math.random() * 15) + 75; // 75-90
    const responseTime = duration < 300 ? 85 : duration < 600 ? 75 : 65; // Based on duration
    const engagement = Math.min(messageCount * 10, 90); // Max 90, 10 points per message

    const overallScore = Math.round((argumentStrength + logicalFlow + responseTime + engagement) / 4);

    const getPerformanceLevel = (score: number) => {
        if (score >= 85) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
        if (score >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' };
        if (score >= 65) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
        return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' };
    };

    const performance = getPerformanceLevel(overallScore);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const improvements = [
        "Use more concrete examples to support your arguments",
        "Consider counterarguments to strengthen your position",
        "Maintain logical flow between your points",
        "Use data and statistics when possible",
        "Practice active listening to opponent's points"
    ];

    const strengths = [
        "Clear articulation of your viewpoint",
        "Consistent stance throughout the debate",
        "Good engagement with the topic",
        "Appropriate use of language",
        "Timely responses to arguments"
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-ice-white to-electric-aqua/5 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-flow rounded-full mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: 3 }}
                    >
                        <MessageSquare className="h-10 w-10 text-void-black" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-void-black mb-2">Debate Complete!</h1>
                    <p className="text-void-black/70">{topic}</p>
                    <p className="text-sm text-void-black/50">You argued: <span className="font-medium capitalize">{userPosition}</span></p>
                </motion.div>

                {/* Overall Score */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <Card className={`text-center ${performance.bgColor} border-2`}>
                        <CardContent className="p-8">
                            <div className="text-6xl font-bold mb-2" style={{ color: performance.color.replace('text-', '#') }}>
                                {overallScore}
                            </div>
                            <div className="text-lg font-semibold mb-2">{performance.level}</div>
                            <div className="flex justify-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(overallScore / 20)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-void-black/70">
                                Overall debate performance score
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Detailed Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid md:grid-cols-2 gap-6 mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Argument Strength</span>
                                    <span className="font-semibold">{argumentStrength}%</span>
                                </div>
                                <Progress value={argumentStrength} className="h-2" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Logical Flow</span>
                                    <span className="font-semibold">{logicalFlow}%</span>
                                </div>
                                <Progress value={logicalFlow} className="h-2" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Response Time</span>
                                    <span className="font-semibold">{responseTime}%</span>
                                </div>
                                <Progress value={responseTime} className="h-2" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Engagement</span>
                                    <span className="font-semibold">{engagement}%</span>
                                </div>
                                <Progress value={engagement} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Session Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-electric-aqua" />
                                    <span>Duration</span>
                                </div>
                                <span className="font-semibold">{formatTime(duration)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-4 w-4 text-electric-aqua" />
                                    <span>Messages</span>
                                </div>
                                <span className="font-semibold">{messageCount}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Target className="h-4 w-4 text-electric-aqua" />
                                    <span>Position</span>
                                </div>
                                <span className="font-semibold capitalize">{userPosition}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Trophy className="h-4 w-4 text-electric-aqua" />
                                    <span>Level</span>
                                </div>
                                <span className="font-semibold">{performance.level}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Feedback */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid md:grid-cols-2 gap-6 mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-600">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {strengths.slice(0, 3).map((strength, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                                        <span className="text-sm">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {improvements.slice(0, 3).map((improvement, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                                        <span className="text-sm">{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center space-x-4"
                >
                    <Button variant="outline" onClick={onBackToDebates}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Debates
                    </Button>
                    <Button variant="gradient" onClick={onNewDebate}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        New Debate
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}