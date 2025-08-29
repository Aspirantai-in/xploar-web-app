'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RubricCard } from './RubricCard';
import { SAMPLE_FLASHCARDS } from '@/lib/data/extended-data';
import { TopicID } from '@/lib/types';
import { motion } from 'framer-motion';

export function RecallMode({ topicId }: { topicId: TopicID }) {
    const cards = SAMPLE_FLASHCARDS.filter(c => c.deckId.includes(topicId.split('_')[0])).slice(0, 2);
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentCard(prev => (prev + 1) % cards.length);
    };

    if (cards.length === 0) {
        return <p>No recall cards available for this topic yet.</p>
    }

    const card = cards[currentCard];

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Recall</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <motion.div
                            className="w-full h-48 rounded-lg cursor-pointer flex items-center justify-center p-6 text-center border-2"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <p className="text-lg font-semibold">{isFlipped ? card.back : card.front}</p>
                        </motion.div>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setIsFlipped(!isFlipped)}>
                                {isFlipped ? 'Hide' : 'Show'} Answer
                            </Button>
                            <Button onClick={handleNext}>Next Card</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <RubricCard
                    title="Quality Bar for Recall"
                    criteria={[
                        "Attempt to answer before revealing.",
                        "Speak the answer aloud to reinforce memory.",
                        "Focus on keywords and core concepts.",
                        "Note down topics you struggle to recall."
                    ]}
                />
            </div>
        </div>
    );
}
