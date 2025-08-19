'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, BarChart2, FileText, BookOpen, Target, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { WeeklyReport } from './WeeklyReport';
import { AIRecommendation } from '@/lib/types';
import { SAMPLE_CURATED_RESOURCES } from '@/lib/data/extended-data';

// A new, more detailed component for displaying a single recommendation
function RecommendationCard({ recommendation }: { recommendation: AIRecommendation }) {
    const { markRecommendationAsDone, navigateTo } = useAppStore();

    // Icons for different recommendation types
    const ICONS = {
        revise_topic: <BookOpen className="h-5 w-5 text-electric-aqua" />,
        attempt_mock: <Target className="h-5 w-5 text-electric-aqua" />,
        read_article: <BookOpen className="h-5 w-5 text-electric-aqua" />,
        watch_video: <Video className="h-5 w-5 text-electric-aqua" />,
    };

    // Dynamic titles for different recommendation types
    const TITLES = {
        revise_topic: `Revise: ${UPSC_FOUNDATION.find(t => t.id === recommendation.relatedTopicId)?.name}`,
        attempt_mock: `Practice Mock: ${UPSC_FOUNDATION.find(t => t.id === recommendation.relatedTopicId)?.name}`,
        read_article: `Read: ${SAMPLE_CURATED_RESOURCES.find(r => r.id === recommendation.relatedResourceId)?.title}`,
        watch_video: `Watch: ${SAMPLE_CURATED_RESOURCES.find(r => r.id === recommendation.relatedResourceId)?.title}`,
    };

    // Handle the primary action for a recommendation
    const handleActionClick = () => {
        // This simulates navigation or opening a resource
        switch (recommendation.type) {
            case 'attempt_mock':
                alert(`Navigating to mock test for ${UPSC_FOUNDATION.find(t => t.id === recommendation.relatedTopicId)?.name}...`);
                // In a real app, you might call a navigation function from the store here
                break;
            case 'read_article':
            case 'watch_video':
                const resource = SAMPLE_CURATED_RESOURCES.find(r => r.id === recommendation.relatedResourceId);
                if (resource) {
                    window.open(resource.url, '_blank');
                }
                break;
            default:
                alert('This action will take you to the relevant study material.');
        }
        markRecommendationAsDone(recommendation.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg flex items-center justify-between border ${recommendation.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}
        >
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-electric-aqua/10 rounded-full">
                    {ICONS[recommendation.type] || <Lightbulb className="h-5 w-5 text-electric-aqua" />}
                </div>
                <div>
                    <p className={`font-medium ${recommendation.isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {TITLES[recommendation.type] || 'AI Recommendation'}
                    </p>
                    <p className="text-sm text-void-black/70">{recommendation.reasoning}</p>
                </div>
            </div>
            {!recommendation.isCompleted && (
                <Button size="sm" onClick={handleActionClick}>
                    Take Action
                </Button>
            )}
        </motion.div>
    );
}


// The fully developed AiActionPlan component
function AiActionPlan() {
    const { recommendations, fetchAIRecommendations, runAdaptivePlannerAnalysis } = useAppStore();

    useEffect(() => {
        runAdaptivePlannerAnalysis();
        fetchAIRecommendations();
    }, [runAdaptivePlannerAnalysis, fetchAIRecommendations]);

    const activeRecommendations = recommendations.filter(r => !r.isCompleted);
    const completedRecommendations = recommendations.filter(r => r.isCompleted);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Evaluation Summary</CardTitle>
                    <CardDescription>
                        Based on your recent performance, our AI has identified key areas for improvement.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">
                        Focusing on these recommendations can help you boost your scores and strengthen your preparation. You have <strong>{activeRecommendations.length}</strong> active recommendations.
                    </p>
                </CardContent>
            </Card>

            {/* Active Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Action Plan</CardTitle>
                    <CardDescription>
                        Complete these tasks to improve your performance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activeRecommendations.length === 0 && (
                        <div className="text-center py-8 text-void-black/50">
                            <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">No active recommendations.</p>
                            <p className="text-xs">Great job! Keep taking mock tests to get new insights.</p>
                        </div>
                    )}
                    {activeRecommendations.map((rec) => (
                        <RecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                </CardContent>
            </Card>

            {/* Completed Recommendations */}
            {completedRecommendations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Completed Actions</CardTitle>
                        <CardDescription>
                            Well done on completing these tasks!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {completedRecommendations.map((rec) => (
                            <RecommendationCard key={rec.id} recommendation={rec} />
                        ))}
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
}


export function Recommendations() {
    const [activeTab, setActiveTab] = useState<'insights' | 'report'>('insights');

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">AI-Powered Insights</h1>
                <p className="text-void-black/70">
                    Personalized analytics and suggestions to optimize your study plan.
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
                            <Button variant={activeTab === 'insights' ? 'default' : 'ghost'} onClick={() => setActiveTab('insights')}>
                                <Lightbulb className="h-4 w-4 mr-2" /> AI Action Plan
                            </Button>
                            <Button variant={activeTab === 'report' ? 'default' : 'ghost'} onClick={() => setActiveTab('report')}>
                                <FileText className="h-4 w-4 mr-2" /> Weekly Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {activeTab === 'insights' ? <AiActionPlan /> : <WeeklyReport />}
        </div>
    );
}
