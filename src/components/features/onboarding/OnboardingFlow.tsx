'use client';
import { useAppStore } from '@/lib/store';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

export function OnboardingFlow() {
    const { currentUser } = useAppStore();

    // If user is already signed in, show signup form for additional details
    if (currentUser) {
        return <SignupPage />;
    }

    // Default to login page
    return <LoginPage />;
}
