'use client';

import { CheckCircle, BarChart, Clock, BookOpen, Lightbulb, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EssayGenre } from './AIEvaluation';

interface ResultsScreenProps {
    genre: EssayGenre;
    question: string;
    essay: string;
    onRestart: () => void;
}

// Dummy evaluation data
const dummyEvaluation = {
    accuracy: 85, // Score out of 100
    coverage: 90, // % of question parts addressed
    timeEfficiency: 95, // % of time used effectively
    recommendations: [
        "Strengthen your introduction by stating your thesis more clearly.",
        "Include more specific examples or case studies to support your arguments.",
        "Improve the conclusion by summarizing key points and offering a forward-looking statement."
    ]
};

export function ResultsScreen({ genre, question, essay, onRestart }: ResultsScreenProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-void-black mb-2">Evaluation Complete</h1>
                <p className="text-void-black/70">Here is the AI Coach's feedback on your essay.</p>
            </div>

            {/* Metric Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <BarChart className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className="text-3xl font-bold">{dummyEvaluation.accuracy}%</p>
                        <p className="text-sm text-void-black/70">Accuracy & Relevance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <BookOpen className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className="text-3xl font-bold">{dummyEvaluation.coverage}%</p>
                        <p className="text-sm text-void-black/70">Syllabus Coverage</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 mx-auto text-electric-aqua mb-2" />
                        <p className="text-3xl font-bold">{dummyEvaluation.timeEfficiency}%</p>
                        <p className="text-sm text-void-black/70">Time Efficiency</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />Actionable Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 list-disc list-inside">
                        {dummyEvaluation.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Your Submission */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                    <CardDescription>{question}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm whitespace-pre-wrap p-4 bg-gray-50 rounded-md border">{essay || "(No answer was submitted.)"}</p>
                </CardContent>
            </Card>

            <div className="text-center">
                <Button size="lg" onClick={onRestart}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Practice Another Essay
                </Button>
            </div>
        </div>
    );
}
