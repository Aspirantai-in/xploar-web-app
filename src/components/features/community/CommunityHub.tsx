'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Edit, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DiscussionForums } from './DiscussionForums';
import { PeerReview } from './PeerReview';
import { StudyGroups } from './StudyGroups';

type ActiveTab = 'forums' | 'groups' | 'reviews';

export function CommunityHub() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('forums');

    const renderContent = () => {
        switch (activeTab) {
            case 'forums':
                return <DiscussionForums />;
            case 'groups':
                return <StudyGroups />;
            case 'reviews':
                return <PeerReview />;
            default:
                return <DiscussionForums />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">Community & Collaboration</h1>
                <p className="text-void-black/70">
                    Engage with peers, form study groups, and get your answers reviewed.
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
                            <Button variant={activeTab === 'forums' ? 'default' : 'ghost'} onClick={() => setActiveTab('forums')}>
                                <MessageSquare className="h-4 w-4 mr-2" /> Discussion Forums
                            </Button>
                            <Button variant={activeTab === 'groups' ? 'default' : 'ghost'} onClick={() => setActiveTab('groups')}>
                                <Users className="h-4 w-4 mr-2" /> Study Groups
                            </Button>
                            <Button variant={activeTab === 'reviews' ? 'default' : 'ghost'} onClick={() => setActiveTab('reviews')}>
                                <Edit className="h-4 w-4 mr-2" /> Peer Review
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
