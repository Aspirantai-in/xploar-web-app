'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, CheckCircle, ChevronDown, Book, Target, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UPSC_SYLLABUS } from '@/lib/data/syllabus';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FEATURES } from '@/lib/utils/constants';

// Helper to calculate progress
const calculateProgress = (ids: string[], studyPlan: any[]) => {
    const relevantTasks = studyPlan.flatMap(day => day.tasks).filter(task => ids.includes(task.topicId));
    if (relevantTasks.length === 0) return 0;
    const completedTasks = relevantTasks.filter(task => task.isDone).length;
    return (completedTasks / relevantTasks.length) * 100;
};

export function SyllabusMap() {
    const { studyPlan, navigateTo } = useAppStore();
    const [expandedPaper, setExpandedPaper] = useState<string | null>("Prelims GS-I");

    const syllabusProgress = useMemo(() => {
        const papers = Object.entries(UPSC_SYLLABUS).map(([paperKey, paperData]) => {
            const topics = paperData.topics.map(topic => {
                const subTopicIds = topic.subTopics.map(st => st.id);
                const subTopics = topic.subTopics.map(subTopic => ({
                    ...subTopic,
                    progress: calculateProgress([subTopic.id], studyPlan)
                }));
                // If a topic has no sub-topics, its progress is based on its own ID
                const topicProgress = subTopics.length > 0
                    ? subTopics.reduce((acc, st) => acc + st.progress, 0) / subTopics.length
                    : calculateProgress([topic.id], studyPlan);
                return { ...topic, subTopics, progress: topicProgress };
            });
            const paperProgress = topics.length > 0 ? topics.reduce((acc, t) => acc + t.progress, 0) / topics.length : 0;
            return { key: paperKey, name: paperData.name, topics, progress: paperProgress };
        });

        const prelimsProgress = papers.filter(p => p.key.startsWith("Prelims")).reduce((acc, p) => acc + p.progress, 0) / 2;
        const mainsProgress = papers.filter(p => p.key.startsWith("Mains")).reduce((acc, p) => acc + p.progress, 0) / 4;

        return { papers, prelimsProgress, mainsProgress };
    }, [studyPlan]);

    const getMasteryLevel = (progress: number) => {
        if (progress === 100) return { level: "Mastered", color: "text-green-600" };
        if (progress > 60) return { level: "Advanced", color: "text-blue-600" };
        if (progress > 20) return { level: "Intermediate", color: "text-yellow-600" };
        return { level: "Beginner", color: "text-red-600" };
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">Syllabus Progression Map</h1>
                <p className="text-void-black/70">
                    An interactive guide to your UPSC preparation journey. Track your coverage, access resources, and master every topic.
                </p>
            </motion.div>

            {/* Overall Progress Summary */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-electric-aqua" />Overall Preparation Status</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold">Prelims</span>
                                <span className="font-bold text-lg text-dark-blue">{syllabusProgress.prelimsProgress.toFixed(0)}%</span>
                            </div>
                            <Progress value={syllabusProgress.prelimsProgress} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold">Mains</span>
                                <span className="font-bold text-lg text-dark-blue">{syllabusProgress.mainsProgress.toFixed(0)}%</span>
                            </div>
                            <Progress value={syllabusProgress.mainsProgress} />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="space-y-4">
                {syllabusProgress.papers.map((paper) => (
                    <Card key={paper.name}>
                        <CardHeader className="cursor-pointer" onClick={() => setExpandedPaper(expandedPaper === paper.name ? null : paper.name)}>
                            <div className="flex justify-between items-center">
                                <CardTitle>{paper.name}</CardTitle>
                                <ChevronDown className={cn("transition-transform", expandedPaper === paper.name && "rotate-180")} />
                            </div>
                            <Progress value={paper.progress} />
                            <CardDescription>Overall Progress: {paper.progress.toFixed(0)}%</CardDescription>
                        </CardHeader>
                        {expandedPaper === paper.name && (
                            <CardContent>
                                {paper.topics.map(topic => (
                                    <div key={topic.id} className="ml-4 my-4 p-4 border-l-2 border-electric-aqua/50 rounded-r-lg bg-ice-white">
                                        <h3 className="font-semibold text-lg">{topic.name}</h3>
                                        <div className="flex items-center space-x-2 my-2">
                                            <Progress value={topic.progress} className="w-1/2" />
                                            <span className={`text-sm font-medium ${getMasteryLevel(topic.progress).color}`}>
                                                {getMasteryLevel(topic.progress).level} ({topic.progress.toFixed(0)}%)
                                            </span>
                                        </div>
                                        {topic.subTopics.length > 0 ? (
                                            <div className="space-y-2 ml-6">
                                                {topic.subTopics.map(subTopic => (
                                                    <div key={subTopic.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                                                        <div className="flex items-center">
                                                            <CheckCircle className={`h-5 w-5 mr-3 ${subTopic.progress === 100 ? 'text-green-500' : 'text-gray-300'}`} />
                                                            <span>{subTopic.name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <span className="text-xs text-gray-500 w-12 text-right">{subTopic.progress.toFixed(0)}%</span>
                                                            <Button variant="ghost" size="sm" title="Go to Resources" onClick={() => navigateTo(FEATURES.CONTENT_HUB)}><Book className="h-4 w-4" /></Button>
                                                            <Button variant="ghost" size="sm" title="Practice MCQs" onClick={() => navigateTo(FEATURES.MOCK_TESTS)}><Target className="h-4 w-4" /></Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2 ml-6 mt-4">
                                                <Button variant="outline" size="sm" onClick={() => navigateTo(FEATURES.CONTENT_HUB)}><Book className="h-4 w-4 mr-2" />Study Material</Button>
                                                <Button variant="outline" size="sm" onClick={() => navigateTo(FEATURES.MOCK_TESTS)}><Target className="h-4 w-4 mr-2" />Practice</Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
