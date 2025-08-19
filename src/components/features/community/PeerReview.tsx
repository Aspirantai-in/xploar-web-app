'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Upload, ChevronLeft, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnswerSubmission } from '@/lib/types';
import { useAppStore } from '@/lib/store';

// Dummy submission for the review process to simulate fetching a peer's answer.
const dummySubmission: AnswerSubmission = {
    id: "sub_001",
    authorId: "user_peer_001",
    questionText: "Discuss the role of the Governor in the Indian political system. Is the office a mere relic of the colonial past or a constitutional necessity?",
    answerText: "The role of the Governor in the Indian political system is multifaceted and has often been a subject of debate. Appointed by the President, the Governor acts as the constitutional head of the state executive and as a vital link between the Union and the State governments. Key functions include appointing the Chief Minister, dissolving the State Legislative Assembly, and giving assent to bills.\n\nHowever, the discretionary powers of the Governor, particularly in recommending President's rule under Article 356, have been controversial. Critics argue that the office is sometimes used by the central government to undermine state governments, making it seem like a colonial relic.\n\nOn the other hand, proponents argue that the Governor is a constitutional necessity for upholding the Constitution and ensuring the smooth functioning of the state administration, especially in times of political instability. The Sarkaria and Punchhi Commission reports have suggested reforms to make the office more independent and effective.",
    submittedAt: new Date().toISOString(),
    topicId: "polity_fr",
    status: "pending_review",
};


export function PeerReview() {
    const [view, setView] = useState<'main' | 'submit' | 'review'>('main');
    const { submitAnswerForReview, submitPeerReview } = useAppStore();

    // State for the submission form
    const [questionText, setQuestionText] = useState('');
    const [answerText, setAnswerText] = useState('');

    // State for the review form
    const [feedback, setFeedback] = useState('');
    const [rubricScores, setRubricScores] = useState({
        structure: 3,
        contentClarity: 3,
        relevance: 3,
    });

    const handleSubmitForReview = () => {
        if (!questionText || !answerText) return;
        // In a real app, you'd use the actual current user's ID
        const submission = {
            authorId: 'user_current_001',
            questionText,
            answerText,
            topicId: 'polity_fr' // Placeholder topic
        };
        submitAnswerForReview(submission);
        // Reset form and go back to main view
        alert("Your answer has been submitted for review!"); // Placeholder for toast notification
        setQuestionText('');
        setAnswerText('');
        setView('main');
    };

    const handlePeerReviewSubmit = () => {
        if (!feedback) return;
        const review = {
            submissionId: dummySubmission.id,
            reviewerId: 'user_current_001', // Placeholder for current user
            feedback,
            rubricScores
        };
        submitPeerReview(review);
        // Reset form and go back
        alert("Your feedback has been submitted. Thank you for contributing!"); // Placeholder for toast notification
        setFeedback('');
        setRubricScores({ structure: 3, contentClarity: 3, relevance: 3 });
        setView('main');
    };

    // View for submitting an answer
    if (view === 'submit') {
        return (
            <div>
                <Button variant="outline" onClick={() => setView('main')} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Peer Review
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Your Answer for Review</CardTitle>
                        <CardDescription>Provide the question and your answer below. Other students will provide feedback.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Question</label>
                            <Input
                                placeholder="Enter the question you answered"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your Answer</label>
                            <textarea
                                className="w-full h-48 p-3 border border-dark-blue/20 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-dark-blue bg-ice-white text-sm"
                                placeholder="Type or paste your answer here..."
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleSubmitForReview} disabled={!questionText || !answerText}>
                            <Send className="h-4 w-4 mr-2" /> Submit for Peer Review
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // View for reviewing a peer's answer
    if (view === 'review') {
        return (
            <div>
                <Button variant="outline" onClick={() => setView('main')} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Peer Review
                </Button>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Review Peer's Answer</CardTitle>
                                <CardDescription>{dummySubmission.questionText}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap p-4 bg-gray-50 rounded-md border">{dummySubmission.answerText}</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Feedback</CardTitle>
                                <CardDescription>Score the answer based on the rubric.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(rubricScores).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <label className="text-sm font-medium capitalize flex justify-between">
                                            <span>{key.replace('contentClarity', 'Content Clarity')}</span>
                                            <span className="font-bold text-electric-aqua">{value}/5</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={value}
                                            onChange={(e) => setRubricScores(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Overall Feedback</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-dark-blue/20 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-dark-blue bg-ice-white text-sm"
                                        placeholder="Provide constructive feedback..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full" onClick={handlePeerReviewSubmit} disabled={!feedback}>
                                    <Send className="h-4 w-4 mr-2" /> Submit Review
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Main View
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Submit an Answer */}
            <Card>
                <CardHeader>
                    <CardTitle>Submit for Review</CardTitle>
                    <CardDescription>Get feedback on your answers from the community.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Upload className="h-12 w-12 mx-auto text-electric-aqua mb-4" />
                    <p className="text-sm text-void-black/70 mb-4">Upload your written answer or type it in to get valuable feedback on structure, clarity, and relevance.</p>
                    <Button onClick={() => setView('submit')}>Submit an Answer</Button>
                </CardContent>
            </Card>

            {/* Review an Answer */}
            <Card>
                <CardHeader>
                    <CardTitle>Review a Peer's Answer</CardTitle>
                    <CardDescription>Help others by providing constructive feedback.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Edit className="h-12 w-12 mx-auto text-electric-aqua mb-4" />
                    <p className="text-sm text-void-black/70 mb-4">Review a randomly assigned answer from a fellow aspirant. Your feedback helps them improve.</p>
                    <Button onClick={() => setView('review')}>Start Reviewing</Button>
                </CardContent>
            </Card>
        </div>
    );
}
