'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

export function LoginPage() {
    const { signIn } = useAppStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            signIn(email, email.split('@')[0]); // Use email prefix as name for now
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToSignup = () => {
        // Use the store to navigate to signup
        window.location.href = '/signup';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-ice-white via-ice-white to-dark-blue/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Brand Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.div
                        className="inline-flex items-center space-x-3 mb-4"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <div className="h-12 w-12 rounded-xl bg-dark-blue flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-ice-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-dark-blue">
                            xploar.ai
                        </h1>
                    </motion.div>
                    <p className="text-void-black/70">
                        Welcome back to your UPSC preparation
                    </p>
                </motion.div>

                {/* Login Form */}
                <Card className="shadow-lg border-dark-blue/20">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-void-black">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-void-black/50" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-void-black">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-void-black/50" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-void-black/50" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-void-black/50" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="default"
                                size="lg"
                                className="w-full mt-6"
                                disabled={!email || !password || isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-sm text-void-black/70">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={handleSwitchToSignup}
                                    className="text-dark-blue hover:text-dark-blue/80 font-medium transition-colors"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
