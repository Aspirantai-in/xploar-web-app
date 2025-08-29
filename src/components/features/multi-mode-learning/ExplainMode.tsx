'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RubricCard } from './RubricCard';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export function ExplainMode({ topicId: _topicId }: { topicId: string }) {
    const [explanation, setExplanation] = useState('');
    const [feedback, setFeedback] = useState<string[] | null>(null);

    const getAIFeedback = () => {
        // Simulated AI Feedback
        setFeedback([
            "Good starting point, clearly states the core idea.",
            "Could be strengthened by including a specific example or article number.",
            "The link between different points can be made more explicit.",
            "Consider adding a counter-argument for a more balanced view.",
            "Conclusion effectively summarizes the main points."
        ]);
    };

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Explain This Topic</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <textarea
                            className="w-full h-48 p-3 border rounded-lg"
                            placeholder="Explain the core concepts of this topic in your own words..."
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                        />
                        <Button onClick={getAIFeedback} disabled={!explanation}>Get AI Feedback</Button>
                        {feedback && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                                <h4 className="font-semibold flex items-center mb-2"><Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />AI Feedback</h4>
                                <ul className="space-y-2 list-disc list-inside text-sm p-4 bg-gray-50 rounded-lg">
                                    {feedback.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <RubricCard
                    title="Quality Bar for Explaining"
                    criteria={[
                        "Use simple and clear language.",
                        "Structure your answer with an intro, body, and conclusion.",
                        "Cover all key dimensions of the topic.",
                        "Provide a concise yet comprehensive summary."
                    ]}
                />
            </div>
        </div>
    );
}
