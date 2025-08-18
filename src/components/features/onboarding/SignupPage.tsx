'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

export function SignupPage() {
    const { signIn } = useAppStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            signIn(formData.email, formData.name);
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
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
                        Start your UPSC preparation journey
                    </p>
                </motion.div>

                {/* Signup Form */}
                <Card className="shadow-lg border-dark-blue/20">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl">Create Account</CardTitle>
                        <CardDescription>
                            Fill in your details to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-void-black">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-void-black/50" />
                                    <Input
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <span className="mr-1">•</span>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-void-black">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-void-black/50" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <span className="mr-1">•</span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-void-black">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-void-black/50" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
                                {errors.password && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <span className="mr-1">•</span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-void-black">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-void-black/50" />
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-void-black/50" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-void-black/50" />
                                        )}
                                    </Button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <span className="mr-1">•</span>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="default"
                                size="lg"
                                className="w-full mt-6"
                                disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-ice-white/30 border-t-ice-white rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-sm text-void-black/70">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/login'}
                                    className="text-dark-blue hover:text-dark-blue/80 font-medium transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
