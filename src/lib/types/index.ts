export type UserID = string;
export type TopicID = string;
export type TaskID = string;
export type DateString = string; // Format: "YYYY-MM-DD"

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
}

export interface AppActions {
    signIn: (email: string, name: string) => void;
    signOut: () => void;
    upgradeToPro: () => void;
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
}

export type AppStore = AppState & AppActions;