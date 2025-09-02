'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';
import { useState, useEffect } from 'react';
import { isFeatureEnabled } from '@/lib/config/features';

// Feature components
import { OnboardingFlow } from '@/components/features/onboarding/OnboardingFlow';
import { StudyPlanner } from '@/components/features/study-planner/StudyPlanner';
import { DailyPlanner } from '@/components/features/daily-planner/DailyPlanner';
import { ProgressDashboard } from '@/components/features/progress/ProgressDashboard';
import { SettingsPanel } from '@/components/features/settings/SettingsPanel';
import { PricingPage } from '@/components/features/pricing/PricingPage';
import { ComingSoon } from '@/components/ui/ComingSoon';


interface MainLayoutProps {
    children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { activeFeature, currentUser, navigateTo } = useAppStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const showAppLayout = currentUser && activeFeature !== FEATURES.ONBOARDING;

    // Check if user is trying to access a disabled feature
    useEffect(() => {
        if (currentUser && activeFeature && !isFeatureEnabled(activeFeature)) {
            // Don't redirect if we're already on an enabled feature or onboarding
            if (activeFeature !== FEATURES.ONBOARDING) {
                console.warn(`Feature ${activeFeature} is disabled. Redirecting to Study Planner.`);
                // Don't navigate, just show ComingSoon component
            }
        }
    }, [activeFeature, currentUser, navigateTo]);

    const renderFeature = () => {
        // Check if the current feature is disabled
        if (activeFeature && !isFeatureEnabled(activeFeature) && activeFeature !== FEATURES.ONBOARDING) {
            const featureLabels: Record<string, string> = {
                [FEATURES.MOCK_TESTS]: 'Mock Tests',
                [FEATURES.CONTENT_HUB]: 'Content Hub',
                [FEATURES.COMMUNITY]: 'Community',
                [FEATURES.MENTOR_CONNECT]: 'Mentor Connect',
                [FEATURES.RECOMMENDATIONS]: 'AI Insights',
                [FEATURES.AI_COACH]: 'AI Coach',
                [FEATURES.DEBATE]: 'AI Debate',
                [FEATURES.INTERVIEW]: 'Mock Interview',
                [FEATURES.SYLLABUS]: 'Syllabus Map',
                [FEATURES.DAILY_CHALLENGE]: 'Daily Challenge',
                [FEATURES.MULTI_MODE_LEARNING]: 'Learning Hub'
            };

            return <ComingSoon
                featureName={featureLabels[activeFeature] || activeFeature}
                description="This feature requires backend API implementation and will be available soon."
            />;
        }

        switch (activeFeature) {
            case FEATURES.STUDY_PLANNER:
                return <StudyPlanner />;
            case FEATURES.DAILY_PLANNER:
                return <DailyPlanner />;
            case FEATURES.PROGRESS:
                return <ProgressDashboard />;
            case FEATURES.SETTINGS:
                return <SettingsPanel />;
            case FEATURES.PRICING:
                return <PricingPage />;
            default:
                return currentUser ? <StudyPlanner /> : <OnboardingFlow />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ice-white via-ice-white to-electric-aqua/5">
            {showAppLayout && <Header />}

            <div className="flex">
                {showAppLayout && <Sidebar onCollapseChange={setSidebarCollapsed} />}

                <main className={`flex-1 transition-all duration-300 ${showAppLayout ? (sidebarCollapsed ? 'ml-[5.5rem]' : 'ml-64') : ''
                    }`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFeature}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            className={showAppLayout ? "min-h-[calc(100vh-4rem)]" : "min-h-screen"}
                        >
                            {renderFeature()}
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-electric-aqua/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-lilac/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cosmic-indigo/5 rounded-full blur-3xl"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>
        </div>
    );
}
