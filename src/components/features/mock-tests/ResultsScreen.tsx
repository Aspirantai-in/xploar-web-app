'use client';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, CheckCircle, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuestionCard } from './QuestionCard';
import { Question } from '@/lib/types';
import { calculateMockScore, calculateAccuracy, getPerformanceLevel } from '@/lib/utils/scoreCalculator';

interface ResultsScreenProps {
    questions: Question[];
    answers: Record<string, number>;
    topicName: string;
    useNegativeMarking: boolean;
    timeTaken: number;
    onClose: () => void;
}

export function ResultsScreen({
    questions,
    answers,
    topicName,
    useNegativeMarking,
    timeTaken,
    onClose
}: ResultsScreenProps) {
    const score = calculateMockScore(questions, answers, useNegativeMarking);
    const correctAnswers = questions.filter((q, i) => answers[i.toString()] === q.ans).length;
    const wrongAnswers = questions.filter((q, i) =>
        answers[i.toString()] !== undefined && answers[i.toString()] !== q.ans
    ).length;
    const unattempted = questions.length - Object.keys(answers).length;
    const accuracy = calculateAccuracy(correctAnswers, questions.length);
    const performanceLevel = getPerformanceLevel(accuracy);

    const getPerformanceColor = (level: string) => {
        switch (level) {
            case 'Excellent': return 'text-green-600';
            case 'Good': return 'text-blue-600';
            case 'Average': return 'text-yellow-600';
            default: return 'text-red-600';
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-ice-white to-electric-aqua/5 p-6">
            <div className="max-w-6xl mx-auto">
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
                        <Trophy className="h-10 w-10 text-void-black" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-void-black mb-2">Test Completed!</h1>
                    <p className="text-void-black/70">{topicName}</p>
                </motion.div>

                {/* Results Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-electric-aqua mb-2">{score}</div>
                            <div className="text-sm text-void-black/70">Score</div>
                            <div className="text-xs text-void-black/50">out of {questions.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-neon-lilac mb-2">{accuracy}%</div>
                            <div className="text-sm text-void-black/70">Accuracy</div>
                            <div className={`text-xs font-medium ${getPerformanceColor(performanceLevel)}`}>
                                {performanceLevel}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-cosmic-indigo mb-2">{timeTaken}m</div>
                            <div className="text-sm text-void-black/70">Time Taken</div>
                            <div className="text-xs text-void-black/50">out of 90m</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-void-black mb-2">{correctAnswers}</div>
                            <div className="text-sm text-void-black/70">Correct</div>
                            <div className="text-xs text-void-black/50">{wrongAnswers} wrong, {unattempted} skipped</div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Detailed Breakdown */}
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Correct Answers</span>
                                </div>
                                <span className="font-semibold">{correctAnswers}</span>
                            </div>
                            <Progress value={(correctAnswers / questions.length) * 100} className="h-2" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    <span>Wrong Answers</span>
                                </div>
                                <span className="font-semibold">{wrongAnswers}</span>
                            </div>
                            <Progress value={(wrongAnswers / questions.length) * 100} className="h-2" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
                                    <span>Unattempted</span>
                                </div>
                                <span className="font-semibold">{unattempted}</span>
                            </div>
                            <Progress value={(unattempted / questions.length) * 100} className="h-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Time Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Time per Question</span>
                                <span className="font-semibold">{(timeTaken / questions.length).toFixed(1)}m</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Time Utilization</span>
                                <span className="font-semibold">{((timeTaken / 90) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Questions/Hour</span>
                                <span className="font-semibold">{(questions.length / (timeTaken / 60)).toFixed(1)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Question Review */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Review</CardTitle>
                            <CardDescription>
                                Review your answers and see the correct solutions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {questions.map((question, index) => (
                                    <div key={index} className="border-b border-electric-aqua/20 pb-6 last:border-b-0">
                                        <QuestionCard
                                            question={question}
                                            questionNumber={index + 1}
                                            selectedAnswer={answers[index.toString()]}
                                            onAnswer={() => { }}
                                            showCorrectAnswer={true}
                                        />
                                    </div>
                                ))}
                            </div>
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
                    <Button variant="outline" onClick={onClose}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Tests
                    </Button>
                    <Button variant="gradient" onClick={onClose}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Take Another Test
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}