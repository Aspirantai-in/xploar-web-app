'use client';
import { motion } from 'framer-motion';
import { Hand, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

interface OnboardingWelcomeProps {
    onNext: () => void;
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
    const { currentUser } = useAppStore();

    return (
        <div className="text-center max-w-lg">
            <motion.div
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mb-6"
            >
                <Hand className="h-16 w-16 text-yellow-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-void-black mb-4">
                Welcome, {currentUser?.name}!
            </h1>
            <p className="text-lg text-void-black/70 mb-8">
                We're excited to have you. Let's spend a minute to set up your personalized study plan for success.
            </p>
            <Button size="xl" onClick={onNext}>
                Let's Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
    );
}
