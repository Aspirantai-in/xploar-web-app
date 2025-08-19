'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { UPSC_FOUNDATION } from '@/lib/data/topics';

export function Recommendations() {
    const { recommendations, fetchAIRecommendations, markRecommendationAsDone, runAdaptivePlannerAnalysis } = useAppStore();

    useEffect(() => {
        runAdaptivePlannerAnalysis();
        fetchAIRecommendations();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">AI-Powered Recommendations</h1>
                <p className="text-void-black/70">
                    Personalized insights and suggestions to optimize your study plan based on your performance.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Your Action Plan</CardTitle>
                        <CardDescription>
                            Here are some suggestions from our AI engine to boost your scores.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recommendations.length === 0 && (
                            <div className="text-center py-8 text-void-black/50">
                                <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">No recommendations yet.</p>
                                <p className="text-xs">Complete some mock tests to get personalized insights.</p>
                            </div>
                        )}
                        {recommendations.map((rec, index) => (
                            <motion.div
                                key={rec.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`p-4 rounded-lg flex items-center justify-between ${rec.isCompleted ? 'bg-green-50' : 'bg-electric-aqua/10'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Lightbulb className={`h-5 w-5 ${rec.isCompleted ? 'text-green-500' : 'text-electric-aqua'}`} />
                                    <div>
                                        <p className={`font-medium ${rec.isCompleted ? 'line-through text-gray-500' : ''}`}>
                                            {rec.type === 'revise_topic' && `Revise: ${UPSC_FOUNDATION.find(t => t.id === rec.relatedTopicId)?.name}`}
                                        </p>
                                        <p className="text-sm text-void-black/70">{rec.reasoning}</p>
                                    </div>
                                </div>
                                {!rec.isCompleted && (
                                    <Button size="sm" onClick={() => markRecommendationAsDone(rec.id)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as Done
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
