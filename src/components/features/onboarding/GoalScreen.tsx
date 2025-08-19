'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface GoalScreenProps {
    onNext: () => void;
}

const goals = [
    { id: 'prelims_2025', title: 'UPSC Prelims 2025', desc: 'Focused preparation for the Preliminary exam.' },
    { id: 'mains_2025', title: 'UPSC Mains 2025', desc: 'In-depth preparation for the Main exam.' },
    { id: 'foundation', title: 'Foundation Course', desc: 'Comprehensive syllabus coverage from scratch.' },
];

export function GoalScreen({ onNext }: GoalScreenProps) {
    const { updateStudyConfig } = useAppStore();
    const [selectedGoal, setSelectedGoal] = useState('');

    const handleSelect = (goalTitle: string) => {
        setSelectedGoal(goalTitle);
        updateStudyConfig({ goal: goalTitle });
    };

    return (
        <div className="max-w-2xl text-center">
            <Target className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-void-black mb-2">What is your primary goal?</h1>
            <p className="text-void-black/70 mb-8">This will help us tailor the study plan to your needs.</p>

            <div className="space-y-4 mb-8">
                {goals.map((goal, index) => (
                    <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className={cn(
                                "cursor-pointer transition-all border-2",
                                selectedGoal === goal.title ? "border-electric-aqua bg-electric-aqua/10" : "hover:border-electric-aqua/50"
                            )}
                            onClick={() => handleSelect(goal.title)}
                        >
                            <CardContent className="p-6 text-left">
                                <h3 className="font-semibold">{goal.title}</h3>
                                <p className="text-sm text-void-black/70">{goal.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Button size="lg" onClick={onNext} disabled={!selectedGoal}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}
