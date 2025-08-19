'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Upload, Send, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EssayGenre } from './AIEvaluation';

interface WritingScreenProps {
    genre: EssayGenre;
    question: string;
    onSubmit: (essay: string) => void;
}

const TEST_DURATION_SECONDS = 15 * 60; // 15 minutes

export function WritingScreen({ genre, question, onSubmit }: WritingScreenProps) {
    const [essay, setEssay] = useState('');
    const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleSubmit();
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleImageUpload = () => {
        // This is a fake upload for the demo
        setImage("https://placehold.co/600x400/eee/ccc?text=Your+Diagram");
    };

    const handleSubmit = () => {
        onSubmit(essay);
    };

    return (
        <div>
            <Card className="mb-6 sticky top-20 z-10">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-dark-blue text-ice-white rounded-full text-sm font-medium">{genre}</span>
                        <p className="text-sm text-void-black/70 hidden md:block">Timed Essay Practice</p>
                    </div>
                    <div className={`flex items-center space-x-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-void-black'}`}>
                        <Clock className="h-5 w-5" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold">{question}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        className="w-full h-96 p-4 border border-dark-blue/20 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-dark-blue bg-ice-white text-base"
                        placeholder="Start writing your answer here..."
                        value={essay}
                        onChange={(e) => setEssay(e.target.value)}
                    />
                    <div className="mt-4 flex justify-between items-center">
                        <Button variant="outline" onClick={handleImageUpload}>
                            <Upload className="h-4 w-4 mr-2" /> {image ? 'Change Image' : 'Upload Image'}
                        </Button>
                        <Button size="lg" onClick={handleSubmit}>
                            <Send className="h-4 w-4 mr-2" /> Submit & Evaluate
                        </Button>
                    </div>
                    {image && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Attached Image:</p>
                            <img src={image} alt="Uploaded diagram" className="max-w-xs rounded-lg border" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
