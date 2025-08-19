'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

interface AuthScreenProps {
    onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const { signIn } = useAppStore();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = () => {
        if (email && (isLogin || name)) {
            // In a real app, you'd have proper validation and API calls
            signIn(email, name || 'Returning User');
            onAuthSuccess();
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <motion.div
                className="text-center mb-8"
            >
                <div className="inline-flex items-center space-x-2 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-dark-blue flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-ice-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-dark-blue">
                        xploar.ai
                    </h1>
                </div>
                <p className="text-lg text-void-black/70">
                    Your AI-Powered UPSC Preparation Companion
                </p>
            </motion.div>
            <Card>
                <CardHeader>
                    <CardTitle>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</CardTitle>
                    <CardDescription>{isLogin ? 'Sign in to continue your journey.' : 'Start your journey to success today.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button variant="gradient" size="lg" className="w-full" onClick={handleAuth}>
                        {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="text-center">
                        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
