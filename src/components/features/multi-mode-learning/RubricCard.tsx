'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Check } from 'lucide-react';

interface RubricCardProps {
    title: string;
    criteria: string[];
}

export function RubricCard({ title, criteria }: RubricCardProps) {
    return (
        <Card className="bg-dark-blue/5 border-dark-blue/10">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {criteria.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <Check className="h-4 w-4 mt-1 text-electric-aqua flex-shrink-0" />
                            <span className="text-sm text-void-black/80">{item}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
