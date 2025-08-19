'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, CheckCircle } from 'lucide-react';

interface GeneratingPlanScreenProps {
    onComplete: () => void;
}

const messages = [
    "Analyzing your goals...",
    "Structuring the UPSC syllabus...",
    "Allocating topics to your schedule...",
    "Building your daily tasks...",
    "Finalizing your personalized plan..."
];

export function GeneratingPlanScreen({ onComplete }: GeneratingPlanScreenProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prev => {
                if (prev < messages.length - 1) {
                    return prev + 1;
                }
                clearInterval(interval);
                setIsComplete(true);
                return prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isComplete) {
            setTimeout(() => {
                onComplete();
            }, 1200);
        }
    }, [isComplete, onComplete]);

    return (
        <div className="text-center max-w-lg">
            <motion.div
                className="mb-6"
                animate={!isComplete ? { rotate: 360 } : { scale: 1.2 }}
                transition={!isComplete ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
            >
                {isComplete ? (
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                ) : (
                    <Loader className="h-16 w-16 text-electric-aqua mx-auto" />
                )}
            </motion.div>
            <h1 className="text-3xl font-bold text-void-black mb-4">
                {isComplete ? "Plan Generated!" : "Crafting Your Plan"}
            </h1>
            <p className="text-lg text-void-black/70">
                {messages[currentMessageIndex]}
            </p>
        </div>
    );
}
