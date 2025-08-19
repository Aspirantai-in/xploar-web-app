'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface TimeScreenProps {
    onNext: () => void;
}

const hoursOptions = [2, 4, 6, 8];

export function TimeScreen({ onNext }: TimeScreenProps) {
    const { updateStudyConfig, studyConfiguration } = useAppStore();
    const [hoursPerDay, setHoursPerDay] = useState(studyConfiguration.hoursPerDay);

    const handleSelect = (hours: number) => {
        setHoursPerDay(hours);
        updateStudyConfig({ hoursPerDay: hours });
    };

    return (
        <div className="max-w-2xl text-center">
            <Clock className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-void-black mb-2">How much time can you commit daily?</h1>
            <p className="text-void-black/70 mb-8">Consistency is key. Be realistic with your daily goal.</p>

            <div className="grid grid-cols-4 gap-4 mb-8">
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
                            onClick={() => handleSelect(hours)}
                        >
                            <CardContent className="p-6">
                                <h3 className="font-bold text-2xl">{hours}</h3>
                                <p className="text-sm text-void-black/70">hours</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Button size="lg" onClick={onNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}
