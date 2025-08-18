'use client';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionDisplayProps {
    question: string;
    questionNumber: number;
}

export function QuestionDisplay({ question, questionNumber }: QuestionDisplayProps) {
    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(question);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Question {questionNumber}</span>
                        <Button variant="ghost" size="sm" onClick={handleSpeak}>
                            <Volume2 className="h-4 w-4" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed">{question}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}