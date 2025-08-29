'use client';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar } from 'lucide-react';
import { CurrentAffairsArticle } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/dateUtils';

interface ArticleViewProps {
    article: CurrentAffairsArticle;
    onBack: () => void;
}

export function ArticleView({ article, onBack }: ArticleViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Button variant="outline" onClick={onBack} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Articles
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 pt-2">
                        <span>Source: {article.source}</span>
                        <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.publicationDate)}</span>
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none">
                        <p className="lead font-semibold">{article.summary}</p>
                        <p>{article.content}</p>
                        {/* In a real application, this would render Markdown or HTML */}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
