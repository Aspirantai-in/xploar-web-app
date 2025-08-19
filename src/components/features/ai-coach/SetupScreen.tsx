'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenSquare, Book, Landmark, Scale, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EssayGenre } from './AIEvaluation';
import { cn } from '@/lib/utils';

interface SetupScreenProps {
    onStart: (genre: EssayGenre, question: string) => void;
}

const genres = [
    { id: 'Polity', name: 'Polity', icon: Landmark },
    { id: 'Economy', name: 'Economy', icon: Banknote },
    { id: 'History', name: 'History', icon: Book },
    { id: 'Ethics', name: 'Ethics', icon: Scale },
];

const questions: Record<EssayGenre, string[]> = {
    Polity: ["Is the Basic Structure doctrine a barrier to parliamentary sovereignty?", "Critically analyze the role of the Election Commission in ensuring free and fair elections."],
    Economy: ["Discuss the challenges and opportunities of Digital Currency for the Indian economy.", "Evaluate the impact of GST on fiscal federalism in India."],
    History: ["Compare and contrast the socio-religious reform movements of the 19th century.", "Trace the evolution of Gandhi's strategy during the Indian freedom struggle."],
    Ethics: ["What does 'probity in governance' mean to you? Illustrate with examples.", "Discuss the ethical dilemmas faced by a civil servant in the context of political pressure."],
};

export function SetupScreen({ onStart }: SetupScreenProps) {
    const [selectedGenre, setSelectedGenre] = useState<EssayGenre | null>(null);

    const handleStart = () => {
        if (!selectedGenre) return;
        const generatedQuestion = questions[selectedGenre][Math.floor(Math.random() * questions[selectedGenre].length)];
        onStart(selectedGenre, generatedQuestion);
    };

    return (
        <div className="text-center">
            <PenSquare className="h-16 w-16 text-electric-aqua mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-void-black mb-2">AI Essay Evaluation</h1>
            <p className="text-void-black/70 mb-8 max-w-2xl mx-auto">
                Hone your Mains answer writing skills. Select a subject to receive a timed essay question and get instant, AI-powered feedback.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>1. Select Your Subject</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {genres.map(genre => {
                            const Icon = genre.icon;
                            return (
                                <motion.div key={genre.id} whileHover={{ y: -5 }}>
                                    <Card
                                        className={cn("cursor-pointer transition-all border-2", selectedGenre === genre.name ? "border-electric-aqua bg-electric-aqua/10" : "hover:border-electric-aqua/50")}
                                        onClick={() => setSelectedGenre(genre.name as EssayGenre)}
                                    >
                                        <CardContent className="p-6">
                                            <Icon className="h-8 w-8 mx-auto text-dark-blue mb-2" />
                                            <h3 className="font-semibold">{genre.name}</h3>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                    <Button size="lg" disabled={!selectedGenre} onClick={handleStart}>
                        Start Timed Test (15 minutes)
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
