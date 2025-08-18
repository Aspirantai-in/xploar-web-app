'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuestionCard } from './QuestionCard';
import { ResultsScreen } from './ResultsScreen';
import { useAppStore } from '@/lib/store';
import { MCQ_BANK } from '@/lib/data/questions';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { calculateMockScore } from '@/lib/utils/scoreCalculator';
import { APP_CONFIG } from '@/lib/utils/constants';
import { getTodayString } from '@/lib/utils/dateUtils';

interface MockRunnerProps {
    topicId: string;
    useNegativeMarking: boolean;
    onComplete: () => void;
}

export function MockRunner({ topicId, useNegativeMarking, onComplete }: MockRunnerProps) {
    const { saveMockTest } = useAppStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [timeLeft, setTimeLeft] = useState(APP_CONFIG.MOCK_TEST_DURATION * 60); // 90 minutes in seconds
    const [showResults, setShowResults] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const questions = MCQ_BANK[topicId]?.slice(0, APP_CONFIG.QUESTIONS_PER_MOCK) || [];
    const topic = UPSC_FOUNDATION.find(t => t.id === topicId);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (questionIndex: number, answerIndex: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex.toString()]: answerIndex
        }));
    };

    const handleSubmit = () => {
        const score = calculateMockScore(questions, answers, useNegativeMarking);
        const timeTaken = APP_CONFIG.MOCK_TEST_DURATION - Math.floor(timeLeft / 60);

        const mockRun = {
            id: `mock_${Date.now()}`,
            date: getTodayString(),
            topicId,
            score,
            totalQuestions: questions.length,
            timeTakenMins: timeTaken,
            usesNegativeMarking: useNegativeMarking,
        };

        saveMockTest(mockRun);
        setIsSubmitted(true);
        setShowResults(true);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    if (showResults) {
        return (
            <ResultsScreen
                questions={questions}
                answers={answers}
                topicName={topic?.name || 'Unknown Topic'}
                useNegativeMarking={useNegativeMarking}
                timeTaken={APP_CONFIG.MOCK_TEST_DURATION - Math.floor(timeLeft / 60)}
                onClose={onComplete}
            />
        );
    }

    if (questions.length === 0) {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Questions Available</h2>
                <p className="text-void-black/70 mb-4">
                    No questions found for the selected topic.
                </p>
                <Button onClick={onComplete} type="button">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-ice-white to-electric-aqua/5">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-16 z-10 bg-ice-white/90 backdrop-blur border-b border-electric-aqua/20 p-4"
            >
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold">{topic?.name}</h1>
                        <div className="text-sm text-void-black/70">
                            Question {currentQuestion + 1} of {questions.length}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-electric-aqua" />
                            <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-500' : 'text-void-black'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <Button variant="outline" onClick={handleSubmit} type="button">
                            <Flag className="h-4 w-4 mr-2" />
                            Submit Test
                        </Button>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-4">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-void-black/70 mt-1">
                        <span>Progress: {Math.round(progress)}%</span>
                        <span>Answered: {answeredCount}/{questions.length}</span>
                    </div>
                </div>
            </motion.div>

            {/* Question Content */}
            <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
                <div className="grid lg:grid-cols-4 gap-6 h-full">
                    {/* Question Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <QuestionCard
                                    question={questions[currentQuestion]}
                                    questionNumber={currentQuestion + 1}
                                    selectedAnswer={answers[currentQuestion.toString()]}
                                    onAnswer={(answerIndex) => handleAnswer(currentQuestion, answerIndex)}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                type="button"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>

                            <Button
                                variant="gradient"
                                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                                disabled={currentQuestion === questions.length - 1}
                                type="button"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Question Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-32">
                            <CardHeader>
                                <CardTitle className="text-lg">Question Navigator</CardTitle>
                                <CardDescription>
                                    Click on any question to jump to it
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
                                    {questions.map((_, index) => {
                                        const isAnswered = answers[index.toString()] !== undefined;
                                        const isCurrent = index === currentQuestion;

                                        return (
                                            <Button
                                                key={index}
                                                variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                                                size="sm"
                                                className="h-10 w-10 p-0"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setCurrentQuestion(index);
                                                }}
                                                type="button"
                                            >
                                                {index + 1}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 space-y-2 text-xs">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-electric-aqua rounded"></div>
                                        <span>Current</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-neon-lilac rounded"></div>
                                        <span>Answered</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 border border-electric-aqua/20 rounded"></div>
                                        <span>Not Answered</span>
                                    </div>
                                </div>

                                <Button
                                    variant="gradient"
                                    className="w-full mt-4"
                                    onClick={handleSubmit}
                                    type="button"
                                >
                                    Submit Test
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}