'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface GoalScreenProps {
    onNext: () => void;
    // New props for external data control
    externalData?: {
        goal?: string;
    };
    onGoalSelect?: (goal: string) => void;
}

const goals = [
    { id: 'prelims_2025', title: 'UPSC Prelims 2025', desc: 'Focused preparation for the Preliminary exam.' },
    { id: 'mains_2025', title: 'UPSC Mains 2025', desc: 'In-depth preparation for the Main exam.' },
    { id: 'foundation', title: 'Foundation Course', desc: 'Comprehensive syllabus coverage from scratch.' },
    { id: 'jee_main', title: 'JEE Main & Advanced', desc: 'Engineering entrance examination preparation.' },
    { id: 'neet', title: 'NEET (Medical Entrance)', desc: 'Medical entrance examination preparation.' },
    { id: 'cat', title: 'CAT (Management)', desc: 'Management entrance examination preparation.' },
    { id: 'gate', title: 'GATE (Engineering)', desc: 'Graduate aptitude test for engineering.' },
    { id: 'ssc_cgl', title: 'SSC CGL', desc: 'Staff Selection Commission Combined Graduate Level.' },
    { id: 'banking', title: 'Banking Exams', desc: 'Various banking sector examinations.' },
    { id: 'other', title: 'Other Competitive Exams', desc: 'Other government and private sector exams.' },
];

export function GoalScreen({ onNext, externalData, onGoalSelect }: GoalScreenProps) {
    const { updateStudyConfig } = useAppStore();
    const [selectedGoal, setSelectedGoal] = useState(externalData?.goal || '');
    const [customGoal, setCustomGoal] = useState('');

    // Sync with external data
    useEffect(() => {
        if (externalData?.goal) {
            setSelectedGoal(externalData.goal);
        }
    }, [externalData?.goal]);

    const handleSelect = (goalTitle: string) => {
        setSelectedGoal(goalTitle);

        // Update both local store and external callback
        updateStudyConfig({ goal: goalTitle });
        if (onGoalSelect) {
            onGoalSelect(goalTitle);
        }
    };

    const handleCustomGoal = (value: string) => {
        setCustomGoal(value);
        const finalGoal = value || selectedGoal;

        // Update both local store and external callback
        updateStudyConfig({ goal: finalGoal });
        if (onGoalSelect) {
            onGoalSelect(finalGoal);
        }
    };

    const isGoalSelected = selectedGoal || customGoal;

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
                                (selectedGoal === goal.title || (goal.id === 'other' && customGoal))
                                    ? "border-electric-aqua bg-electric-aqua/10"
                                    : "hover:border-electric-aqua/50"
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

            {/* Custom goal input for "Other" option */}
            {(selectedGoal === 'Other Competitive Exams' || selectedGoal === 'Other') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <label className="block text-sm font-medium text-void-black mb-2 text-left">
                        Please specify your goal
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your specific goal"
                        value={customGoal}
                        onChange={(e) => handleCustomGoal(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-electric-aqua focus:ring-electric-aqua/20"
                    />
                </motion.div>
            )}

            <Button size="lg" onClick={onNext} disabled={!isGoalSelected}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}
