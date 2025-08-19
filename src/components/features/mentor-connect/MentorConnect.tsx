'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, } from '@/components/ui/card';
import { FindMentor } from './FindMentor';
import { Webinars } from './Webinars';

type ActiveTab = 'mentors' | 'webinars';

export function MentorConnect() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('mentors');

    const renderContent = () => {
        switch (activeTab) {
            case 'mentors':
                return <FindMentor />;
            case 'webinars':
                return <Webinars />;
            default:
                return <FindMentor />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">Mentor & Expert Connect</h1>
                <p className="text-void-black/70">
                    Book one-on-one sessions with toppers and attend expert-led webinars.
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
                            <Button variant={activeTab === 'mentors' ? 'default' : 'ghost'} onClick={() => setActiveTab('mentors')}>
                                <UserCheck className="h-4 w-4 mr-2" /> Find a Mentor
                            </Button>
                            <Button variant={activeTab === 'webinars' ? 'default' : 'ghost'} onClick={() => setActiveTab('webinars')}>
                                <Video className="h-4 w-4 mr-2" /> Webinars
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
