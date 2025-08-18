'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface ResponseInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isLastQuestion: boolean;
}

export function ResponseInput({ value, onChange, onSubmit, isLastQuestion }: ResponseInputProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Response</CardTitle>
                <CardDescription>
                    Take your time to structure your answer. Aim for 2-3 minutes speaking time.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <textarea
                    className="w-full h-32 p-3 border border-dark-blue/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-dark-blue"
                    placeholder="Type your response here..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />

                <div className="flex justify-between items-center">
                    <p className="text-sm text-void-black/70">
                        Word count: {value.split(' ').filter(word => word.length > 0).length}
                    </p>

                    <Button
                        variant="gradient"
                        onClick={onSubmit}
                        disabled={!value.trim()}
                    >
                        {isLastQuestion ? (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete Interview
                            </>
                        ) : (
                            <>
                                Next Question
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}