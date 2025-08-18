'use client';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Target,
    MessageCircle,
    Mic,
    TrendingUp,
    Calendar,
    Trophy,
    Settings,
    ChevronRight,
    Menu, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
}

const navigationItems = [
    {
        feature: FEATURES.STUDY_PLANNER,
        label: 'Study Plan',
        icon: Calendar,
        description: 'Daily tasks & schedule'
    },
    {
        feature: FEATURES.MOCK_TESTS,
        label: 'Mock Tests',
        icon: Target,
        description: 'Practice & evaluate'
    },
    {
        feature: FEATURES.DEBATE,
        label: 'AI Debate',
        icon: MessageCircle,
        description: 'Practice arguments'
    },
    {
        feature: FEATURES.INTERVIEW,
        label: 'Interview',
        icon: Mic,
        description: 'Mock interviews'
    },
    {
        feature: FEATURES.PROGRESS,
        label: 'Progress',
        icon: TrendingUp,
        description: 'Track performance'
    },
    {
        feature: FEATURES.SETTINGS,
        label: 'Settings',
        icon: Settings,
        description: 'App preferences'
    }
];


export function Sidebar({ onCollapseChange }: SidebarProps) {
    const { activeFeature, navigateTo, currentUser, dailyStreak, studyPlan, mockTestHistory } = useAppStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!currentUser) return null;

    // Calculate study plan progress
    const totalTasks = studyPlan.reduce((acc, day) => acc + day.tasks.length, 0);
    const completedTasks = studyPlan.reduce((acc, day) =>
        acc + day.tasks.filter(task => task.isDone).length, 0
    );
    const studyProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
        onCollapseChange?.(!isCollapsed);
    };

    return (
        <motion.aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${isCollapsed ? 'w-[5.5rem]' : 'w-64'
                } bg-ice-white/90 backdrop-blur-md shadow-sm border-r border-dark-blue/15 z-40 overflow-y-auto transition-all duration-300`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col h-full p-4">
                {/* User Welcome */}
                <div className="p-2 border-b border-dark-blue/15">
                    <Button
                        variant="default"
                        size="icon"
                        onClick={handleToggle}
                        aria-pressed={isCollapsed}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="w-full justify-center rounded-full"
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
                </div>
                {!isCollapsed && (

                    <motion.div
                        className="mb-6 p-4 bg-ice-white rounded-lg text-center"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="mb-3">
                            <h3 className="font-semibold text-dark-blue text-lg">
                                Welcome back!
                            </h3>
                            <p className="text-sm text-dark-blue /80 truncate">
                                {currentUser.name}
                            </p>
                        </div>

                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <Trophy className="h-5 w-5 text-dark-blue " />
                            <span className="font-semibold ttext-dark-blue ">Daily Streak</span>
                        </div>
                        <motion.div
                            className="text-2xl font-bold text-ice-white"
                            animate={{ scale: dailyStreak > 0 ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 1, repeat: dailyStreak > 0 ? Infinity : 0, repeatDelay: 3 }}
                        >
                            {dailyStreak} days
                        </motion.div>
                    </motion.div>
                )}


                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-void-black/50 uppercase tracking-wide mb-2">
                            Features
                        </h4>
                    </div>

                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeFeature === item.feature;

                        return (
                            <motion.div
                                key={item.feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn(
                                        `w-full ${isCollapsed ? 'justify-center p-0' : 'justify-start p-3'} ${isCollapsed ? 'h-12' : 'h-auto'} relative group transition-all duration-200 rounded-xl`,
                                        isActive && "bg-dark-blue text-ice-white shadow-lg border-none",
                                        !isActive && "hover:bg-dark-blue/10 hover:border-dark-blue/20"
                                    )}
                                    onClick={() => navigateTo(item.feature)}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon className={cn(
                                        "transition-colors",
                                        isCollapsed ? "h-6 w-6" : "h-5 w-5 mr-3",
                                        isActive ? "text-ice-white" : "text-dark-blue"
                                    )} />

                                    {!isCollapsed && (
                                        <div className="flex-1 text-left">
                                            <div className={cn(
                                                "font-medium transition-colors",
                                                isActive ? "text-ice-white" : "text-void-black"
                                            )}>
                                                {item.label}
                                            </div>
                                            <div className={cn(
                                                "text-xs transition-colors",
                                                isActive ? "text-ice-white/80" : "text-void-black/50"
                                            )}>
                                                {item.description}
                                            </div>
                                        </div>
                                    )}

                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronRight className="h-4 w-4 ml-2 text-ice-white" />
                                        </motion.div>
                                    )}
                                </Button>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Quick Stats */}
                {!isCollapsed && (
                    <div className="mt-6 space-y-4">
                        <div className="p-3 bg-dark-blue/10 rounded-lg">
                            <h3 className="font-semibold text-sm mb-3 text-void-black flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2 text-dark-blue" />
                                Quick Stats
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-void-black/70">Study Progress</span>
                                    <span className="font-medium text-dark-blue">{studyProgress}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-void-black/70">Tasks Done</span>
                                    <span className="font-medium text-void-black">{completedTasks}/{totalTasks}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-void-black/70">Mock Tests</span>
                                    <span className="font-medium text-void-black">{mockTestHistory.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-void-black/70">Best Score</span>
                                    <span className="font-medium text-void-black">
                                        {mockTestHistory.length > 0
                                            ? Math.max(...mockTestHistory.map(t => t.score))
                                            : '--'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Motivational Quote */}
                        <motion.div
                            className="p-3 bg-dark-blue/10 rounded-lg border border-dark-blue/20"
                            animate={{
                                boxShadow: [
                                    "0 0 0px rgba(74, 227, 181, 0.2)",
                                    "0 0 20px rgba(74, 227, 181, 0.3)",
                                    "0 0 0px rgba(74, 227, 181, 0.2)"
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <div className="text-xs text-dark-blue/80 mb-1">💡 Today's Motivation</div>
                            <div className="text-sm font-medium text-dark-blue leading-relaxed">
                                "Success in UPSC is not about being perfect, it's about being consistent."
                            </div>
                        </motion.div>

                        {/* Pro Upgrade CTA */}
                        {!useAppStore.getState().isProUser && (
                            <motion.div
                                className="p-3 bg-dark-blue text-ice-white rounded-lg text-center cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => useAppStore.getState().upgradeToPro()}
                            >
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <Trophy className="h-4 w-4 text-ice-white" />
                                    <span className="font-semibold text-ice-white text-sm">Upgrade to Pro</span>
                                </div>
                                <div className="text-xs text-ice-white/80">
                                    Unlock advanced analytics & features
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Footer */}
                {!isCollapsed && (
                    <div className="mt-4 pt-4 border-t border-dark-blue/15">
                        <div className="text-center">
                            <div className="text-xs text-void-black/50">
                                xploar.ai v1.0
                            </div>
                            <div className="text-xs text-void-black/40 mt-1">
                                Made with ❤️ for UPSC aspirants
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}