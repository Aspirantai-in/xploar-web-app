'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Crown, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { FEATURES } from '@/lib/utils/constants';

const freeFeatures = [
    { text: "AI-Generated Study Plan", included: true },
    { text: "Daily Challenge (100 Problems)", included: true },
    { text: "5 Mock Tests / month", included: true },
    { text: "Community Forum Access", included: true },
    { text: "Basic AI Recommendations", included: true },
    { text: "Unlimited Mock Tests", included: false },
    { text: "1-on-1 Mentor Rooms", included: false },
    { text: "Advanced AI Coach Evaluations", included: false },
    { text: "Priority Support", included: false },
];

const proFeatures = freeFeatures.map(f => ({ ...f, included: true }));

// New Congratulations Component
const CongratulationsScreen = () => {
    const { navigateTo } = useAppStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigateTo(FEATURES.STUDY_PLANNER);
        }, 3500); // Navigate after 3.5 seconds

        return () => clearTimeout(timer);
    }, [navigateTo]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-16"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
                className="mx-auto w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6"
            >
                <Award className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-void-black mb-2">Congratulations!</h1>
            <p className="text-void-black/70 text-lg mb-4">
                You are now a Pro member. Welcome to the next level of your preparation.
            </p>
            <p className="text-sm text-void-black/50">Redirecting you to your dashboard...</p>
        </motion.div>
    );
};


export function PricingPage() {
    const { upgradeToPro, isProUser } = useAppStore();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [view, setView] = useState<'pricing' | 'congratulations'>('pricing');

    const handleUpgrade = () => {
        // In a real app, this would happen after a successful payment callback
        upgradeToPro();
        setView('congratulations');
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
                {view === 'pricing' ? (
                    <motion.div
                        key="pricing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold text-void-black mb-2">Unlock Your Full Potential</h1>
                            <p className="text-void-black/70 text-lg">
                                Choose the plan that's right for your journey to success.
                            </p>
                        </div>

                        <div className="flex justify-center mb-8">
                            <div className="p-1 bg-gray-200 rounded-full flex space-x-1">
                                <Button
                                    variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                                    onClick={() => setBillingCycle('monthly')}
                                    className="rounded-full"
                                >
                                    Monthly
                                </Button>
                                <Button
                                    variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                                    onClick={() => setBillingCycle('yearly')}
                                    className="rounded-full relative"
                                >
                                    Yearly
                                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Save 20%</span>
                                </Button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Free Plan */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Free</CardTitle>
                                    <CardDescription>For aspirants starting their journey.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p><span className="text-4xl font-bold">₹0</span> / month</p>
                                    <Button variant="outline" className="w-full" disabled>Your Current Plan</Button>
                                    <ul className="space-y-2 pt-4">
                                        {freeFeatures.map(feature => (
                                            <li key={feature.text} className="flex items-center space-x-2">
                                                {feature.included ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                                                <span className={cn(!feature.included && "text-gray-400 line-through")}>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Pro Plan */}
                            <Card className="border-2 border-electric-aqua relative overflow-hidden">
                                <div className="absolute top-0 right-0 px-4 py-1 bg-electric-aqua text-void-black font-semibold text-sm transform rotate-45 translate-x-1/4 translate-y-1/4">
                                    Popular
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-2xl flex items-center">Pro <Crown className="h-5 w-5 ml-2 text-yellow-400" /></CardTitle>
                                    <CardDescription>For dedicated aspirants aiming for the top.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <span className="text-4xl font-bold">
                                            {billingCycle === 'monthly' ? '₹999' : '₹9,590'}
                                        </span>
                                        <span className="text-void-black/70">
                                            {billingCycle === 'monthly' ? ' / month' : ' / year'}
                                        </span>
                                    </div>
                                    <Button className="w-full" onClick={handleUpgrade} disabled={isProUser}>
                                        {isProUser ? 'You are a Pro Member' : 'Upgrade to Pro'}
                                    </Button>
                                    <ul className="space-y-2 pt-4">
                                        {proFeatures.map(feature => (
                                            <li key={feature.text} className="flex items-center space-x-2">
                                                <Check className="h-5 w-5 text-green-500" />
                                                <span>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                ) : (
                    <CongratulationsScreen key="congrats" />
                )}
            </AnimatePresence>
        </div>
    );
}
