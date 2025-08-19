'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronDown, Book, Target, AlertTriangle, Lightbulb, Layers } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UPSC_SYLLABUS, SyllabusSubTopic } from '@/lib/data/syllabus';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FEATURES } from '@/lib/utils/constants';

// Helper to calculate progress
const calculateProgress = (ids: string[], studyPlan: { tasks: { topicId: string; isDone: boolean }[] }[]) => {
    const relevantTasks = studyPlan.flatMap(day => day.tasks).filter(task => ids.includes(task.topicId));
    if (relevantTasks.length === 0) return 0;
    const completedTasks = relevantTasks.filter(task => task.isDone).length;
    return (completedTasks / relevantTasks.length) * 100;
};

// Component for the WWW Matrix
const WwwMatrix = ({ topic }: { topic: (SyllabusSubTopic & { progress: number }) | null }) => {
    const { navigateTo } = useAppStore();

    const getWeightClass = (weight: string) => {
        switch (weight) {
            case 'High': return 'bg-red-100 text-red-700';
            case 'Medium': return 'bg-yellow-100 text-yellow-700';
            case 'Low': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (!topic) {
        return (
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" />All Topics Covered</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Great job! You've made progress in all planned topics. Keep revising or add new topics to your study plan.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />AI Focus Area</CardTitle>
                <CardDescription>Our AI has identified this as your weakest area. Focus here to see the biggest improvement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="font-bold text-lg">{topic.name}</h3>
                <div>
                    <h4 className="font-semibold text-sm mb-1">Weight (Importance)</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getWeightClass(topic.weight)}`}>{topic.weight}</span>
                </div>
                <div>
                    <h4 className="font-semibold text-sm mb-1">Why it's Important</h4>
                    <p className="text-sm text-void-black/80">{topic.why}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm mb-1 flex items-center"><Lightbulb className="h-4 w-4 mr-1 text-electric-aqua" />What to do Next</h4>
                    <p className="text-sm text-void-black/80 mb-3">Focus on a multi-mode learning loop to build a strong foundation in this area.</p>
                    <Button className="w-full" onClick={() => navigateTo(FEATURES.MULTI_MODE_LEARNING)}>
                        <Layers className="h-4 w-4 mr-2" /> Start Learning Session
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export function SyllabusMap() {
    const { studyPlan, navigateTo } = useAppStore();
    const [expandedPaper, setExpandedPaper] = useState<string | null>("Prelims GS-I");

    const { papers, weakestTopic } = useMemo(() => {
        const allSubTopics: (SyllabusSubTopic & { progress: number })[] = [];

        const papers = Object.entries(UPSC_SYLLABUS).map(([paperKey, paperData]) => {
            const topics = paperData.topics.map(topic => {
                const subTopics = topic.subTopics.map(subTopic => {
                    const progress = calculateProgress([subTopic.id], studyPlan);
                    const subTopicWithProgress = { ...subTopic, progress };
                    // Only add sub-topics to the weakness detection pool
                    if (subTopic.weight) {
                        allSubTopics.push(subTopicWithProgress);
                    }
                    return subTopicWithProgress;
                });

                // CORRECTED LOGIC: If a topic has no sub-topics, calculate its progress based on its own ID.
                const topicProgress = subTopics.length > 0
                    ? subTopics.reduce((acc, st) => acc + st.progress, 0) / subTopics.length
                    : calculateProgress([topic.id], studyPlan);

                return { ...topic, subTopics, progress: topicProgress };
            });
            const paperProgress = topics.length > 0 ? topics.reduce((acc, t) => acc + t.progress, 0) / topics.length : 0;
            return { key: paperKey, name: paperData.name, topics, progress: paperProgress };
        });

        // Weakness Detection Logic
        const incompleteTopics = allSubTopics.filter(t => t.progress < 100);
        const weakestTopic = incompleteTopics.length > 0
            ? incompleteTopics.reduce((min, current) => min.progress < current.progress ? min : current)
            : null;

        return { papers, weakestTopic };
    }, [studyPlan]);

    const getMasteryLevel = (progress: number) => {
        if (progress === 100) return { level: "Mastered", color: "text-green-600" };
        if (progress > 60) return { level: "Advanced", color: "text-blue-600" };
        if (progress > 20) return { level: "Intermediate", color: "text-yellow-600" };
        return { level: "Beginner", color: "text-red-600" };
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-void-black mb-2">Syllabus Command Center</h1>
                <p className="text-void-black/70">
                    Track your syllabus coverage and get AI-driven insights on where to focus next.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Syllabus Grid */}
                <div className="lg:col-span-2 space-y-4">
                    {papers.map((paper) => (
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
                                                <div className="space-y-2 ml-6 mt-2">
                                                    {topic.subTopics.map(subTopic => (
                                                        <div key={subTopic.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                                                            <div className="flex items-center">
                                                                <CheckCircle className={`h-5 w-5 mr-3 ${subTopic.progress === 100 ? 'text-green-500' : 'text-gray-300'}`} />
                                                                <span>{subTopic.name}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Progress value={subTopic.progress} className="w-24 h-2" />
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

                {/* Right Column: WWW Matrix */}
                <div className="lg:col-span-1">
                    <WwwMatrix topic={weakestTopic} />
                </div>
            </div>
        </div>
    );
}
