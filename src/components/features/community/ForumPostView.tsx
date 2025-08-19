'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send } from 'lucide-react';
import { ForumPost, ForumReply } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';

interface ForumPostViewProps {
    post: ForumPost;
    onBack: () => void;
}

const DUMMY_REPLIES: ForumReply[] = [
    { postId: "post_001", authorId: "user_002", content: "Great question! The restrictions are primarily for sovereignty, integrity, security of the state, friendly relations with foreign states, public order, decency or morality, or in relation to contempt of court, defamation or incitement to an offence.", createdAt: "2025-08-18T11:00:00.000Z", isAcceptedAnswer: false },
    { postId: "post_001", authorId: "user_003", content: "Adding to that, it's a balance between individual freedom and societal interest.", createdAt: "2025-08-18T11:05:00.000Z", isAcceptedAnswer: false },
];

export function ForumPostView({ post, onBack }: ForumPostViewProps) {
    const { replyToForumPost } = useAppStore();
    const [replies, setReplies] = useState<ForumReply[]>(DUMMY_REPLIES.filter(r => r.postId === post.id));
    const [newReply, setNewReply] = useState('');

    const handleReplySubmit = () => {
        if (!newReply.trim()) return;

        const replyData = {
            postId: post.id,
            authorId: 'user_current_001', // Placeholder for current user
            content: newReply,
        };

        replyToForumPost(replyData);

        // Add to local state to simulate real-time update
        setReplies(prev => [...prev, {
            ...replyData,
            createdAt: new Date().toISOString(),
            isAcceptedAnswer: false
        }]);

        alert("Your reply has been posted!");
        setNewReply('');
    };


    return (
        <div>
            <Button variant="outline" onClick={onBack} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Forums
            </Button>

            {/* Original Post */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                        Posted by User {post.authorId.slice(-3)} on {new Date(post.createdAt).toLocaleString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{post.content}</p>
                </CardContent>
            </Card>

            {/* Replies */}
            <Card>
                <CardHeader>
                    <CardTitle>Replies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {replies.map((reply, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-electric-aqua/10 rounded-lg"
                        >
                            <p className="text-sm">{reply.content}</p>
                            <p className="text-xs text-void-black/60 mt-2">
                                Replied by User {reply.authorId.slice(-3)} • {new Date(reply.createdAt).toLocaleString()}
                            </p>
                        </motion.div>
                    ))}
                    {replies.length === 0 && (
                        <p className="text-sm text-center text-void-black/50 py-4">No replies yet. Be the first to respond!</p>
                    )}


                    {/* New Reply Input */}
                    <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Add Your Reply</h3>
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Write your reply..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit()}
                            />
                            <Button onClick={handleReplySubmit} disabled={!newReply.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
