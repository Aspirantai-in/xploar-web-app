'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BaselineScreenProps {
    onNext: () => void;
}

const levels = [
    { id: 'beginner', title: 'Just Starting', desc: 'I am new to UPSC preparation.' },
    { id: 'intermediate', title: 'Have Covered Basics', desc: 'I have gone through the syllabus once.' },
    { id: 'advanced', title: 'Advanced Revision', desc: 'I am focused on revision and test-taking.' },
];

export function BaselineScreen({ onNext }: BaselineScreenProps) {
    const [selectedLevel, setSelectedLevel] = useState('');

    return (
        <div className="max-w-2xl text-center">
            <BarChart className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-void-black mb-2">What's your current preparation level?</h1>
            <p className="text-void-black/70 mb-8">This helps us set the right pace for you.</p>

            <div className="space-y-4 mb-8">
                {levels.map((level, index) => (
                    <motion.div
                        key={level.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className={cn(
                                "cursor-pointer transition-all border-2",
                                selectedLevel === level.id ? "border-electric-aqua bg-electric-aqua/10" : "hover:border-electric-aqua/50"
                            )}
                            onClick={() => setSelectedLevel(level.id)}
                        >
                            <CardContent className="p-6 text-left">
                                <h3 className="font-semibold">{level.title}</h3>
                                <p className="text-sm text-void-black/70">{level.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Button size="lg" onClick={onNext} disabled={!selectedLevel}>
                Generate My Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}
