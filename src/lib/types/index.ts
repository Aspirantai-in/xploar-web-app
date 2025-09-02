/**
 * UNIFIED TYPE SYSTEM - SINGLE SOURCE OF TRUTH
 * All types for the Xploar application in one place
 * Aligned with API Documentation v2.0
 */

// ============================= PRIMITIVES =============================

export type UUID = string;
export type UserID = string;
export type TopicID = string;
export type TaskID = string;
export type DateString = string; // Format: "YYYY-MM-DD"
export type TimeString = string; // Format: "HH:mm"
export type ISOString = string; // Format: "YYYY-MM-DDTHH:mm:ssZ"

// ============================= API TYPES =============================

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data: T;
    timestamp: string;
    requestId: string;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: {
            field: string;
            message: string;
            code?: string;
        }[];
    };
    timestamp: string;
    requestId: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
}

// ============================= ENUMS =============================

export enum TaskType {
    READING = "READING",
    PRACTICE_MCQ = "PRACTICE_MCQ",
    ESSAY_WRITING = "ESSAY_WRITING",
    REVISION = "REVISION",
    MOCK_TEST = "MOCK_TEST",
    VIDEO_LECTURE = "VIDEO_LECTURE",
    NOTE_MAKING = "NOTE_MAKING",
    GROUP_DISCUSSION = "GROUP_DISCUSSION",
    CURRENT_AFFAIRS = "CURRENT_AFFAIRS",
    CUSTOM = "CUSTOM"
}

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    DEFERRED = "DEFERRED",
    SKIPPED = "SKIPPED",
    CANCELLED = "CANCELLED",
    BLOCKED = "BLOCKED"
}

export enum TaskPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    OPTIONAL = "OPTIONAL"
}

export enum SubjectArea {
    GENERAL_STUDIES_1 = "GENERAL_STUDIES_1",
    GENERAL_STUDIES_2 = "GENERAL_STUDIES_2",
    ESSAY = "ESSAY",
    HISTORY = "HISTORY",
    GEOGRAPHY = "GEOGRAPHY",
    POLITICAL_SCIENCE = "POLITICAL_SCIENCE",
    ECONOMICS = "ECONOMICS",
    MATHEMATICS = "MATHEMATICS",
    PHYSICS = "PHYSICS",
    CHEMISTRY = "CHEMISTRY",
    CURRENT_AFFAIRS = "CURRENT_AFFAIRS",
    ANSWER_WRITING = "ANSWER_WRITING"
}

export enum PlanStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}

export enum DayStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    SKIPPED = "SKIPPED"
}

export enum DifficultyLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT"
}

export enum StudyPattern {
    MORNING_PERSON = "MORNING_PERSON",
    EVENING_PERSON = "EVENING_PERSON"
}

// ============================= AUTH & USER TYPES =============================

export interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified?: boolean;
    isMobileVerified?: boolean;
    roles: string[];
    permissions: string[];
    lastLoginAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserProfile {
    userId: string;
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        mobileNumber?: string;
        dateOfBirth?: string;
        gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
        profilePicture?: string;
    };
    academicInfo?: {
        currentEducation?: 'HIGH_SCHOOL' | 'UNDERGRADUATE' | 'GRADUATE' | 'POSTGRADUATE' | 'WORKING_PROFESSIONAL';
        fieldOfStudy?: string;
        institution?: string;
        graduationYear?: number;
        academicAchievements?: string[];
    };
    examInfo?: {
        targetExam?: string;
        examYear?: number;
        attemptNumber?: number;
        previousAttempts?: {
            examName: string;
            attemptDate: string;
            score?: number;
            rank?: string;
        }[];
        targetRank?: string;
    };
    preferences: {
        timezone: string;
        language: string;
        notificationSettings: {
            email: boolean;
            sms: boolean;
            push: boolean;
            reminderTime?: string;
        };
        studyPreferences?: {
            preferredStudyTime?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
            breakDuration?: number;
            weeklyOffDays?: string[];
            aiRecommendations?: boolean;
        };
    };
    subscription?: {
        plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
        startDate?: string;
        endDate?: string;
        features?: string[];
        isActive?: boolean;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
    deviceInfo?: {
        deviceId?: string;
        deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET';
        os?: string;
        osVersion?: string;
    };
}

export interface RegistrationData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    mobileNumber: string;
    countryCode: string;
    preferences: {
        timezone: string;
        language: string;
        notificationSettings: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

// ============================= STUDY SYSTEM TYPES =============================

export interface StudyConfig {
    goal: string;
    startDate: DateString;
    durationDays: number;
    hoursPerDay: number;
}

export interface StudyPlan {
    planId: UUID;
    title: string;
    description: string;
    status: PlanStatus;
    startDate: DateString;
    endDate: DateString;
    targetHoursPerDay: number;
    difficultyLevel: DifficultyLevel;
    totalDays: number;
    completedDays: number;
    completionPercentage: number;
    subjects: {
        mandatory: SubjectArea[];
        optional: SubjectArea[];
        languages?: string[];
    };
    preferences?: {
        studyPattern: StudyPattern;
        breakDuration: number;
        weeklyOffDays: string[];
        aiRecommendations: boolean;
    };
    aiMetadata?: {
        learningStyle: string;
        strengthAreas: SubjectArea[];
        weaknessAreas: SubjectArea[];
    };
    createdDate: ISOString;
    updatedDate?: ISOString;
    version?: number;
    // Tasks are now managed separately via API
    tasks?: Task[]; // For compatibility with existing code
}

export interface Task {
    taskId: UUID;
    studyPlanId: UUID;
    dailyPlanId?: UUID;
    title: string;
    description: string;
    taskType: TaskType;
    subjectArea: SubjectArea;
    subject: string;
    status: TaskStatus;
    priority: TaskPriority;
    estimatedDurationMinutes: number;
    actualDurationMinutes?: number;
    dueDate: DateString;
    dueTime?: TimeString;
    scheduledStartTime?: TimeString;
    scheduledEndTime?: TimeString;
    actualStartTime?: ISOString;
    actualEndTime?: ISOString;
    completionPercentage: number;
    difficultyRating?: number;
    satisfactionRating?: number;
    deferCount: number;
    maxDeferrals: number;
    isRecurring: boolean;
    isActive: boolean;
    isMandatory: boolean;
    isOverdue: boolean;
    canBeStarted: boolean;
    canBeCompleted: boolean;
    canBeDeferred: boolean;
    taskMetadata?: TaskMetadata;
    progressData?: TaskProgressData;
    resources?: TaskResources;
    dependencyTaskIds: UUID[];
    version: number;

    // Legacy compatibility fields
    id?: TaskID;
    topicId?: TopicID;
    kind?: "Read" | "Practice" | "Explain" | "Recall";
    durationMins?: number;
    isDone?: boolean;
}

export interface TaskMetadata {
    source?: string;
    chapter?: string;
    pageRange?: string;
    keyTopics?: string[];
}

export interface TaskProgressData {
    pagesRead?: number;
    timeSpent?: number;
    notesTaken?: boolean;
    questionsAnswered?: number;
    keyPoints?: string[];
}

export interface TaskResources {
    books?: string[];
    videos?: string[];
    notes?: string[];
}

export interface DailyPlan {
    dailyPlanId: UUID;
    planDate: DateString;
    studyPlanId: UUID;
    targetHours: number;
    completedHours: number;
    completionPercentage: number;
    status: DayStatus;
    isCompleted: boolean;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    deferredTasks: number;
    tasks: Task[];
    dailyNotes?: {
        morning?: string;
        afternoon?: string;
        evening?: string;
    };
    performanceMetrics?: {
        focusScore?: number;
        productivity?: number;
        energyLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
        distractions?: number;
        mood?: 'SATISFIED' | 'NEUTRAL' | 'DISSATISFIED';
        challenges?: string[];
    };
    createdDate: ISOString;
    updatedDate: ISOString;
}

// Legacy compatibility
export interface PlanDay {
    day: number;
    date: DateString;
    tasks: Task[];
}

// ============================= AI & ML TYPES =============================

export interface AIRecommendation {
    id: string;
    type: 'STUDY_PLAN' | 'TASK_OPTIMIZATION' | 'SCHEDULE_ADJUSTMENT' | 'RESOURCE_SUGGESTION';
    title: string;
    description: string;
    confidence: number; // 0-1 scale
    createdAt: ISOString;
    expiresAt?: ISOString;
    metadata?: {
        targetSubject?: SubjectArea;
        estimatedImpact?: 'LOW' | 'MEDIUM' | 'HIGH';
        actionRequired?: boolean;
        relatedTaskIds?: UUID[];
    };
}

// ============================= PROGRESS TYPES =============================

export interface OverallProgress {
    userId: UUID;
    overallStats: {
        totalStudyPlans: number;
        activeStudyPlans: number;
        completedStudyPlans: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        deferredTasks: number;
        overallCompletion: number;
    };
    timeStats: {
        totalStudyTime: number;
        averageDailyStudyTime: number;
        longestStudySession: number;
        totalStudyDays: number;
        currentStreak: number;
        longestStreak: number;
    };
    subjectProgress: Record<SubjectArea, {
        completedTasks: number;
        totalTasks: number;
        completionPercentage: number;
        timeSpent: number;
        strength: 'LOW' | 'MEDIUM' | 'HIGH';
    }>;
    performanceTrends: {
        weeklyProgress: number[];
        monthlyProgress: number[];
        improvementRate: number;
    };
    achievements: {
        id: string;
        name: string;
        description: string;
        earnedDate: ISOString;
        icon: string;
    }[];
    lastUpdated: ISOString;
}

export interface SubjectProgress {
    completedTasks: number;
    totalTasks: number;
    completionPercentage: number;
    timeSpent: number;
    strength: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PerformanceTrends {
    weeklyProgress: number[];
    monthlyProgress: number[];
    improvementRate: number;
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

// ============================= REQUEST/RESPONSE TYPES =============================

export interface CreateStudyPlanRequest {
    title: string;
    description: string;
    startDate: DateString;
    endDate: DateString;
    targetHoursPerDay: number;
    difficultyLevel: DifficultyLevel;
    subjects: {
        mandatory: SubjectArea[];
        optional: SubjectArea[];
        languages?: string[];
    };
    preferences?: {
        studyPattern: StudyPattern;
        breakDuration: number;
        weeklyOffDays: string[];
        aiRecommendations: boolean;
    };
    aiMetadata?: {
        learningStyle: string;
        strengthAreas: SubjectArea[];
        weaknessAreas: SubjectArea[];
    };
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    taskType: TaskType;
    subjectArea: SubjectArea;
    subject: string;
    priority: TaskPriority;
    estimatedDurationMinutes: number;
    dueDate: DateString;
    dueTime?: TimeString;
    scheduledStartTime?: TimeString;
    scheduledEndTime?: TimeString;
    isMandatory?: boolean;
    isRecurring?: boolean;
    taskMetadata?: TaskMetadata;
    resources?: TaskResources;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    estimatedDurationMinutes?: number;
    dueDate?: DateString;
    dueTime?: TimeString;
    scheduledStartTime?: TimeString;
    scheduledEndTime?: TimeString;
    taskMetadata?: TaskMetadata;
    resources?: TaskResources;
}

export interface CompleteTaskRequest {
    actualDurationMinutes: number;
    completionPercentage: number;
    difficultyRating?: number;
    satisfactionRating?: number;
    notes?: string;
    progressData?: TaskProgressData;
}

export interface DeferTaskRequest {
    reason: string;
    deferToDate: DateString;
    deferToTime?: TimeString;
}

// ============================= APP STATE TYPES =============================

export interface AppState {
    currentUser: User | null;
    isProUser: boolean;
    userRole: "student" | "mentor" | "admin";
    activeFeature: string;
    studyConfiguration: StudyConfig;
    studyPlans: StudyPlan[];
    currentStudyPlan: StudyPlan | null;
    dailyStreak: number;
    lastStreakUpdateDate: DateString | null;
    mcqPerformance: MCQResult;
    mockTestHistory: MockRun[];
    recommendations: AIRecommendation[]; // AI recommendations
}

export interface AppActions {
    // Core navigation - auth actions are handled by AuthSlice
    navigateTo: (feature: string) => void;
}

// ============================= LEGACY COMPATIBILITY =============================

// Keep these for existing components that haven't been updated yet
export interface Topic {
    id: TopicID;
    name: string;
}

export interface Question {
    stem: string;
    options: string[];
    ans: number;
}

// These will be removed in future versions
export interface UserQuizAttempt {
    userId: UserID;
    quizId: string;
    startedAt: ISOString;
    completedAt?: ISOString;
    answers: { [questionIndex: number]: number };
}

// ============================= CONTENT HUB TYPES (DISABLED) =============================

// These types exist but are not used since Content Hub is disabled
export interface CurrentAffairsArticle {
    id: string;
    title: string;
    content: string;
    publishedDate: DateString;
    source: string;
    tags: string[];
}

export interface DailyQuiz {
    id: string;
    date: DateString;
    questions: Question[];
}

export interface CuratedResource {
    id: string;
    title: string;
    description: string;
    type: 'PDF' | 'VIDEO' | 'ARTICLE' | 'BOOK';
    url: string;
    tags: string[];
}

export interface UserNote {
    id: string;
    userId: string;
    title: string;
    content: string;
    topicIds: string[];
    createdAt: ISOString;
    updatedAt: ISOString;
}

export interface FlashcardDeck {
    id: string;
    title: string;
    description: string;
    cardCount: number;
}

export interface Flashcard {
    id: string;
    deckId: string;
    front: string;
    back: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

// ============================= COMMUNITY TYPES =============================

export interface ForumPost {
    id: string;
    authorId: string;
    topicId: string;
    title: string;
    content: string;
    createdAt: ISOString;
    isPinned?: boolean;
    isLocked?: boolean;
}

export interface ForumReply {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: ISOString;
    isAccepted?: boolean;
}

export interface StudyGroup {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    maxMembers: number;
    isPublic: boolean;
    createdAt: ISOString;
    topicAreas: SubjectArea[];
}

// ============================= EXPORTS =============================

// Re-export everything for convenience
export * from './errors';
export * from './auth';

// Export all types - no need for default export since these are all interfaces/types