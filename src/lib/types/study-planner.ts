// Study Planner Types aligned with API Documentation v2.0
// Feature 1: Study Plan Management
// Feature 2: Task Management
// Feature 3: Daily Planning
// Feature 4: Progress Tracking
// Feature 5: Goals Management
// Feature 6: Reminders & Notifications
// Feature 7: Study Sessions

export type UUID = string;
export type DateString = string; // Format: "YYYY-MM-DD"
export type TimeString = string; // Format: "HH:mm"
export type ISOString = string; // Format: "YYYY-MM-DDTHH:mm:ssZ"

// Enums from API Documentation
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
    ENVIRONMENT = "ENVIRONMENT",
    SCIENCE_TECHNOLOGY = "SCIENCE_TECHNOLOGY",
    ETHICS = "ETHICS",
    CURRENT_AFFAIRS = "CURRENT_AFFAIRS",
    ANSWER_WRITING = "ANSWER_WRITING"
}

export enum PlanStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
    DELETED = "DELETED" // Soft delete status
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
    EVENING_PERSON = "EVENING_PERSON",
    FLEXIBLE = "FLEXIBLE"
}

// New Enums for Enhanced Features
export enum GoalType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY"
}

export enum GoalStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    OVERDUE = "OVERDUE"
}

export enum ReminderType {
    TASK_DUE = "TASK_DUE",
    STUDY_SESSION = "STUDY_SESSION",
    BREAK_TIME = "BREAK_TIME",
    GOAL_DEADLINE = "GOAL_DEADLINE",
    CUSTOM = "CUSTOM"
}

export enum ReminderFrequency {
    ONCE = "ONCE",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    CUSTOM = "CUSTOM"
}

export enum SessionStatus {
    NOT_STARTED = "NOT_STARTED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

// Core Data Models - Feature 1: Study Plans
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
    };
    createdDate: ISOString;
}

// Feature 2: Task Management
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

// Feature 3: Daily Planning
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
    inProgressTasks: number;
    deferredTasks: number;
    tasks: DailyTask[];
    dailyNotes?: DailyNotes;
    performanceMetrics?: PerformanceMetrics;
    createdDate: ISOString;
    updatedDate: ISOString;
}

export interface DailyTask {
    taskId: UUID;
    title: string;
    taskType: TaskType;
    subjectArea: SubjectArea;
    status: TaskStatus;
    priority: TaskPriority;
    estimatedDurationMinutes: number;
    actualDurationMinutes?: number;
    completionPercentage: number;
}

export interface DailyNotes {
    morning?: string;
    afternoon?: string;
    evening?: string;
}

export interface PerformanceMetrics {
    focusScore?: number;
    productivity?: number;
    energyLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    distractions?: number;
    mood?: 'SATISFIED' | 'NEUTRAL' | 'DISSATISFIED';
    challenges?: string[];
}

export interface CompleteDayRequest {
    notes?: string;
    performanceMetrics?: PerformanceMetrics;
    tomorrowGoals?: string[];
}

// Feature 5: Goals Management
export interface StudyGoal {
    goalId: UUID;
    userId: UUID;
    studyPlanId?: UUID;
    title: string;
    description: string;
    goalType: GoalType;
    targetValue: number;
    currentValue: number;
    unit: string; // e.g., "pages", "questions", "minutes", "chapters"
    status: GoalStatus;
    startDate: DateString;
    targetDate: DateString;
    completedDate?: DateString;
    priority: TaskPriority;
    isRecurring: boolean;
    recurrencePattern?: string;
    progressPercentage: number;
    milestones: GoalMilestone[];
    createdDate: ISOString;
    updatedDate: ISOString;
}

export interface GoalMilestone {
    milestoneId: UUID;
    title: string;
    targetValue: number;
    isCompleted: boolean;
    completedDate?: ISOString;
}

export interface CreateGoalRequest {
    title: string;
    description: string;
    goalType: GoalType;
    targetValue: number;
    unit: string;
    startDate: DateString;
    targetDate: DateString;
    priority: TaskPriority;
    isRecurring?: boolean;
    recurrencePattern?: string;
    studyPlanId?: UUID;
}

export interface UpdateGoalRequest {
    title?: string;
    description?: string;
    targetValue?: number;
    targetDate?: DateString;
    priority?: TaskPriority;
    status?: GoalStatus;
}

// Feature 6: Reminders & Notifications
export interface StudyReminder {
    reminderId: UUID;
    userId: UUID;
    title: string;
    description?: string;
    reminderType: ReminderType;
    frequency: ReminderFrequency;
    startDate: DateString;
    endDate?: DateString;
    time: TimeString;
    isActive: boolean;
    lastTriggered?: ISOString;
    nextTrigger?: ISOString;
    customFrequency?: string;
    relatedEntityId?: UUID; // Task, Goal, or Session ID
    relatedEntityType?: 'TASK' | 'GOAL' | 'SESSION';
    notificationChannels: ('EMAIL' | 'SMS' | 'PUSH' | 'IN_APP')[];
    createdDate: ISOString;
    updatedDate: ISOString;
}

export interface CreateReminderRequest {
    title: string;
    description?: string;
    reminderType: ReminderType;
    frequency: ReminderFrequency;
    startDate: DateString;
    endDate?: DateString;
    time: TimeString;
    customFrequency?: string;
    relatedEntityId?: UUID;
    relatedEntityType?: 'TASK' | 'GOAL' | 'SESSION';
    notificationChannels: ('EMAIL' | 'SMS' | 'PUSH' | 'IN_APP')[];
}

export interface UpdateReminderRequest {
    title?: string;
    description?: string;
    frequency?: ReminderFrequency;
    endDate?: DateString;
    time?: TimeString;
    isActive?: boolean;
    notificationChannels?: ('EMAIL' | 'SMS' | 'PUSH' | 'IN_APP')[];
}

// Feature 7: Study Sessions
export interface StudySession {
    sessionId: UUID;
    userId: UUID;
    studyPlanId?: UUID;
    taskId?: UUID;
    title: string;
    description?: string;
    status: SessionStatus;
    plannedStartTime: ISOString;
    plannedEndTime: ISOString;
    actualStartTime?: ISOString;
    actualEndTime?: ISOString;
    durationMinutes: number;
    actualDurationMinutes?: number;
    breakDurationMinutes: number;
    focusScore?: number;
    notes?: string;
    interruptions: number;
    completedTasks: UUID[];
    createdDate: ISOString;
    updatedDate: ISOString;
}

export interface CreateSessionRequest {
    title: string;
    description?: string;
    plannedStartTime: ISOString;
    plannedEndTime: ISOString;
    durationMinutes: number;
    breakDurationMinutes?: number;
    studyPlanId?: UUID;
    taskId?: UUID;
}

export interface UpdateSessionRequest {
    title?: string;
    description?: string;
    plannedStartTime?: ISOString;
    plannedEndTime?: ISOString;
    durationMinutes?: number;
    breakDurationMinutes?: number;
}

export interface StartSessionRequest {
    actualStartTime: ISOString;
    notes?: string;
}

export interface EndSessionRequest {
    actualEndTime: ISOString;
    focusScore?: number;
    notes?: string;
    interruptions?: number;
    completedTasks?: UUID[];
}

// Enhanced Task Dependencies
export interface TaskDependency {
    dependencyId: UUID;
    taskId: UUID;
    dependsOnTaskId: UUID;
    dependencyType: 'BLOCKS' | 'REQUIRES' | 'SUGGESTS';
    isRequired: boolean;
    createdDate: ISOString;
}

export interface CreateTaskDependencyRequest {
    taskId: UUID;
    dependsOnTaskId: UUID;
    dependencyType: 'BLOCKS' | 'REQUIRES' | 'SUGGESTS';
    isRequired: boolean;
}

// Feature 4: Progress Tracking
export interface OverallProgress {
    userId: UUID;
    overallStats: OverallStats;
    timeStats: TimeStats;
    subjectProgress: Record<SubjectArea, SubjectProgress>;
    performanceTrends: PerformanceTrends;
    achievements: Achievement[];
    lastUpdated: ISOString;
}

export interface OverallStats {
    totalStudyPlans: number;
    activeStudyPlans: number;
    completedStudyPlans: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    deferredTasks: number;
    overallCompletion: number;
}

export interface TimeStats {
    totalStudyTime: number;
    averageDailyStudyTime: number;
    longestStudySession: number;
    totalStudyDays: number;
    currentStreak: number;
    longestStreak: number;
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

export interface Achievement {
    id: string;
    name: string;
    description: string;
    earnedDate: ISOString;
    icon: string;
}

export interface StreakInfo {
    currentStreak: Streak;
    longestStreak: Streak;
    streakHistory: Streak[];
    streakTypes: Record<string, StreakTypeStats>;
}

export interface Streak {
    days: number;
    startDate: DateString;
    endDate: DateString;
    type: string;
    isActive?: boolean;
}

export interface StreakTypeStats {
    current: number;
    longest: number;
    total: number;
}

// Request/Response Models - Exact match with API Documentation v2.0
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

export interface CompleteDayRequest {
    notes?: string;
    performanceMetrics?: PerformanceMetrics;
    tomorrowGoals?: string[];
}

// Request/Response Models for New Features
export interface DeleteStudyPlanRequest {
    reason?: string;
    keepData?: boolean; // Whether to keep progress data
}

export interface PauseStudyPlanRequest {
    reason?: string;
    resumeDate?: DateString;
}

export interface ResumeStudyPlanRequest {
    notes?: string;
    adjustments?: string[];
}

export interface StudyPlanActionResponse {
    success: boolean;
    message: string;
    data: {
        planId: UUID;
        newStatus: PlanStatus;
        action: string;
        timestamp: ISOString;
    };
}
