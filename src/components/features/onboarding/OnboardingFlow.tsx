'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

// Import the new components
import { AuthScreen } from './AuthScreen';
import { OnboardingWelcome } from './OnboardingWelcome';
import { GoalScreen } from './GoalScreen';
import { TimeScreen } from './TimeScreen';
import { BaselineScreen } from './BaselineScreen';
import { GeneratingPlanScreen } from './GeneratingPlanScreen';

type OnboardingStep = 'auth' | 'welcome' | 'goal' | 'time' | 'baseline' | 'generating';

export function OnboardingFlow() {
    const { currentUser, studyPlan, generateStudyPlan } = useAppStore();
    const [step, setStep] = useState<OnboardingStep>('auth');

    useEffect(() => {
        // Logic to determine the starting step based on user state
        if (!currentUser) {
            setStep('auth');
        } else if (studyPlan.length === 0) {
            setStep('welcome');
        }
    }, [currentUser, studyPlan]);

    const nextStep = (currentStep: OnboardingStep) => {
        const steps: OnboardingStep[] = ['auth', 'welcome', 'goal', 'time', 'baseline', 'generating'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setStep(steps[currentIndex + 1]);
        }
    };

    const handlePlanGeneration = () => {
        generateStudyPlan();
        // The Zustand store will automatically navigate to the study planner
    };

    const renderStep = () => {
        switch (step) {
            case 'auth':
                return <AuthScreen onAuthSuccess={() => nextStep('auth')} />;
            case 'welcome':
                return <OnboardingWelcome onNext={() => nextStep('welcome')} />;
            case 'goal':
                return <GoalScreen onNext={() => nextStep('goal')} />;
            case 'time':
                return <TimeScreen onNext={() => nextStep('time')} />;
            case 'baseline':
                return <BaselineScreen onNext={() => nextStep('baseline')} />;
            case 'generating':
                return <GeneratingPlanScreen onComplete={handlePlanGeneration} />;
            default:
                return <AuthScreen onAuthSuccess={() => nextStep('auth')} />;
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-grid-pattern">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Add this CSS to globals.css for the background pattern
/*

*/
