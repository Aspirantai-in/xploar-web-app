'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

interface WelcomeScreenProps {
    onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
    const { signIn } = useAppStore();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleGetStarted = () => {
        if (email && name) {
            signIn(email, name);
            onNext();
        }
    };

    const features = [
        {
            icon: Target,
            title: "Personalized Study Plans",
            description: "AI-generated daily schedules tailored to your goals and timeline"
        },
        {
            icon: Brain,
            title: "Smart Mock Tests",
            description: "Adaptive testing with detailed performance analytics"
        },
        {
            icon: Zap,
            title: "AI-Powered Practice",
            description: "Debate simulations and interview practice with instant feedback"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <motion.div
                    className="inline-flex items-center space-x-2 mb-6"
                    animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, 0, -1, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <div className="h-16 w-16 rounded-2xl bg-dark-blue flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-ice-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-dark-blue">
                        xploar.ai
                    </h1>
                </motion.div>

                <h2 className="text-3xl font-bold text-void-black mb-4">
                    Your AI-Powered UPSC Preparation Companion
                </h2>
                <p className="text-lg text-void-black/70 max-w-2xl mx-auto">
                    Transform your UPSC preparation with personalized study plans, intelligent mock tests,
                    and AI-driven practice sessions. Start your journey to civil services success today.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.title}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                <CardHeader className="text-center pb-4">
                                    <motion.div
                                        className="mx-auto mb-4 p-3 bg-dark-blue/10 rounded-xl w-fit"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="h-6 w-6 text-void-black" />
                                    </motion.div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
            >
                <Card className="max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle>Get Started</CardTitle>
                        <CardDescription>
                            Enter your details to begin your preparation journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="gradient"
                            size="lg"
                            className="w-full mt-6"
                            onClick={handleGetStarted}
                            disabled={!email || !name}
                        >
                            Start My Journey
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}