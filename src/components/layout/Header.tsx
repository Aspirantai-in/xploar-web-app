'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Crown, Search, Settings, LogOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';

export function Header() {
    const {
        currentUser,
        isProUser,
        signOut,
        switchRole,
        navigateTo,
        resetApplicationState
    } = useAppStore();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSignOut = () => {
        signOut();
    };

    const handleReset = () => {
        resetApplicationState();
    };

    return (
        <motion.header
            className="sticky top-0 z-50 w-full border-b border-dark-blue/15 bg-ice-white/80 backdrop-blur-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <motion.div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => navigateTo(FEATURES.STUDY_PLANNER)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Image
                        src="/Xploar_logo.png"
                        alt="xploar.ai logo"
                        width={120}
                        height={40}
                        className="h-10 w-30"
                    />
                </motion.div>

                {/* Search Bar */}
                {currentUser && (
                    <div className="flex-1 max-w-md mx-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-void-black/50 h-4 w-4" />
                            <Input
                                placeholder="Search topics, questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                )}

                {/* User Controls */}
                <div className="flex items-center space-x-2">
                    {currentUser ? (
                        <>
                            {/* Pro Badge / Upgrade Button */}
                            {isProUser ? (
                                <motion.div
                                    className="flex items-center space-x-1 bg-gradient-flow px-2 py-1 rounded-full"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Crown className="h-4 w-4 text-void-black" />
                                    <span className="text-xs font-semibold text-void-black">PRO</span>
                                </motion.div>
                            ) : (
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    onClick={() => navigateTo(FEATURES.PRICING)}
                                    className="h-8"
                                >
                                    <Crown className="h-4 w-4 mr-2" />
                                    Upgrade
                                </Button>
                            )}

                            {/* User Menu */}
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigateTo(FEATURES.SETTINGS)}
                                    className="h-8 w-8"
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={switchRole}
                                    className="h-8 w-8"
                                    title="Switch Role"
                                >
                                    <User className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleReset}
                                    className="h-8 w-8"
                                    title="Reset App"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSignOut}
                                    className="h-8"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Sign Out
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Button variant="gradient" onClick={() => navigateTo(FEATURES.ONBOARDING)}>
                            Get Started
                        </Button>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
