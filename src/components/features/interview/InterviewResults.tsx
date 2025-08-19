'use client';
import { motion } from 'framer-motion';
import { Mic, Clock, MessageSquare, ArrowLeft, RotateCcw, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface InterviewResultsProps {
    interviewType: string;
    duration: number; // in seconds
    questionsAnswered: number;
    responses: string[];
    onNewInterview: () => void;
    onBackToInterviews: () => void;
}

export function InterviewResults({
    interviewType,
    duration,
    questionsAnswered,
    responses,
    onNewInterview,
    onBackToInterviews
}: InterviewResultsProps) {
    // Calculate scores based on responses
    const avgResponseLength = responses.reduce((acc, res) => acc + res.split(' ').length, 0) / responses.length;

    const communication = Math.min(avgResponseLength * 2, 90); // Max 90, based on response length
    const confidence = Math.floor(Math.random() * 20) + 70; // 70-90
    const relevance = Math.floor(Math.random() * 15) + 75; // 75-90
    const structure = avgResponseLength > 50 ? 85 : avgResponseLength > 30 ? 75 : 65;

    const overallScore = Math.round((communication + confidence + relevance + structure) / 4);

    const getPerformanceLevel = (score: number) => {
        if (score >= 85) return { level: 'Outstanding', color: 'text-green-600', bgColor: 'bg-green-50' };
        if (score >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' };
        if (score >= 65) return { level: 'Satisfactory', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
        return { level: 'Needs Work', color: 'text-red-600', bgColor: 'bg-red-50' };
    };

    const performance = getPerformanceLevel(overallScore);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const avgTimePerQuestion = Math.round(duration / questionsAnswered);

    const recommendations = [
        "Practice structuring answers with clear introduction, body, and conclusion",
        "Use STAR method (Situation, Task, Action, Result) for examples",
        "Include more specific examples from your experience",
        "Work on maintaining eye contact and confident posture",
        "Practice speaking at an optimal pace - not too fast or slow"
    ];

    const positives = [
        "Maintained composure throughout the interview",
        "Provided thoughtful responses to questions",
        "Demonstrated understanding of the topics",
        "Completed the interview session successfully",
        "Showed engagement with the interview process"
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
                        <Mic className="h-10 w-10 text-void-black" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-void-black mb-2">Interview Complete!</h1>
                    <p className="text-void-black/70 capitalize">{interviewType.replace('-', ' ')} Interview</p>
                    <p className="text-sm text-void-black/50">{questionsAnswered} questions answered</p>
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
                                Overall interview performance score
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
                            <CardTitle>Performance Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Communication</span>
                                    <span className="font-semibold">{Math.round(communication)}%</span>
                                </div>
                                <Progress value={communication} className="h-2" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Confidence</span>
                                    <span className="font-semibold">{confidence}%</span>
                                </div>
                                <Progress value={confidence} className="h-2" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Relevance</span>
                                    <span className="font-semibold">{relevance}%</span>
                                </div>
                                <Progress value={relevance} className="h-2" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Structure</span>
                                    <span className="font-semibold">{structure}%</span>
                                </div>
                                <Progress value={structure} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Interview Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-electric-aqua" />
                                    <span>Total Duration</span>
                                </div>
                                <span className="font-semibold">{formatTime(duration)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-4 w-4 text-electric-aqua" />
                                    <span>Questions</span>
                                </div>
                                <span className="font-semibold">{questionsAnswered}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4 text-electric-aqua" />
                                    <span>Avg Time/Question</span>
                                </div>
                                <span className="font-semibold">{formatTime(avgTimePerQuestion)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Mic className="h-4 w-4 text-electric-aqua" />
                                    <span>Avg Response Length</span>
                                </div>
                                <span className="font-semibold">{Math.round(avgResponseLength)} words</span>
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
                            <CardTitle className="text-green-600">What Went Well</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {positives.slice(0, 4).map((positive, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                                        <span className="text-sm">{positive}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-blue-600">Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {recommendations.slice(0, 4).map((recommendation, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                        <span className="text-sm">{recommendation}</span>
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
                    <Button variant="outline" onClick={onBackToInterviews}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Interviews
                    </Button>
                    <Button variant="gradient" onClick={onNewInterview}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        New Interview
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
