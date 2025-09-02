/**
 * Content Hub Store Slice (DISABLED FEATURES)
 * Placeholder implementations for disabled features
 */

import type { StateCreator } from 'zustand';
import type { CurrentAffairsArticle, DailyQuiz, CuratedResource, UserNote } from '@/lib/types';

export interface ContentSlice {
    // State (empty since features are disabled)

    // Placeholder methods to prevent errors
    fetchCurrentAffairs: (date: string) => Promise<CurrentAffairsArticle[]>;
    fetchDailyQuiz: (date: string) => Promise<DailyQuiz | null>;
    fetchCuratedResources: () => Promise<CuratedResource[]>;
    createUserNote: (noteData: Partial<UserNote>) => Promise<void>;
}

export const createContentSlice: StateCreator<
    ContentSlice,
    [],
    [],
    ContentSlice
> = () => ({
    // Placeholder implementations that show "Coming Soon" message
    fetchCurrentAffairs: async (_date: string) => {
        console.warn('Content Hub: Current Affairs feature is disabled');
        return [];
    },

    fetchDailyQuiz: async (_date: string) => {
        console.warn('Content Hub: Daily Quiz feature is disabled');
        return null;
    },

    fetchCuratedResources: async () => {
        console.warn('Content Hub: Digital Library feature is disabled');
        return [];
    },

    createUserNote: async (_noteData: Partial<UserNote>) => {
        console.warn('Content Hub: User Notes feature is disabled');
        // Do nothing - feature is disabled
    }
});
