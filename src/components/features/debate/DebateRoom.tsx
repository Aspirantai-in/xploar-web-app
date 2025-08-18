'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChatMessage } from './ChatMessage';
import { DebateTimer } from './DebateTimer';
import { DebateResults } from './DebateResults';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const debateTopics = [
    'Is technology making us more isolated?',
    'Should universal basic income be implemented?',
    'Is democracy the best form of government?',
    'Should social media be regulated by government?',
    'Is climate change the biggest threat to humanity?',
    'Should education be completely digitalized?',
    'Is globalization beneficial for developing countries?',
    'Should artificial intelligence replace human decision-making?'
];

export function DebateRoom() {
    const [selectedTopic, setSelectedTopic] = useState('');
    const [isDebateActive, setIsDebateActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
    const [debateTime, setDebateTime] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [debateStartTime, setDebateStartTime] = useState<Date | null>(null);

    const handleStartDebate = () => {
        if (!selectedTopic) return;

        setIsDebateActive(true);
        setMessages([]);
        setDebateTime(0);
        setDebateStartTime(new Date()); // ADD THIS LINE
        setShowResults(false)

        // AI's opening statement
        setTimeout(() => {
            const aiOpening = generateAIResponse(selectedTopic, userPosition, []);
            setMessages([{
                id: `ai-${Date.now()}`,
                content: aiOpening,
                sender: 'ai',
                timestamp: new Date()
            }]);
        }, 1000);
    };

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: currentMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');

        // AI response
        setTimeout(() => {
            const aiResponse = generateAIResponse(selectedTopic, userPosition, [...messages, userMessage]);
            setMessages(prev => [...prev, {
                id: `ai-${Date.now()}`,
                content: aiResponse,
                sender: 'ai',
                timestamp: new Date()
            }]);
        }, 1500);
    };

    const generateAIResponse = (topic: string, position: 'for' | 'against', history: Message[]) => {
        const aiPosition = position === 'for' ? 'against' : 'for';

        const responses = [
            `I respectfully disagree with your stance on "${topic}". Let me present a counterargument...`,
            `That's an interesting perspective, but I believe there's another way to look at this issue...`,
            `While I understand your point, I think we need to consider the broader implications...`,
            `Your argument has merit, however, let me challenge that with evidence from a different angle...`,
            `I appreciate your viewpoint, but I'd like to present some data that suggests otherwise...`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleEndDebate = () => {
        setIsDebateActive(false);
        setShowResults(true);
    };

    if (showResults) {
        const duration = debateStartTime ? Math.floor((Date.now() - debateStartTime.getTime()) / 1000) : 0;
        return (
            <DebateResults
                topic={selectedTopic}
                userPosition={userPosition}
                duration={duration}
                messageCount={messages.filter(m => m.sender === 'user').length}
                onNewDebate={() => {
                    setShowResults(false);
                    setSelectedTopic('');
                    setIsDebateActive(false);
                }}
                onBackToDebates={() => {
                    setShowResults(false);
                    setSelectedTopic('');
                    setIsDebateActive(false);
                }}
            />
        );
    }
    if (!isDebateActive) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <MessageSquare className="h-12 w-12 text-electric-aqua mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-void-black mb-2">AI Debate Room</h1>
                    <p className="text-void-black/70">
                        Sharpen your argumentation skills by debating with AI on current affairs topics
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Start New Debate</CardTitle>
                            <CardDescription>
                                Choose a topic and your position to begin the debate
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Debate Topic</label>
                                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a debate topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {debateTopics.map((topic) => (
                                            <SelectItem key={topic} value={topic}>
                                                {topic}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Position</label>
                                <div className="flex space-x-4">
                                    <Button
                                        variant={userPosition === 'for' ? 'default' : 'outline'}
                                        onClick={() => setUserPosition('for')}
                                        className="flex-1"
                                    >
                                        For (Supporting)
                                    </Button>
                                    <Button
                                        variant={userPosition === 'against' ? 'default' : 'outline'}
                                        onClick={() => setUserPosition('against')}
                                        className="flex-1"
                                    >
                                        Against (Opposing)
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 bg-electric-aqua/10 rounded-lg">
                                <h3 className="font-semibold mb-2">Debate Rules</h3>
                                <ul className="text-sm text-void-black/70 space-y-1">
                                    <li>• Present logical arguments with evidence</li>
                                    <li>• Stay respectful and professional</li>
                                    <li>• Address counterarguments effectively</li>
                                    <li>• Use current affairs and examples</li>
                                    <li>• Aim for balanced discussion</li>
                                </ul>
                            </div>

                            <Button
                                variant="gradient"
                                size="lg"
                                className="w-full"
                                onClick={handleStartDebate}
                                disabled={!selectedTopic}
                            >
                                Start Debate
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }


    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-ice-white to-electric-aqua/5">
            {/* Debate Header */}
            <div className="p-4 border-b border-electric-aqua/20 bg-ice-white/90 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg">{selectedTopic}</h2>
                        <p className="text-sm text-void-black/70">
                            You are arguing <span className="font-medium">{userPosition}</span> • AI is arguing{' '}
                            <span className="font-medium">{userPosition === 'for' ? 'against' : 'for'}</span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <DebateTimer time={debateTime} onTimeUpdate={setDebateTime} />
                        <Button variant="outline" onClick={handleEndDebate}>
                            <Flag className="h-4 w-4 mr-2" />
                            End Debate
                        </Button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
                {messages.length === 0 && (
                    <div className="text-center text-void-black/50 mt-8">
                        Waiting for AI to start the debate...
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-electric-aqua/20 bg-ice-white/90 backdrop-blur">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Type your argument..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}