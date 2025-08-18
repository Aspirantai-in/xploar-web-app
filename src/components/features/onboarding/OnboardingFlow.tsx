'use client';
import { useAppStore } from '@/lib/store';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { StudyPlanner } from '@/components/features/study-planner/StudyPlanner';

export function OnboardingFlow() {
    const { currentUser } = useAppStore();

    // If user is already signed in, show signup form for additional details
    if (currentUser) {
        return <StudyPlanner />;
    }

    // Default to login page
    return <LoginPage />;
}
