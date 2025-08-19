'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';
import { useState } from 'react';

// Feature components
import { OnboardingFlow } from '@/components/features/onboarding/OnboardingFlow';
import { StudyPlanner } from '@/components/features/study-planner/StudyPlanner';
import { MockTests } from '@/components/features/mock-tests/MockTests';
import { DebateRoom } from '@/components/features/debate/DebateRoom';
import { InterviewRoom } from '@/components/features/interview/InterviewRoom';
import { ProgressDashboard } from '@/components/features/progress/ProgressDashboard';
import { SettingsPanel } from '@/components/features/settings/SettingsPanel';
// New Feature Components
import { ContentHub } from '@/components/features/content-hub/ContentHub';
import { CommunityHub } from '@/components/features/community/CommunityHub';
import { MentorConnect } from '@/components/features/mentor-connect/MentorConnect';
import { Recommendations } from '@/components/features/recommendations/Recommendations';


interface MainLayoutProps {
    children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { activeFeature, currentUser } = useAppStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const renderFeature = () => {
        switch (activeFeature) {
            case FEATURES.ONBOARDING:
                return <OnboardingFlow />;
            case FEATURES.STUDY_PLANNER:
                return <StudyPlanner />;
            case FEATURES.MOCK_TESTS:
                return <MockTests />;
            case FEATURES.DEBATE:
                return <DebateRoom />;
            case FEATURES.INTERVIEW:
                return <InterviewRoom />;
            case FEATURES.PROGRESS:
                return <ProgressDashboard />;
            case FEATURES.SETTINGS:
                return <SettingsPanel />;
            // New Features
            case FEATURES.CONTENT_HUB:
                return <ContentHub />;
            case FEATURES.COMMUNITY:
                return <CommunityHub />;
            case FEATURES.MENTOR_CONNECT:
                return <MentorConnect />;
            case FEATURES.RECOMMENDATIONS:
                return <Recommendations />;
            default:
                return currentUser ? <StudyPlanner /> : <OnboardingFlow />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ice-white via-ice-white to-electric-aqua/5">
            {/* Header */}
            <Header />

            {/* Main Content Area */}
            <div className="flex">
                {/* Sidebar - Only show when user is logged in */}
                {currentUser && <Sidebar onCollapseChange={setSidebarCollapsed} />}

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${currentUser ? (sidebarCollapsed ? 'ml-[5.5rem]' : 'ml-64') : ''
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
                            className="min-h-[calc(100vh-4rem)]"
                        >
                            {renderFeature()}
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Animated background shapes */}
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
