'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RubricCard } from './RubricCard';

export function WatchMode({ topicId }: { topicId: string }) {
    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Explainer Video</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">(Video player for {topicId})</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <RubricCard
                    title="Quality Bar for Watching"
                    criteria={[
                        "Focus on the core concepts explained.",
                        "Note down key arguments and examples.",
                        "Pause and reflect on complex parts.",
                        "Connect the visual information to your notes."
                    ]}
                />
            </div>
        </div>
    );
}
