'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface TimeScreenProps {
    onNext: () => void;
    // New props for external data control
    externalData?: {
        targetHoursPerDay?: number;
        startDate?: string;
        difficultyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    };
    onDataUpdate?: (data: { targetHoursPerDay?: number; startDate?: string; difficultyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" }) => void;
}

const hoursOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const difficultyLevels = [
    { id: 'BEGINNER', title: 'Beginner', desc: 'Just starting my preparation journey' },
    { id: 'INTERMEDIATE', title: 'Intermediate', desc: 'Have covered basics, need structured approach' },
    { id: 'ADVANCED', title: 'Advanced', desc: 'Experienced, focused on revision and practice' },
    { id: 'EXPERT', title: 'Expert', desc: 'Master level, need advanced strategies' },
];

export function TimeScreen({ onNext, externalData, onDataUpdate }: TimeScreenProps) {
    const { updateStudyConfig, studyConfiguration } = useAppStore();
    const [hoursPerDay, setHoursPerDay] = useState(externalData?.targetHoursPerDay || studyConfiguration.hoursPerDay);
    const [startDate, setStartDate] = useState(externalData?.startDate || new Date().toISOString().split('T')[0]);
    const [difficultyLevel, setDifficultyLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">(
        (externalData?.difficultyLevel as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT") || 'INTERMEDIATE'
    );

    // Sync with external data
    useEffect(() => {
        if (externalData?.targetHoursPerDay) {
            setHoursPerDay(externalData.targetHoursPerDay);
        }
        if (externalData?.startDate) {
            setStartDate(externalData.startDate);
        }
        if (externalData?.difficultyLevel && ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].includes(externalData.difficultyLevel)) {
            setDifficultyLevel(externalData.difficultyLevel as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT");
        }
    }, [externalData]);

    const handleHoursSelect = (hours: number) => {
        setHoursPerDay(hours);
        updateStudyConfig({ hoursPerDay: hours });
        if (onDataUpdate) {
            onDataUpdate({ targetHoursPerDay: hours });
        }
    };

    const handleStartDateChange = (date: string) => {
        setStartDate(date);
        if (onDataUpdate) {
            onDataUpdate({ startDate: date });
        }
    };

    const handleDifficultySelect = (level: string) => {
        if (['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].includes(level)) {
            const typedLevel = level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
            setDifficultyLevel(typedLevel);
            if (onDataUpdate) {
                onDataUpdate({ difficultyLevel: typedLevel });
            }
        }
    };

    return (
        <div className="max-w-2xl text-center">
            <Clock className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-void-black mb-2">Study Schedule & Timeline</h1>
            <p className="text-void-black/70 mb-8">Set your study timeline and daily commitment.</p>

            {/* Start Date Selection */}
            <div className="mb-8 text-left">
                <label className="block text-sm font-medium text-void-black mb-2">
                    When do you want to start?
                </label>
                <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="flex-1 border-none outline-none text-void-black"
                    />
                </div>
            </div>

            {/* Daily Hours Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-void-black mb-4">
                    How many hours can you study per day?
                </label>
                <div className="grid grid-cols-5 gap-3">
                    {hoursOptions.map((hours, index) => (
                        <motion.div
                            key={hours}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all border-2 text-center",
                                    hoursPerDay === hours ? "border-electric-aqua bg-electric-aqua/10" : "hover:border-electric-aqua/50"
                                )}
                                onClick={() => handleHoursSelect(hours)}
                            >
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-xl">{hours}</h3>
                                    <p className="text-xs text-void-black/70">hours</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Difficulty Level Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-void-black mb-4">
                    What's your current preparation level?
                </label>
                <div className="space-y-3">
                    {difficultyLevels.map((level, index) => (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all border-2",
                                    difficultyLevel === level.id ? "border-electric-aqua bg-electric-aqua/10" : "hover:border-electric-aqua/50"
                                )}
                                onClick={() => handleDifficultySelect(level.id)}
                            >
                                <CardContent className="p-4 text-left">
                                    <h3 className="font-semibold">{level.title}</h3>
                                    <p className="text-sm text-void-black/70">{level.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Button size="lg" onClick={onNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}
