'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SetupScreen } from './SetupScreen';
import { WritingScreen } from './WritingScreen';
import { ResultsScreen } from './ResultsScreen';

export type EvaluationView = 'setup' | 'writing' | 'results';
export type EssayGenre = 'Polity' | 'Economy' | 'History' | 'Ethics';

export function AIEvaluation() {
    const [view, setView] = useState<EvaluationView>('setup');
    const [genre, setGenre] = useState<EssayGenre | null>(null);
    const [question, setQuestion] = useState('');
    const [essay, setEssay] = useState('');

    const handleStart = (selectedGenre: EssayGenre, generatedQuestion: string) => {
        setGenre(selectedGenre);
        setQuestion(generatedQuestion);
        setView('writing');
    };

    const handleSubmit = (submittedEssay: string) => {
        setEssay(submittedEssay);
        setView('results');
    };

    const handleRestart = () => {
        setGenre(null);
        setQuestion('');
        setEssay('');
        setView('setup');
    };

    const renderView = () => {
        switch (view) {
            case 'setup':
                return <SetupScreen onStart={handleStart} />;
            case 'writing':
                return <WritingScreen genre={genre!} question={question} onSubmit={handleSubmit} />;
            case 'results':
                return <ResultsScreen genre={genre!} question={question} essay={essay} onRestart={handleRestart} />;
            default:
                return <SetupScreen onStart={handleStart} />;
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                    {renderView()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
