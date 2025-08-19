'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, PlusCircle } from 'lucide-react';
import { SAMPLE_FORUM_POSTS } from '@/lib/data/extended-data';
import { ForumPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ForumPostView } from './ForumPostView';

export function DiscussionForums() {
    const [posts] = useState<ForumPost[]>(SAMPLE_FORUM_POSTS);
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

    if (selectedPost) {
        return <ForumPostView post={selectedPost} onBack={() => setSelectedPost(null)} />;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Discussion Forums</CardTitle>
                    <CardDescription>Ask questions, share knowledge, and learn from the community.</CardDescription>
                </div>
                <Button>
                    <PlusCircle className="h-4 w-4 mr-2" /> New Post
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPost(post)}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <MessageSquare className="h-6 w-6 text-electric-aqua" />
                                    <div>
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <p className="text-sm text-void-black/70">
                                            by User {post.authorId.slice(-3)} • {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost">View</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
