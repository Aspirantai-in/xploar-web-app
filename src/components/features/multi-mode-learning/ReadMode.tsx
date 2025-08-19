'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RubricCard } from './RubricCard';

export function ReadMode({ topicId }: { topicId: string }) {
    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Reading Material</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-gray-500 py-16">
                            (Placeholder for notes or PDF viewer related to {topicId})
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <RubricCard
                    title="Quality Bar for Reading"
                    criteria={[
                        "Identify key articles, dates, and personalities.",
                        "Understand the 'why' behind the facts.",
                        "Connect the topic to the broader syllabus.",
                        "Formulate potential questions as you read."
                    ]}
                />
            </div>
        </div>
    );
}
