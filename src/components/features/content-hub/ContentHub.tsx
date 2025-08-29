'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Book, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CurrentAffairs } from './CurrentAffairs';
import { DigitalLibrary } from './DigitalLibrary';
import { Flashcards } from './Flashcards';

type ActiveTab = 'current-affairs' | 'library' | 'flashcards';

export function ContentHub() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('current-affairs');

    const renderContent = () => {
        switch (activeTab) {
            case 'current-affairs':
                return <CurrentAffairs />;
            case 'library':
                return <DigitalLibrary />;
            case 'flashcards':
                return <Flashcards />;
            default:
                return <CurrentAffairs />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">Content & Resource Hub</h1>
                <p className="text-void-black/70">
                    Your central knowledge base for current affairs, digital library, and smart flashcards.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <Card>
                    <CardContent className="p-4">
                        <div className="flex space-x-2">
                            <Button variant={activeTab === 'current-affairs' ? 'default' : 'ghost'} onClick={() => setActiveTab('current-affairs')}>
                                <Newspaper className="h-4 w-4 mr-2" /> Current Affairs
                            </Button>
                            <Button variant={activeTab === 'library' ? 'default' : 'ghost'} onClick={() => setActiveTab('library')}>
                                <Book className="h-4 w-4 mr-2" /> Digital Library
                            </Button>
                            <Button variant={activeTab === 'flashcards' ? 'default' : 'ghost'} onClick={() => setActiveTab('flashcards')}>
                                <BrainCircuit className="h-4 w-4 mr-2" /> Flashcards
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
}
