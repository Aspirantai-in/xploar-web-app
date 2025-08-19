'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, CheckSquare, Brain } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CurrentAffairsArticle, DailyQuiz, DailyQuizQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTodayString, formatDate } from '@/lib/utils/dateUtils';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArticleView } from './ArticleView';

export function CurrentAffairs() {
    const { fetchCurrentAffairs, fetchDailyQuiz } = useAppStore();
    const [articles, setArticles] = useState<CurrentAffairsArticle[]>([]);
    const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<CurrentAffairsArticle | null>(null);


    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const today = getTodayString();
            const [fetchedArticles, fetchedQuiz] = await Promise.all([
                fetchCurrentAffairs(today),
                fetchDailyQuiz(today)
            ]);
            setArticles(fetchedArticles);
            setQuiz(fetchedQuiz);
            setLoading(false);
        };
        loadData();
    }, [fetchCurrentAffairs, fetchDailyQuiz]);

    const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmitQuiz = () => {
        setShowQuizResults(true);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading Today's Affairs..." /></div>;
    }

    if (selectedArticle) {
        return <ArticleView article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
    }

    const quizScore = quiz ? Object.entries(selectedAnswers).reduce((score, [qIndex, ansIndex]) => {
        if (quiz.questions[parseInt(qIndex)].correctAnswerIndex === ansIndex) {
            return score + 1;
        }
        return score;
    }, 0) : 0;

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Articles Section */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Newspaper className="h-5 w-5 text-electric-aqua" />
                            <span>Today's Top Stories</span>
                        </CardTitle>
                        <CardDescription>{formatDate(getTodayString())}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{article.title}</CardTitle>
                                        <CardDescription className="flex items-center space-x-4 text-xs">
                                            <span>Source: {article.source}</span>
                                            <span className="flex items-center space-x-1"><Calendar className="h-3 w-3" /><span>{formatDate(article.publicationDate)}</span></span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-void-black/80">{article.summary}</p>
                                        <Button variant="link" className="p-0 h-auto mt-2" onClick={() => setSelectedArticle(article)}>Read More</Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Daily Quiz Section */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Brain className="h-5 w-5 text-electric-aqua" />
                            <span>Daily Quiz</span>
                        </CardTitle>
                        <CardDescription>Test your knowledge on today's news.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {quiz?.questions.map((q, index) => (
                            <div key={index} className="space-y-2">
                                <p className="text-sm font-medium">{index + 1}. {q.question}</p>
                                <div className="space-y-1">
                                    {q.options.map((opt, optIndex) => {
                                        const isSelected = selectedAnswers[index] === optIndex;
                                        const isCorrect = q.correctAnswerIndex === optIndex;
                                        const isWrong = isSelected && !isCorrect;

                                        return (
                                            <Button
                                                key={optIndex}
                                                variant="outline"
                                                className={`w-full justify-start h-auto py-2 text-left whitespace-normal ${showQuizResults ? (isCorrect ? 'bg-green-100 border-green-400' : isWrong ? 'bg-red-100 border-red-400' : '') : (isSelected ? 'bg-electric-aqua/20' : '')}`}
                                                onClick={() => !showQuizResults && handleAnswerSelect(index, optIndex)}
                                                disabled={showQuizResults}
                                            >
                                                {opt}
                                            </Button>
                                        );
                                    })}
                                </div>
                                {showQuizResults && (
                                    <p className="text-xs p-2 bg-yellow-50 rounded-md"><strong>Explanation:</strong> {q.explanation}</p>
                                )}
                            </div>
                        ))}
                        {!showQuizResults ? (
                            <Button className="w-full" onClick={handleSubmitQuiz}>
                                <CheckSquare className="h-4 w-4 mr-2" /> Submit Quiz
                            </Button>
                        ) : (
                            <div className="text-center p-4 bg-dark-blue/10 rounded-lg">
                                <p className="font-bold text-lg">Your Score: {quizScore} / {quiz?.questions.length}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
