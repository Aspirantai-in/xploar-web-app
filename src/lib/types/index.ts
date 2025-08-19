export type UserID = string;
export type TopicID = string;
export type TaskID = string;
export type DateString = string; // Format: "YYYY-MM-DD"
export type ISOString = string; // e.g., "2025-08-19T09:00:00.000Z"

// --- EXISTING TYPES ---
export interface User {
    id: UserID;
    email: string;
    name: string;
}

export interface StudyConfig {
    goal: string;
    startDate: DateString;
    durationDays: number;
    hoursPerDay: number;
}

export interface Task {
    id: TaskID;
    topicId: TopicID;
    kind: "Read" | "Practice" | "Explain" | "Recall";
    durationMins: number;
    isDone: boolean;
}

export interface PlanDay {
    day: number;
    date: DateString;
    tasks: Task[];
}

export interface MCQResult {
    [key: TopicID]: {
        correct: number;
        total: number;
    };
}

export interface MockRun {
    id: string;
    date: DateString;
    topicId: TopicID;
    score: number;
    totalQuestions: number;
    timeTakenMins: number;
    usesNegativeMarking: boolean;
}

export interface Question {
    stem: string;
    options: string[];
    ans: number;
}

export interface Topic {
    id: TopicID;
    name: string;
}

// --- NEW TYPES from SPECIFICATION ---

// Content & Resource Hub
export type ArticleID = string;
export type DailyQuizID = string;
export type ResourceID = string;
export type NoteID = string;
export type DeckID = string;
export type CardID = string;

export interface CurrentAffairsArticle {
    id: ArticleID;
    title: string;
    publicationDate: ISOString;
    source: string;
    summary: string;
    content: string;
    relevantTopicIds: TopicID[];
    mediaType: "article" | "mindmap" | "infographic";
    mediaUrl?: string;
}

export interface DailyQuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface DailyQuiz {
    id: DailyQuizID;
    quizDate: DateString;
    title: string;
    questions: DailyQuizQuestion[];
}

export interface UserQuizAttempt {
    userId: UserID;
    quizId: DailyQuizID;
    startedAt: ISOString;
    completedAt?: ISOString;
    answers: { [questionIndex: number]: number };
    score: number;
}

export interface CuratedResource {
    id: ResourceID;
    title: string;
    authorOrSource: string;
    type: "book" | "report" | "website" | "video";
    url: string;
    description: string;
    topicIds: TopicID[];
}

export interface UserNote {
    id: NoteID;
    userId: UserID;
    title: string;
    content?: string;
    fileUrl?: string;
    fileType?: "pdf" | "docx" | "jpg";
    createdAt: ISOString;
    updatedAt: ISOString;
    topicIds: TopicID[];
}

export interface Flashcard {
    id: CardID;
    deckId: DeckID;
    front: string;
    back: string;
}

export interface FlashcardDeck {
    id: DeckID;
    title: string;
    description: string;
    topicId: TopicID;
    isOfficial: boolean;
    authorId?: UserID;
}

export interface UserFlashcardInstance {
    userId: UserID;
    cardId: CardID;
    deckId: DeckID;
    lastReviewedAt: ISOString;
    nextReviewDate: DateString;
    easinessFactor: number;
    intervalDays: number;
    repetitionCount: number;
}


// Community & Collaborative Learning
export type SubmissionID = string;
export type ReviewID = string;
export type GroupID = string;
export type ForumPostID = string;

export interface AnswerSubmission {
    id: SubmissionID;
    authorId: UserID;
    questionText: string;
    answerText: string;
    submittedAt: ISOString;
    topicId: TopicID;
    status: "pending_review" | "reviewed" | "closed";
}

export interface PeerReview {
    id: ReviewID;
    submissionId: SubmissionID;
    reviewerId: UserID;
    reviewedAt: ISOString;
    feedback: string;
    rubricScores: {
        structure: number;
        contentClarity: number;
        relevance: number;
    };
}

export interface StudyGroup {
    id: GroupID;
    name: string;
    description: string;
    createdAt: ISOString;
    adminId: UserID;
    memberIds: UserID[];
}

export interface GroupGoal {
    groupId: GroupID;
    title: string;
    targetDate: DateString;
    isCompleted: boolean;
}

export interface GroupChatMessage {
    groupId: GroupID;
    senderId: UserID;
    message: string;
    sentAt: ISOString;
}

export interface ForumPost {
    id: ForumPostID;
    authorId: UserID;
    topicId: TopicID;
    title: string;
    content: string;
    createdAt: ISOString;
    isPinned: boolean;
    isLocked: boolean;
}

export interface ForumReply {
    postId: ForumPostID;
    authorId: UserID;
    content: string;
    createdAt: ISOString;
    isAcceptedAnswer: boolean;
}

// Mentor & Expert Connect
export type MentorID = string;
export type SessionID = string;
export type WebinarID = string;

export interface MentorProfile {
    id: MentorID;
    userId: UserID;
    name: string;
    imageUrl: string;
    headline: string;
    bio: string;
    expertise: TopicID[];
    hourlyRate: number;
    availabilitySlots: ISOString[];
}

export interface MentorshipSession {
    id: SessionID;
    mentorId: MentorID;
    studentId: UserID;
    scheduledTime: ISOString;
    durationMins: 30 | 60;
    status: "scheduled" | "completed" | "cancelled";
    paymentId: string;
    videoCallUrl: string;
}

export interface Webinar {
    id: WebinarID;
    title: string;
    hostId: MentorID;
    description: string;
    scheduledTime: ISOString;
    durationMins: number;
    registrationLink: string;
    recordingUrl?: string;
}


// Advanced Personalization
export type RecommendationID = string;

export interface AIRecommendation {
    id: RecommendationID;
    userId: UserID;
    createdAt: ISOString;
    type: "revise_topic" | "attempt_mock" | "read_article" | "watch_video";
    relatedTopicId?: TopicID;
    relatedResourceId?: ResourceID | ArticleID;
    reasoning: string;
    isCompleted: boolean;
}


// --- App State & Actions ---
export interface AppState {
    currentUser: User | null;
    isProUser: boolean;
    userRole: "student" | "mentor" | "admin";
    activeFeature: string;
    studyConfiguration: StudyConfig;
    studyPlan: PlanDay[];
    currentVisibleDay: number;
    dailyStreak: number;
    lastStreakUpdateDate: DateString | null;
    mcqPerformance: MCQResult;
    mockTestHistory: MockRun[];
    // New state properties
    recommendations: AIRecommendation[];
}

export interface AppActions {
    // Existing actions
    signIn: (email: string, name: string) => void;
    signOut: () => void;
    upgradeToPro: () => void;
    downgradeFromPro: () => void; // Added this action
    switchRole: () => void;
    navigateTo: (feature: string) => void;
    updateStudyConfig: (config: Partial<StudyConfig>) => void;
    generateStudyPlan: () => void;
    viewDay: (dayNumber: number) => void;
    toggleTaskCompletion: (taskId: TaskID) => void;
    deferTask: (taskId: TaskID) => void;
    updateStreak: () => void;
    recordMcqResult: (topicId: TopicID, correct: number, total: number) => void;
    saveMockTest: (runData: MockRun) => void;
    resetApplicationState: () => void;

    // New actions from spec
    fetchCurrentAffairs: (date: DateString) => Promise<CurrentAffairsArticle[]>;
    fetchDailyQuiz: (date: DateString) => Promise<DailyQuiz>;
    submitQuizAttempt: (attempt: UserQuizAttempt) => void;
    fetchCuratedResources: (topicId?: TopicID) => Promise<CuratedResource[]>;
    createUserNote: (noteData: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateUserNote: (noteId: NoteID, updates: Partial<UserNote>) => void;
    deleteUserNote: (noteId: NoteID) => void;
    fetchFlashcardDecks: (topicId?: TopicID) => Promise<FlashcardDeck[]>;
    fetchFlashcardsForDeck: (deckId: DeckID) => Promise<Flashcard[]>;
    updateFlashcardReview: (reviewData: { cardId: CardID, performance: 'easy' | 'good' | 'hard' }) => void;
    submitAnswerForReview: (submission: Omit<AnswerSubmission, 'id' | 'submittedAt' | 'status'>) => void;
    fetchSubmissionsToReview: () => Promise<AnswerSubmission[]>;
    submitPeerReview: (review: Omit<PeerReview, 'id' | 'reviewedAt'>) => void;
    createStudyGroup: (groupData: { name: string, description: string }) => void;
    joinStudyGroup: (groupId: GroupID) => void;
    sendGroupChatMessage: (message: Omit<GroupChatMessage, 'sentAt'>) => void;
    createForumPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'isPinned' | 'isLocked'>) => void;
    replyToForumPost: (reply: Omit<ForumReply, 'createdAt' | 'isAcceptedAnswer'>) => void;
    fetchMentors: (topicId?: TopicID) => Promise<MentorProfile[]>;
    bookMentorshipSession: (sessionData: { mentorId: MentorID, time: ISOString }) => Promise<{ success: boolean, sessionId: SessionID }>;
    fetchUpcomingWebinars: () => Promise<Webinar[]>;
    fetchRecordedWebinars: () => Promise<Webinar[]>;
    fetchAIRecommendations: () => Promise<AIRecommendation[]>;
    markRecommendationAsDone: (recommendationId: RecommendationID) => void;
    runAdaptivePlannerAnalysis: () => void;
}

export type AppStore = AppState & AppActions;
