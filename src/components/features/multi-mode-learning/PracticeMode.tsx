'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RubricCard } from './RubricCard';
import { MCQ_BANK } from '@/lib/data/questions';
import { TopicID } from '@/lib/types';
import { cn } from '@/lib/utils';

export function PracticeMode({ topicId }: { topicId: TopicID }) {
    const questions = MCQ_BANK[topicId]?.slice(0, 3) || [];
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (index: number) => {
        setSelectedAnswer(index);
        setShowResult(true);
    };

    const handleNext = () => {
        setCurrentQ(prev => (prev + 1) % questions.length);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    if (questions.length === 0) {
        return <p>No practice questions available for this topic yet.</p>
    }

    const question = questions[currentQ];

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Practice MCQs ({currentQ + 1}/{questions.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="font-semibold">{question.stem}</p>
                        <div className="space-y-2">
                            {question.options.map((opt, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    onClick={() => handleAnswer(index)}
                                    disabled={showResult}
                                    className={cn("w-full justify-start h-auto py-2", showResult && (index === question.ans ? 'bg-green-100 border-green-400' : (selectedAnswer === index ? 'bg-red-100 border-red-400' : '')))}
                                >
                                    {opt}
                                </Button>
                            ))}
                        </div>
                        {showResult && (
                            <div className="flex justify-end">
                                <Button onClick={handleNext}>Next Question</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <RubricCard
                    title="Quality Bar for Practice"
                    criteria={[
                        "Read the question and all options carefully.",
                        "Use the elimination method to narrow choices.",
                        "Analyze why the correct answer is right.",
                        "Understand why the other options are wrong."
                    ]}
                />
            </div>
        </div>
    );
}
