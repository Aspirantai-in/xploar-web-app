'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    selectedAnswer?: number;
    onAnswer: (answerIndex: number) => void;
    showCorrectAnswer?: boolean;
}

export function QuestionCard({
    question,
    questionNumber,
    selectedAnswer,
    onAnswer,
    showCorrectAnswer = false
}: QuestionCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Question {questionNumber}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                    {question.stem}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = showCorrectAnswer && index === question.ans;
                        const isWrong = showCorrectAnswer && isSelected && index !== question.ans;

                        return (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <button
                                    className={cn(
                                        "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                                        isSelected && !showCorrectAnswer && "border-electric-aqua bg-electric-aqua/10",
                                        !isSelected && !showCorrectAnswer && "border-electric-aqua/20 hover:border-electric-aqua/40 hover:bg-electric-aqua/5",
                                        isCorrect && "border-green-500 bg-green-50",
                                        isWrong && "border-red-500 bg-red-50",
                                        showCorrectAnswer && !isCorrect && !isWrong && "border-gray-200 bg-gray-50"
                                    )}
                                    onClick={() => !showCorrectAnswer && onAnswer(index)}
                                    disabled={showCorrectAnswer}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                                            isSelected && !showCorrectAnswer && "border-electric-aqua bg-electric-aqua text-void-black",
                                            !isSelected && !showCorrectAnswer && "border-electric-aqua/40",
                                            isCorrect && "border-green-500 bg-green-500 text-white",
                                            isWrong && "border-red-500 bg-red-500 text-white"
                                        )}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="flex-1">{option}</span>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}