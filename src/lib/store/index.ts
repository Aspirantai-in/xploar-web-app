import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    AppStore,
    AppState,
    StudyConfig,
    TaskID,
    TopicID,
    MockRun,
    User,
    DateString,
    CurrentAffairsArticle,
    DailyQuiz,
    UserQuizAttempt,
    CuratedResource,
    UserNote,
    NoteID,
    FlashcardDeck,
    Flashcard,
    CardID,
    AnswerSubmission,
    PeerReview,
    GroupID,
    GroupChatMessage,
    ForumPost,
    ForumReply,
    MentorProfile,
    SessionID,
    ISOString,
    Webinar,
    AIRecommendation,
    RecommendationID,
    DeckID
} from '@/lib/types';
import { generateStudyPlan } from '@/lib/utils/planGenerator';
import { getTodayString } from '@/lib/utils/dateUtils';
import { FEATURES, APP_CONFIG } from '@/lib/utils/constants';
import {
    SAMPLE_CURRENT_AFFAIRS,
    SAMPLE_DAILY_QUIZ,
    SAMPLE_CURATED_RESOURCES,
    SAMPLE_FLASHCARD_DECKS,
    SAMPLE_FLASHCARDS,
    SAMPLE_MENTORS,
    SAMPLE_WEBINARS
} from '@/lib/data/extended-data';


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
    recommendations: [], // New state property
};

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // --- EXISTING ACTIONS ---

            signIn: (email: string, name: string) => {
                const user: User = { id: `user_${Date.now()}`, email, name };
                set({ currentUser: user, activeFeature: FEATURES.STUDY_PLANNER });
            },
            signOut: () => set({ currentUser: null, activeFeature: FEATURES.ONBOARDING }),
            upgradeToPro: () => set({ isProUser: true }),
            switchRole: () => {
                const roles = ['student', 'mentor', 'admin'] as const;
                const nextRole = roles[(roles.indexOf(get().userRole) + 1) % roles.length];
                set({ userRole: nextRole });
            },
            navigateTo: (feature: string) => set({ activeFeature: feature }),
            updateStudyConfig: (config) => set((state) => ({
                studyConfiguration: { ...state.studyConfiguration, ...config },
            })),
            generateStudyPlan: () => {
                const plan = generateStudyPlan(get().studyConfiguration);
                set({ studyPlan: plan, currentVisibleDay: 1, activeFeature: FEATURES.STUDY_PLANNER });
            },
            viewDay: (dayNumber) => set({ currentVisibleDay: dayNumber }),
            toggleTaskCompletion: (taskId) => {
                set((state) => {
                    const newPlan = state.studyPlan.map(day => ({
                        ...day,
                        tasks: day.tasks.map(t => t.id === taskId ? { ...t, isDone: !t.isDone } : t),
                    }));
                    // ... (streak logic can be added here)
                    return { studyPlan: newPlan };
                });
            },
            deferTask: (taskId) => { /* ... implementation ... */ },
            updateStreak: () => { /* ... implementation ... */ },
            recordMcqResult: (topicId, correct, total) => {
                set((state) => ({
                    mcqPerformance: { ...state.mcqPerformance, [topicId]: { correct, total } },
                }));
            },
            saveMockTest: (runData) => set((state) => ({
                mockTestHistory: [...state.mockTestHistory, runData],
            })),
            resetApplicationState: () => set(initialState),


            // --- NEW ACTIONS FROM SPECIFICATION ---

            // Content & Resource Hub
            fetchCurrentAffairs: async (date: DateString) => {
                console.log(`Fetching current affairs for ${date}`);
                return SAMPLE_CURRENT_AFFAIRS;
            },
            fetchDailyQuiz: async (date: DateString) => {
                console.log(`Fetching quiz for ${date}`);
                return SAMPLE_DAILY_QUIZ;
            },
            submitQuizAttempt: (attempt: UserQuizAttempt) => {
                console.log('Submitting quiz attempt:', attempt);
                // In a real app, this would be sent to a backend.
            },
            fetchCuratedResources: async (topicId?: TopicID) => {
                if (topicId) {
                    return SAMPLE_CURATED_RESOURCES.filter(r => r.topicIds.includes(topicId));
                }
                return SAMPLE_CURATED_RESOURCES;
            },
            createUserNote: (noteData) => { console.log('Creating note:', noteData); },
            updateUserNote: (noteId, updates) => { console.log(`Updating note ${noteId}:`, updates); },
            deleteUserNote: (noteId) => { console.log(`Deleting note ${noteId}`); },
            fetchFlashcardDecks: async (topicId?: TopicID) => {
                if (topicId) {
                    return SAMPLE_FLASHCARD_DECKS.filter(d => d.topicId === topicId);
                }
                return SAMPLE_FLASHCARD_DECKS;
            },
            fetchFlashcardsForDeck: async (deckId: DeckID) => {
                return SAMPLE_FLASHCARDS.filter(c => c.deckId === deckId);
            },
            updateFlashcardReview: (reviewData) => { console.log('Updating flashcard review:', reviewData); },

            // Community & Collaborative Learning
            submitAnswerForReview: (submission) => { console.log('Submitting answer for review:', submission); },
            fetchSubmissionsToReview: async () => {
                console.log('Fetching submissions to review');
                return []; // Placeholder
            },
            submitPeerReview: (review) => { console.log('Submitting peer review:', review); },
            createStudyGroup: (groupData) => { console.log('Creating study group:', groupData); },
            joinStudyGroup: (groupId) => { console.log(`Joining group ${groupId}`); },
            sendGroupChatMessage: (message) => { console.log('Sending group message:', message); },
            createForumPost: (post) => { console.log('Creating forum post:', post); },
            replyToForumPost: (reply) => { console.log('Replying to forum post:', reply); },

            // Mentor & Expert Connect
            fetchMentors: async (topicId?: TopicID) => {
                if (topicId) {
                    return SAMPLE_MENTORS.filter(m => m.expertise.includes(topicId));
                }
                return SAMPLE_MENTORS;
            },
            bookMentorshipSession: async (sessionData) => {
                console.log('Booking mentorship session:', sessionData);
                return { success: true, sessionId: `sess_${Date.now()}` };
            },
            fetchUpcomingWebinars: async () => {
                return SAMPLE_WEBINARS.filter(w => new Date(w.scheduledTime) > new Date());
            },
            fetchRecordedWebinars: async () => {
                return SAMPLE_WEBINARS.filter(w => w.recordingUrl);
            },

            // Advanced Personalization & Adaptive Engine
            fetchAIRecommendations: async () => {
                console.log('Fetching AI recommendations');
                return get().recommendations;
            },
            markRecommendationAsDone: (recommendationId) => {
                set((state) => ({
                    recommendations: state.recommendations.map(r =>
                        r.id === recommendationId ? { ...r, isCompleted: true } : r
                    ),
                }));
            },
            runAdaptivePlannerAnalysis: () => {
                const { mockTestHistory, studyPlan, currentUser } = get();
                if (!currentUser) return;

                console.log('Running adaptive planner analysis...');
                const topicScores: { [key: string]: { scores: number[], count: number } } = {};

                // 1. Analyze Performance
                mockTestHistory.forEach(test => {
                    if (!topicScores[test.topicId]) {
                        topicScores[test.topicId] = { scores: [], count: 0 };
                    }
                    topicScores[test.topicId].scores.push(test.score);
                    topicScores[test.topicId].count++;
                });

                const avgScores = Object.entries(topicScores).map(([topicId, data]) => ({
                    topicId,
                    avg: data.scores.reduce((a, b) => a + b, 0) / data.count,
                }));

                avgScores.sort((a, b) => a.avg - b.avg);
                const weakTopics = avgScores.slice(0, 2); // Identify top 2 weak topics

                // 2. Generate Recommendations
                const newRecommendations: AIRecommendation[] = [];
                weakTopics.forEach(weakTopic => {
                    const recommendation: AIRecommendation = {
                        id: `rec_${Date.now()}_${weakTopic.topicId}`,
                        userId: currentUser.id,
                        createdAt: new Date().toISOString(),
                        type: 'revise_topic',
                        relatedTopicId: weakTopic.topicId,
                        reasoning: `Low average score of ${weakTopic.avg.toFixed(1)} in mock tests.`,
                        isCompleted: false,
                    };
                    newRecommendations.push(recommendation);
                });

                // 3. Store Recommendations (avoiding duplicates)
                set(state => {
                    const existingRecIds = new Set(state.recommendations.map(r => r.id));
                    const filteredNewRecs = newRecommendations.filter(r => !existingRecIds.has(r.id));
                    return {
                        recommendations: [...state.recommendations, ...filteredNewRecs]
                    };
                });
            },
        }),
        {
            name: APP_CONFIG.STORAGE_KEY,
            version: 2, // Increment version due to state changes
        }
    )
);
