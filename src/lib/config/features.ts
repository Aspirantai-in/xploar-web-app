/**
 * Feature configuration based on backend API availability
 * Features marked as disabled will be hidden from the UI and not accessible
 */

import { FEATURES } from '@/lib/utils/constants';

export interface FeatureConfig {
    enabled: boolean;
    hasBackend: boolean;
    comingSoon?: boolean;
    description?: string;
}

export const FEATURE_CONFIG: Record<string, FeatureConfig> = {
    // Features WITH backend support - ENABLED
    [FEATURES.STUDY_PLANNER]: {
        enabled: true,
        hasBackend: true,
        description: 'Create and manage study plans with backend API support'
    },
    [FEATURES.DAILY_PLANNER]: {
        enabled: true,
        hasBackend: true,
        description: 'Daily task management with backend API support'
    },
    [FEATURES.PROGRESS]: {
        enabled: true,
        hasBackend: true,
        description: 'Track your progress with backend analytics'
    },
    [FEATURES.SETTINGS]: {
        enabled: true,
        hasBackend: true,
        description: 'User preferences and profile management'
    },
    [FEATURES.ONBOARDING]: {
        enabled: true,
        hasBackend: true,
        description: 'User onboarding flow'
    },
    [FEATURES.PRICING]: {
        enabled: true,
        hasBackend: false, // Static page
        description: 'Pricing information'
    },

    // Features WITHOUT backend support - DISABLED
    [FEATURES.CONTENT_HUB]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Content hub requires backend API implementation'
    },
    [FEATURES.MOCK_TESTS]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Mock tests require backend API implementation'
    },
    [FEATURES.COMMUNITY]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Community features require backend API implementation'
    },
    [FEATURES.MENTOR_CONNECT]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Mentor connect requires backend API implementation'
    },
    [FEATURES.RECOMMENDATIONS]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'AI recommendations require backend API implementation'
    },
    [FEATURES.AI_COACH]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'AI coach requires backend API implementation'
    },
    [FEATURES.DEBATE]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'AI debate requires backend API implementation'
    },
    [FEATURES.INTERVIEW]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Mock interview requires backend API implementation'
    },
    [FEATURES.SYLLABUS]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Syllabus tracking requires backend API implementation'
    },
    [FEATURES.DAILY_CHALLENGE]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Daily challenge requires backend API implementation'
    },
    [FEATURES.MULTI_MODE_LEARNING]: {
        enabled: false,
        hasBackend: false,
        comingSoon: true,
        description: 'Multi-mode learning requires backend API implementation'
    }
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
    const config = FEATURE_CONFIG[feature];
    return config ? config.enabled : false;
}

/**
 * Check if a feature has backend support
 */
export function hasBackendSupport(feature: string): boolean {
    const config = FEATURE_CONFIG[feature];
    return config ? config.hasBackend : false;
}

/**
 * Get enabled features only
 */
export function getEnabledFeatures(): string[] {
    return Object.keys(FEATURE_CONFIG).filter(feature => FEATURE_CONFIG[feature].enabled);
}

/**
 * Get disabled features that are coming soon
 */
export function getComingSoonFeatures(): string[] {
    return Object.keys(FEATURE_CONFIG).filter(feature =>
        !FEATURE_CONFIG[feature].enabled && FEATURE_CONFIG[feature].comingSoon
    );
}

/**
 * Get feature configuration
 */
export function getFeatureConfig(feature: string): FeatureConfig | undefined {
    return FEATURE_CONFIG[feature];
}
