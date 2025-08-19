'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, BookOpen, Video, Target, MessageSquare, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TopicID } from '@/lib/types';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { ReadMode } from './ReadMode';
import { WatchMode } from './WatchMode';
import { PracticeMode } from './PracticeMode';
import { ExplainMode } from './ExplainMode';
import { RecallMode } from './RecallMode';

type LearningMode = 'read' | 'watch' | 'practice' | 'explain' | 'recall';

const modes = [
    { id: 'read', label: 'Read', icon: BookOpen },
    { id: 'watch', label: 'Watch', icon: Video },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'explain', label: 'Explain', icon: MessageSquare },
    { id: 'recall', label: 'Recall', icon: RotateCcw },
];

export function MultiModeLearning() {
    const [selectedTopic, setSelectedTopic] = useState<TopicID | null>(null);
    const [activeMode, setActiveMode] = useState<LearningMode>('read');

    const renderContent = () => {
        if (!selectedTopic) {
            return (
                <div className="text-center py-16">
                    <Layers className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold">Select a topic to begin</h3>
                    <p className="text-gray-500">Choose a subject from the dropdown above to start your learning session.</p>
                </div>
            );
        }

        switch (activeMode) {
            case 'read': return <ReadMode topicId={selectedTopic} />;
            case 'watch': return <WatchMode topicId={selectedTopic} />;
            case 'practice': return <PracticeMode topicId={selectedTopic} />;
            case 'explain': return <ExplainMode topicId={selectedTopic} />;
            case 'recall': return <RecallMode topicId={selectedTopic} />;
            default: return null;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-void-black mb-2">Multi-Mode Learning Hub</h1>
                <p className="text-void-black/70">
                    Deepen your understanding by engaging with topics in multiple ways.
                </p>
            </motion.div>

            <Card className="mb-6">
                <CardContent className="p-4 flex items-center space-x-4">
                    <span className="font-semibold">Current Topic:</span>
                    <Select onValueChange={(value) => setSelectedTopic(value as TopicID)}>
                        <SelectTrigger className="w-[320px]">
                            <SelectValue placeholder="Select a topic to start..." />
                        </SelectTrigger>
                        <SelectContent>
                            {UPSC_FOUNDATION.map(topic => (
                                <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Modes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {modes.map(mode => (
                                <Button
                                    key={mode.id}
                                    variant={activeMode === mode.id ? 'default' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveMode(mode.id as LearningMode)}
                                >
                                    <mode.icon className="h-4 w-4 mr-3" />
                                    {mode.label}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeMode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
