'use client';
import { useState } from 'react';
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
        userRole,
        signOut,
        upgradeToPro,
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
                    <div className="h-8 w-8 rounded-lg bg-dark-blue flex items-center justify-center">
                        <span className="text-ice-white font-bold text-lg">X</span>
                    </div>
                    <h1 className="text-xl font-bold text-dark-blue">xploar.ai</h1>
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
                            {/* Pro Badge */}
                            {isProUser && (
                                <motion.div
                                    className="flex items-center space-x-1 bg-dark-blue px-2 py-1 rounded-full"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Crown className="h-4 w-4 text-ice-white" />
                                    <span className="text-xs font-semibold text-ice-white">PRO</span>
                                </motion.div>
                            )}

                            {/* User Role Badge */}
                            <div className="px-2 py-1 bg-cosmic-indigo text-ice-white rounded-full text-xs font-medium capitalize">
                                {userRole}
                            </div>

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

                                {!isProUser && (
                                    <Button
                                        variant="gradient"
                                        size="sm"
                                        onClick={upgradeToPro}
                                        className="h-8"
                                    >
                                        Upgrade
                                    </Button>
                                )}

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