'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { QuestionDisplay } from './QuestionDisplay';
import { ResponseInput } from './ResponseInput';
import { InterviewResults } from './InterviewResults';

const interviewTypes = [
    { id: 'personality', name: 'Personality Test', description: 'Questions about your background and motivation' },
    { id: 'current-affairs', name: 'Current Affairs', description: 'Recent national and international events' },
    { id: 'optional-subject', name: 'Optional Subject', description: 'Deep dive into your optional subject' },
    { id: 'ethics', name: 'Ethics & Integrity', description: 'Moral dilemmas and ethical scenarios' },
    { id: 'mixed', name: 'Mixed Round', description: 'Combination of all interview types' }
];

const sampleQuestions = {
    personality: [
        "Tell me about yourself and why you want to join civil services.",
        "What are your strengths and weaknesses?",
        "How do you handle stress and pressure?",
        "Describe a challenging situation you've overcome."
    ],
    'current-affairs': [
        "What are your views on the recent economic reforms?",
        "How can India improve its healthcare system?",
        "What challenges does climate change pose for India?",
        "Discuss India's foreign policy in the current global scenario."
    ],
    'optional-subject': [
        "Explain the key concepts in your optional subject.",
        "How does your optional subject relate to governance?",
        "What recent developments have occurred in your field?",
        "How can your subject knowledge help in administration?"
    ],
    ethics: [
        "You witness corruption in your department. What would you do?",
        "How do you balance personal beliefs with professional duties?",
        "What does integrity mean to you in public service?",
        "How would you handle a conflict between law and justice?"
    ],
    mixed: [
        "Tell me about yourself.",
        "What are the major challenges facing India today?",
        "How do you define leadership?",
        "Discuss a recent policy decision you disagree with."
    ]
};

export function InterviewRoom() {
    const [selectedType, setSelectedType] = useState('');
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<string[]>([]);
    const [currentResponse, setCurrentResponse] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);

    const handleStartInterview = () => {
        if (!selectedType) return;
        setIsInterviewActive(true);
        setCurrentQuestionIndex(0);
        setResponses([]);
        setCurrentResponse('');
        setInterviewStartTime(new Date()); // ADD THIS LINE
        setShowResults(false);
    };

    const handleNextQuestion = () => {
        setResponses(prev => [...prev, currentResponse]);
        setCurrentResponse('');

        const questions = sampleQuestions[selectedType as keyof typeof sampleQuestions] || [];
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Interview completed
            setIsInterviewActive(false);
            // Here you could show results/feedback
            setShowResults(true);
        }
    };

    const handleEndInterview = () => {
        setIsInterviewActive(false);
    };

    if (showResults) {
        const duration = interviewStartTime ? Math.floor((Date.now() - interviewStartTime.getTime()) / 1000) : 0;
        const finalResponses = [...responses];
        if (currentResponse.trim()) {
            finalResponses.push(currentResponse);
        }

        return (
            <InterviewResults
                interviewType={selectedType}
                duration={duration}
                questionsAnswered={finalResponses.length}
                responses={finalResponses}
                onNewInterview={() => {
                    setShowResults(false);
                    setSelectedType('');
                    setIsInterviewActive(false);
                }}
                onBackToInterviews={() => {
                    setShowResults(false);
                    setSelectedType('');
                    setIsInterviewActive(false);
                }}
            />
        );
    }

    if (!isInterviewActive) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Mic className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-void-black mb-2">Mock Interview</h1>
                    <p className="text-void-black/70">
                        Practice interview questions with AI feedback to improve your performance
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Interview Type</CardTitle>
                            <CardDescription>
                                Choose the type of interview questions you want to practice
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                {interviewTypes.map((type) => (
                                    <motion.div
                                        key={type.id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedType === type.id
                                            ? 'border-electric-aqua bg-electric-aqua/10'
                                            : 'border-electric-aqua/20 hover:border-electric-aqua/40'
                                            }`}
                                        onClick={() => setSelectedType(type.id)}
                                    >
                                        <h3 className="font-semibold mb-1">{type.name}</h3>
                                        <p className="text-sm text-void-black/70">{type.description}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-4 bg-electric-aqua/10 rounded-lg">
                                <h3 className="font-semibold mb-2">Interview Tips</h3>
                                <ul className="text-sm text-void-black/70 space-y-1">
                                    <li>• Speak clearly and confidently</li>
                                    <li>• Structure your answers with examples</li>
                                    <li>• Stay calm and composed</li>
                                    <li>• Be honest and authentic</li>
                                    <li>• Connect your answers to governance and policy</li>
                                </ul>
                            </div>

                            <Button
                                variant="gradient"
                                size="lg"
                                className="w-full"
                                onClick={handleStartInterview}
                                disabled={!selectedType}
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Start Interview
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const questions = sampleQuestions[selectedType as keyof typeof sampleQuestions] || [];
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-ice-white to-electric-aqua/5">
            {/* Interview Header */}
            <div className="p-4 border-b border-electric-aqua/20 bg-ice-white/90 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg">
                            {interviewTypes.find(t => t.id === selectedType)?.name} Interview
                        </h2>
                        <p className="text-sm text-void-black/70">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleEndInterview}>
                        <Square className="h-4 w-4 mr-2" />
                        End Interview
                    </Button>
                </div>
            </div>

            {/* Question & Response Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    <QuestionDisplay
                        question={currentQuestion}
                        questionNumber={currentQuestionIndex + 1}
                    />

                    <ResponseInput
                        value={currentResponse}
                        onChange={setCurrentResponse}
                        onSubmit={handleNextQuestion}
                        isLastQuestion={currentQuestionIndex === questions.length - 1}
                    />
                </div>
            </div>
        </div>
    );
}