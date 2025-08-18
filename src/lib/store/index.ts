import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppStore, AppState, StudyConfig, TaskID, TopicID, MockRun, User } from '@/lib/types';
import { generateStudyPlan } from '@/lib/utils/planGenerator';
import { getTodayString } from '@/lib/utils/dateUtils';
import { FEATURES, APP_CONFIG } from '@/lib/utils/constants';

const initialState: AppState = {
    currentUser: null,
    isProUser: false,
    userRole: 'student',
    activeFeature: FEATURES.ONBOARDING,
    studyConfiguration: {
        goal: '',
        startDate: getTodayString(),
        durationDays: APP_CONFIG.DEFAULT_STUDY_DURATION,
        hoursPerDay: APP_CONFIG.DEFAULT_HOURS_PER_DAY,
    },
    studyPlan: [],
    currentVisibleDay: 1,
    dailyStreak: 0,
    lastStreakUpdateDate: null,
    mcqPerformance: {},
    mockTestHistory: [],
};

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // User actions
            signIn: (email: string, name: string) => {
                const user: User = {
                    id: `user_${Date.now()}`,
                    email,
                    name,
                };
                set({ currentUser: user });
            },

            signOut: () => {
                set({
                    currentUser: null,
                    activeFeature: FEATURES.ONBOARDING
                });
            },

            upgradeToPro: () => {
                set({ isProUser: true });
            },

            switchRole: () => {
                const { userRole } = get();
                const roles = ['student', 'mentor', 'admin'] as const;
                const currentIndex = roles.indexOf(userRole);
                const nextRole = roles[(currentIndex + 1) % roles.length];
                set({ userRole: nextRole });
            },

            // Navigation
            navigateTo: (feature: string) => {
                set({ activeFeature: feature });
            },

            // Study configuration
            updateStudyConfig: (config: Partial<StudyConfig>) => {
                set((state) => ({
                    studyConfiguration: { ...state.studyConfiguration, ...config }
                }));
            },

            generateStudyPlan: () => {
                const { studyConfiguration } = get();
                const plan = generateStudyPlan(studyConfiguration);
                set({
                    studyPlan: plan,
                    currentVisibleDay: 1,
                    activeFeature: FEATURES.STUDY_PLANNER
                });
            },

            viewDay: (dayNumber: number) => {
                set({ currentVisibleDay: dayNumber });
            },

            toggleTaskCompletion: (taskId: TaskID) => {
                set((state) => {
                    const updatedPlan = state.studyPlan.map(day => ({
                        ...day,
                        tasks: day.tasks.map(task =>
                            task.id === taskId ? { ...task, isDone: !task.isDone } : task
                        )
                    }));

                    // Check if task was marked as done and update streak
                    const updatedTask = updatedPlan
                        .flatMap(day => day.tasks)
                        .find(task => task.id === taskId);

                    if (updatedTask?.isDone) {
                        // Find the day containing this task
                        const taskDay = updatedPlan.find(day =>
                            day.tasks.some(task => task.id === taskId)
                        );

                        if (taskDay) {
                            const allTasksComplete = taskDay.tasks.every(task => task.isDone);
                            const today = getTodayString();

                            if (allTasksComplete && state.lastStreakUpdateDate !== today) {
                                return {
                                    ...state,
                                    studyPlan: updatedPlan,
                                    dailyStreak: state.dailyStreak + 1,
                                    lastStreakUpdateDate: today,
                                };
                            }
                        }
                    }

                    return { ...state, studyPlan: updatedPlan };
                });
            },

            deferTask: (taskId: TaskID) => {
                // Find next available day and move task there
                set((state) => {
                    const taskToDefer = state.studyPlan
                        .flatMap(day => day.tasks)
                        .find(task => task.id === taskId);

                    if (!taskToDefer) return state;

                    // Remove task from current day
                    const updatedPlan = state.studyPlan.map(day => ({
                        ...day,
                        tasks: day.tasks.filter(task => task.id !== taskId)
                    }));

                    // Find next day with space or create new day
                    const lastDay = updatedPlan[updatedPlan.length - 1];
                    if (lastDay && lastDay.tasks.length < 6) {
                        // Add to existing last day
                        lastDay.tasks.push({ ...taskToDefer, isDone: false });
                    }

                    return { ...state, studyPlan: updatedPlan };
                });
            },

            updateStreak: () => {
                // This is called by toggleTaskCompletion, so it's mostly handled there
                // But can be used for manual streak updates if needed
            },

            recordMcqResult: (topicId: TopicID, correct: number, total: number) => {
                set((state) => ({
                    mcqPerformance: {
                        ...state.mcqPerformance,
                        [topicId]: { correct, total }
                    }
                }));
            },

            saveMockTest: (runData: MockRun) => {
                set((state) => ({
                    mockTestHistory: [...state.mockTestHistory, runData]
                }));
            },

            resetApplicationState: () => {
                set(initialState);
            },
        }),
        {
            name: APP_CONFIG.STORAGE_KEY,
            version: 1,
        }
    )
);