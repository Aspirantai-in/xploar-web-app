'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './WelcomeScreen';
import { StudyConfigForm } from './StudyConfigForm';
import { useAppStore } from '@/lib/store';

export function OnboardingFlow() {
    const { currentUser } = useAppStore();
    const [step, setStep] = useState<'welcome' | 'config'>(!currentUser ? 'welcome' : 'config');

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {step === 'welcome' && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <WelcomeScreen onNext={() => setStep('config')} />
                    </motion.div>
                )}

                {step === 'config' && (
                    <motion.div
                        key="config"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                    >
                        <StudyConfigForm />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
