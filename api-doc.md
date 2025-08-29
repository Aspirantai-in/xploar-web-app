# Xploar Backend API Documentation v2.0

## Overview
Comprehensive API documentation for the Xploar Backend system, featuring the Study Planner, User Profile, and Authentication modules with updated data types and modern REST API standards.

**Base URL:** `https://api.xploar.ai` (Production) | `http://localhost:8080` (Development)  
**API Version:** v2.0  
**Authentication:** Bearer Token (JWT) required for all protected endpoints  
**Content-Type:** `application/json`

---

## Table of Contents
1. [Authentication & Security](#authentication--security)
2. [Study Planner APIs](#study-planner-apis)
3. [User Profile APIs](#user-profile-apis)
4. [Progress Tracking APIs](#progress-tracking-apis)
5. [Data Models & Enums](#data-models--enums)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Webhooks & Events](#webhooks--events)

---

## Authentication & Security

### Base Path: `/api/auth`

#### JWT Token Structure
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "uuid",
    "iss": "xploar.ai",
    "aud": "xploar-users",
    "exp": 1735689600,
    "iat": 1735603200,
    "roles": ["USER", "PREMIUM"],
    "permissions": ["STUDY_PLAN_CREATE", "TASK_MANAGE"]
  }
}
```

#### 1. User Registration
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123!",
  "mobileNumber": "+911234567890",
  "countryCode": "+91",
  "preferences": {
    "timezone": "Asia/Kolkata",
    "language": "en",
    "notificationSettings": {
      "email": true,
      "sms": true,
      "push": false
    }
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": false,
    "isMobileVerified": false,
    "verificationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-01-01T12:00:00Z"
  },
  "timestamp": "2025-01-01T10:00:00Z",
  "requestId": "req_123456789"
}
```

#### 2. User Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "deviceInfo": {
    "deviceId": "device_123",
    "deviceType": "MOBILE",
    "os": "Android",
    "osVersion": "13.0"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["USER"],
      "permissions": ["STUDY_PLAN_CREATE", "TASK_MANAGE"],
      "lastLoginAt": "2025-01-01T10:00:00Z"
    }
  }
}
```

#### 3. Token Refresh
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

## Study Planner APIs

### Base Path: `/api/study-planner`

#### Study Plan Management

##### 1. Create Study Plan
```http
POST /api/study-planner/plans
```

**Request Body:**
```json
{
  "title": "UPSC CSE 2025 Preparation",
  "description": "Comprehensive preparation plan for UPSC Civil Services Examination 2025",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "targetHoursPerDay": 8,
  "difficultyLevel": "ADVANCED",
  "subjects": {
    "mandatory": ["GENERAL_STUDIES_1", "GENERAL_STUDIES_2", "ESSAY"],
    "optional": ["HISTORY", "GEOGRAPHY"],
    "languages": ["HINDI", "ENGLISH"]
  },
  "preferences": {
    "studyPattern": "MORNING_PERSON",
    "breakDuration": 15,
    "weeklyOffDays": ["SUNDAY"],
    "aiRecommendations": true
  },
  "aiMetadata": {
    "learningStyle": "VISUAL",
    "strengthAreas": ["HISTORY", "GEOGRAPHY"],
    "weaknessAreas": ["MATHEMATICS", "SCIENCE"]
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Study plan created successfully",
  "data": {
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "UPSC CSE 2025 Preparation",
    "status": "ACTIVE",
    "totalDays": 365,
    "targetHoursPerDay": 8,
    "difficultyLevel": "ADVANCED",
    "createdDate": "2025-01-01T10:00:00Z",
    "aiGeneratedTasks": 0,
    "estimatedCompletionDate": "2025-12-31T23:59:59Z"
  }
}
```

##### 2. Get Study Plan
```http
GET /api/study-planner/plans/{planId}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "UPSC CSE 2025 Preparation",
    "description": "Comprehensive preparation plan for UPSC Civil Services Examination 2025",
    "status": "ACTIVE",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "targetHoursPerDay": 8,
    "difficultyLevel": "ADVANCED",
    "totalDays": 365,
    "completedDays": 45,
    "completionPercentage": 12.3,
    "subjects": {
      "mandatory": ["GENERAL_STUDIES_1", "GENERAL_STUDIES_2", "ESSAY"],
      "optional": ["HISTORY", "GEOGRAPHY"],
      "languages": ["HINDI", "ENGLISH"]
    },
    "preferences": {
      "studyPattern": "MORNING_PERSON",
      "breakDuration": 15,
      "weeklyOffDays": ["SUNDAY"],
      "aiRecommendations": true
    },
    "aiMetadata": {
      "learningStyle": "VISUAL",
      "strengthAreas": ["HISTORY", "GEOGRAPHY"],
      "weaknessAreas": ["MATHEMATICS", "SCIENCE"]
    },
    "createdDate": "2025-01-01T10:00:00Z",
    "updatedDate": "2025-02-15T14:30:00Z",
    "version": 3
  }
}
```

##### 3. Update Study Plan
```http
PUT /api/study-planner/plans/{planId}
```

**Request Body:**
```json
{
  "title": "UPSC CSE 2025 Preparation - Updated",
  "targetHoursPerDay": 10,
  "preferences": {
    "studyPattern": "EVENING_PERSON",
    "breakDuration": 20
  }
}
```

##### 4. List Study Plans
```http
GET /api/study-planner/plans?page=0&size=10&status=ACTIVE&sortBy=createdDate&sortOrder=DESC
```

**Query Parameters:**
- `page` (int): Page number (0-based)
- `size` (int): Page size (1-100)
- `status` (enum): Filter by plan status
- `sortBy` (string): Sort field
- `sortOrder` (string): ASC or DESC

#### Task Management

##### 1. Create Task
```http
POST /api/study-planner/tasks
```

**Request Body:**
```json
{
  "title": "Read NCERT History Chapter 1",
  "description": "Complete reading of NCERT History textbook Chapter 1 - Ancient India",
  "taskType": "READING",
  "subjectArea": "HISTORY",
  "subject": "Ancient Indian History",
  "priority": "HIGH",
  "estimatedDurationMinutes": 120,
  "dueDate": "2025-01-15",
  "dueTime": "14:00",
  "scheduledStartTime": "09:00",
  "scheduledEndTime": "11:00",
  "isMandatory": true,
  "isRecurring": false,
  "taskMetadata": {
    "source": "NCERT Class 6-12",
    "chapter": "Chapter 1",
    "pageRange": "1-25",
    "keyTopics": ["Indus Valley", "Vedic Period", "Mauryan Empire"]
  },
  "resources": {
    "books": ["NCERT History Class 6", "NCERT History Class 7"],
    "videos": ["https://youtube.com/watch?v=abc123"],
    "notes": ["https://drive.google.com/file/d/xyz"]
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Read NCERT History Chapter 1",
    "status": "PENDING",
    "priority": "HIGH",
    "estimatedDurationMinutes": 120,
    "dueDate": "2025-01-15",
    "scheduledStartTime": "09:00",
    "scheduledEndTime": "11:00",
    "createdDate": "2025-01-01T10:00:00Z",
    "canBeStarted": true,
    "canBeCompleted": false,
    "canBeDeferred": true
  }
}
```

##### 2. Get Task
```http
GET /api/study-planner/tasks/{taskId}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "studyPlanId": "550e8400-e29b-41d4-a716-446655440001",
    "dailyPlanId": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Read NCERT History Chapter 1",
    "description": "Complete reading of NCERT History textbook Chapter 1 - Ancient India",
    "taskType": "READING",
    "subjectArea": "HISTORY",
    "subject": "Ancient Indian History",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "estimatedDurationMinutes": 120,
    "actualDurationMinutes": 45,
    "dueDate": "2025-01-15",
    "dueTime": "14:00",
    "scheduledStartTime": "09:00",
    "scheduledEndTime": "11:00",
    "actualStartTime": "2025-01-01T09:00:00Z",
    "actualEndTime": null,
    "completionPercentage": 37.5,
    "difficultyRating": 3,
    "satisfactionRating": null,
    "deferCount": 0,
    "maxDeferrals": 3,
    "isRecurring": false,
    "isActive": true,
    "isMandatory": true,
    "isOverdue": false,
    "canBeStarted": false,
    "canBeCompleted": true,
    "canBeDeferred": true,
    "taskMetadata": {
      "source": "NCERT Class 6-12",
      "chapter": "Chapter 1",
      "pageRange": "1-25",
      "keyTopics": ["Indus Valley", "Vedic Period", "Mauryan Empire"]
    },
    "progressData": {
      "pagesRead": 9,
      "timeSpent": 45,
      "notesTaken": true,
      "questionsAnswered": 0
    },
    "resources": {
      "books": ["NCERT History Class 6", "NCERT History Class 7"],
      "videos": ["https://youtube.com/watch?v=abc123"],
      "notes": ["https://drive.google.com/file/d/xyz"]
    },
    "dependencyTaskIds": [],
    "version": 2
  }
}
```

##### 3. Update Task
```http
PUT /api/study-planner/tasks/{taskId}
```

**Request Body:**
```json
{
  "title": "Read NCERT History Chapter 1 - Updated",
  "estimatedDurationMinutes": 150,
  "priority": "CRITICAL",
  "taskMetadata": {
    "source": "NCERT Class 6-12",
    "chapter": "Chapter 1",
    "pageRange": "1-30",
    "keyTopics": ["Indus Valley", "Vedic Period", "Mauryan Empire", "Gupta Empire"]
  }
}
```

##### 4. Start Task
```http
POST /api/study-planner/tasks/{taskId}/start
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task started successfully",
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "IN_PROGRESS",
    "actualStartTime": "2025-01-01T10:00:00Z",
    "canBeCompleted": true,
    "canBeDeferred": true
  }
}
```

##### 5. Complete Task
```http
POST /api/study-planner/tasks/{taskId}/complete
```

**Request Body:**
```json
{
  "actualDurationMinutes": 135,
  "completionPercentage": 100.0,
  "difficultyRating": 3,
  "satisfactionRating": 4,
  "notes": "Completed reading with detailed notes on key historical events",
  "progressData": {
    "pagesRead": 25,
    "timeSpent": 135,
    "notesTaken": true,
    "questionsAnswered": 15,
    "keyPoints": ["Indus Valley Civilization", "Vedic Literature", "Mauryan Administration"]
  }
}
```

##### 6. Defer Task
```http
POST /api/study-planner/tasks/{taskId}/defer
```

**Request Body:**
```json
{
  "reason": "Need more time to understand complex concepts",
  "deferToDate": "2025-01-20",
  "deferToTime": "14:00"
}
```

##### 7. List Tasks
```http
GET /api/study-planner/tasks?page=0&size=20&status=PENDING&priority=HIGH&subjectArea=HISTORY&sortBy=dueDate&sortOrder=ASC
```

**Query Parameters:**
- `page` (int): Page number (0-based)
- `size` (int): Page size (1-100)
- `status` (enum): Filter by task status
- `priority` (enum): Filter by priority
- `subjectArea` (enum): Filter by subject area
- `taskType` (enum): Filter by task type
- `dueDate` (date): Filter by due date
- `sortBy` (string): Sort field
- `sortOrder` (string): ASC or DESC

#### Daily Plan Management

##### 1. Get Daily Plan
```http
GET /api/study-planner/daily/{date}
```

**Path Parameter:**
- `date` (string): Date in YYYY-MM-DD format

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "dailyPlanId": "550e8400-e29b-41d4-a716-446655440000",
    "planDate": "2025-01-15",
    "studyPlanId": "550e8400-e29b-41d4-a716-446655440001",
    "targetHours": 8,
    "completedHours": 6.5,
    "completionPercentage": 81.25,
    "status": "IN_PROGRESS",
    "isCompleted": false,
    "totalTasks": 12,
    "completedTasks": 8,
    "pendingTasks": 3,
    "deferredTasks": 1,
    "tasks": [
      {
        "taskId": "550e8400-e29b-41d4-a716-446655440002",
        "title": "Read NCERT History Chapter 1",
        "taskType": "READING",
        "subjectArea": "HISTORY",
        "status": "COMPLETED",
        "priority": "HIGH",
        "estimatedDurationMinutes": 120,
        "actualDurationMinutes": 135,
        "completionPercentage": 100.0
      }
    ],
    "dailyNotes": {
      "morning": "Started with History reading, feeling focused",
      "afternoon": "Completed MCQ practice, need to review weak areas",
      "evening": "Planning tomorrow's schedule"
    },
    "performanceMetrics": {
      "focusScore": 8.5,
      "productivity": 85.0,
      "energyLevel": "HIGH",
      "distractions": 2
    },
    "createdDate": "2025-01-15T00:00:00Z",
    "updatedDate": "2025-01-15T18:30:00Z"
  }
}
```

##### 2. Get Today's Plan
```http
GET /api/study-planner/daily/today
```

##### 3. Complete Day
```http
POST /api/study-planner/daily/{date}/complete
```

**Request Body:**
```json
{
  "notes": "Productive day overall, completed most tasks as planned",
  "performanceMetrics": {
    "focusScore": 8.5,
    "productivity": 85.0,
    "energyLevel": "HIGH",
    "distractions": 2,
    "mood": "SATISFIED",
    "challenges": "Some difficulty with complex historical concepts"
  },
  "tomorrowGoals": [
    "Start Geography chapter",
    "Practice essay writing",
    "Review today's notes"
  ]
}
```

##### 4. Navigate Daily Plans
```http
GET /api/study-planner/daily/navigate?direction=NEXT&currentDate=2025-01-15
```

**Query Parameters:**
- `direction` (string): NEXT, PREVIOUS, or SPECIFIC
- `currentDate` (date): Current date for navigation
- `targetDate` (date): Target date (required for SPECIFIC direction)

---

## Progress Tracking APIs

### Base Path: `/api/study-planner/progress`

#### 1. Overall Progress
```http
GET /api/study-planner/progress/overall
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "overallStats": {
      "totalStudyPlans": 3,
      "activeStudyPlans": 2,
      "completedStudyPlans": 1,
      "totalTasks": 156,
      "completedTasks": 89,
      "pendingTasks": 45,
      "deferredTasks": 22,
      "overallCompletion": 57.1
    },
    "timeStats": {
      "totalStudyTime": 2840,
      "averageDailyStudyTime": 6.2,
      "longestStudySession": 180,
      "totalStudyDays": 45,
      "currentStreak": 7,
      "longestStreak": 15
    },
    "subjectProgress": {
      "HISTORY": {
        "completedTasks": 25,
        "totalTasks": 40,
        "completionPercentage": 62.5,
        "timeSpent": 450,
        "strength": "HIGH"
      },
      "GEOGRAPHY": {
        "completedTasks": 18,
        "totalTasks": 35,
        "completionPercentage": 51.4,
        "timeSpent": 320,
        "strength": "MEDIUM"
      }
    },
    "performanceTrends": {
      "weeklyProgress": [45, 52, 48, 61, 58, 65, 57],
      "monthlyProgress": [42, 51, 58, 62],
      "improvementRate": 12.5
    },
    "achievements": [
      {
        "id": "achievement_1",
        "name": "First Week Complete",
        "description": "Completed first week of study plan",
        "earnedDate": "2025-01-07T23:59:59Z",
        "icon": "🎯"
      }
    ],
    "lastUpdated": "2025-01-15T18:30:00Z"
  }
}
```

#### 2. Study Plan Progress
```http
GET /api/study-planner/progress/study-plan/{planId}
```

#### 3. Subject Progress
```http
GET /api/study-planner/progress/subject/{subjectArea}?timeRange=MONTH
```

**Query Parameters:**
- `timeRange` (string): DAY, WEEK, MONTH, QUARTER, YEAR

#### 4. Streak Information
```http
GET /api/study-planner/progress/streaks
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentStreak": {
      "days": 7,
      "startDate": "2025-01-09",
      "endDate": "2025-01-15",
      "type": "DAILY_STUDY",
      "isActive": true
    },
    "longestStreak": {
      "days": 15,
      "startDate": "2024-12-20",
      "endDate": "2025-01-03",
      "type": "DAILY_STUDY"
    },
    "streakHistory": [
      {
        "startDate": "2025-01-09",
        "endDate": "2025-01-15",
        "days": 7,
        "type": "DAILY_STUDY"
      }
    ],
    "streakTypes": {
      "DAILY_STUDY": {
        "current": 7,
        "longest": 15,
        "total": 45
      },
      "WEEKLY_GOALS": {
        "current": 2,
        "longest": 4,
        "total": 12
      }
    }
  }
}
```

#### 5. Performance Analytics
```http
GET /api/study-planner/progress/analytics?timeRange=MONTH&metrics=focus,productivity,energy
```

**Query Parameters:**
- `timeRange` (string): DAY, WEEK, MONTH, QUARTER, YEAR
- `metrics` (string): Comma-separated list of metrics

---

## User Profile APIs

### Base Path: `/api/user-profile`

#### 1. Get User Profile
```http
GET /api/user-profile
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "mobileNumber": "+911234567890",
      "dateOfBirth": "1995-06-15",
      "gender": "MALE",
      "profilePicture": "https://cdn.xploar.ai/profiles/user_123.jpg"
    },
    "academicInfo": {
      "currentEducation": "GRADUATE",
      "fieldOfStudy": "Computer Science",
      "institution": "Delhi University",
      "graduationYear": 2018,
      "academicAchievements": ["First Class", "University Rank 5"]
    },
    "examInfo": {
      "targetExam": "UPSC_CSE",
      "examYear": 2025,
      "attemptNumber": 1,
      "previousAttempts": [],
      "targetRank": "Top 100"
    },
    "preferences": {
      "timezone": "Asia/Kolkata",
      "language": "en",
      "notificationSettings": {
        "email": true,
        "sms": true,
        "push": true,
        "reminderTime": "08:00"
      },
      "studyPreferences": {
        "preferredStudyTime": "MORNING",
        "breakDuration": 15,
        "weeklyOffDays": ["SUNDAY"],
        "aiRecommendations": true
      }
    },
    "subscription": {
      "plan": "PREMIUM",
      "startDate": "2025-01-01",
      "endDate": "2025-12-31",
      "features": ["AI_PLANS", "PROGRESS_ANALYTICS", "PRIORITY_SUPPORT"],
      "isActive": true
    },
    "createdDate": "2025-01-01T10:00:00Z",
    "lastUpdated": "2025-01-15T14:30:00Z"
  }
}
```

#### 2. Update User Profile
```http
PUT /api/user-profile
```

**Request Body:**
```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Smith"
  },
  "preferences": {
    "studyPreferences": {
      "preferredStudyTime": "EVENING",
      "breakDuration": 20
    }
  }
}
```

#### 3. Update Profile Picture
```http
POST /api/user-profile/picture
```

**Request Body:** Multipart form data with image file

#### 4. Change Password
```http
POST /api/user-profile/change-password
```

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

---

## Data Models & Enums

### Core Data Types

#### UUID
- **Type:** `string`
- **Format:** RFC 4122 UUID v4
- **Example:** `"550e8400-e29b-41d4-a716-446655440000"`

#### DateTime
- **Type:** `string`
- **Format:** ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- **Example:** `"2025-01-15T14:30:00Z"`

#### Date
- **Type:** `string`
- **Format:** ISO 8601 (YYYY-MM-DD)
- **Example:** `"2025-01-15"`

#### Time
- **Type:** `string`
- **Format:** 24-hour (HH:mm)
- **Example:** `"14:30"`

### Enums

#### TaskType
```json
{
  "READING": "Study material reading",
  "PRACTICE_MCQ": "Multiple choice question practice",
  "ESSAY_WRITING": "Essay composition and writing",
  "REVISION": "Review and revision of studied material",
  "MOCK_TEST": "Full-length mock test simulation",
  "VIDEO_LECTURE": "Educational video content",
  "NOTE_MAKING": "Creating and organizing study notes",
  "GROUP_DISCUSSION": "Collaborative study and discussion",
  "CURRENT_AFFAIRS": "Current events and news analysis",
  "CUSTOM": "User-defined custom study task"
}
```

#### TaskStatus
```json
{
  "PENDING": "Task is created but not started",
  "IN_PROGRESS": "Task is currently being worked on",
  "COMPLETED": "Task has been completed successfully",
  "DEFERRED": "Task has been deferred to another time",
  "SKIPPED": "Task has been skipped",
  "CANCELLED": "Task has been cancelled",
  "BLOCKED": "Task is blocked by dependencies"
}
```

#### TaskPriority
```json
{
  "CRITICAL": "Must be completed immediately (Weight: 90)",
  "HIGH": "Important tasks requiring prompt attention (Weight: 75)",
  "MEDIUM": "Standard priority for regular study tasks (Weight: 50)",
  "LOW": "Can be deferred if higher priority tasks pending (Weight: 25)",
  "OPTIONAL": "Optional enhancement tasks, not mandatory (Weight: 10)"
}
```

#### SubjectArea
```json
{
  "GENERAL_STUDIES_1": "History, Geography, Polity, Economics",
  "GENERAL_STUDIES_2": "Aptitude, Reasoning, Current Affairs",
  "ESSAY": "Essay Writing",
  "HISTORY": "History Optional",
  "GEOGRAPHY": "Geography Optional",
  "POLITICAL_SCIENCE": "Political Science Optional",
  "ECONOMICS": "Economics Optional",
  "MATHEMATICS": "Mathematics Optional",
  "PHYSICS": "Physics Optional",
  "CHEMISTRY": "Chemistry Optional",
  "CURRENT_AFFAIRS": "Current Affairs and News Analysis",
  "ANSWER_WRITING": "Answer Writing Practice"
}
```

#### PlanStatus
```json
{
  "DRAFT": "Plan is in draft mode",
  "ACTIVE": "Plan is currently active",
  "PAUSED": "Plan is temporarily paused",
  "COMPLETED": "Plan has been completed",
  "ARCHIVED": "Plan has been archived"
}
```

#### DayStatus
```json
{
  "PENDING": "Day plan is pending",
  "IN_PROGRESS": "Day plan is in progress",
  "COMPLETED": "Day plan has been completed",
  "SKIPPED": "Day plan has been skipped"
}
```

#### DifficultyLevel
```json
{
  "BEGINNER": "Suitable for beginners",
  "INTERMEDIATE": "Suitable for intermediate learners",
  "ADVANCED": "Suitable for advanced learners",
  "EXPERT": "Suitable for expert level"
}
```

### Request/Response Models

#### Pagination
```json
{
  "page": 0,
  "size": 20,
  "totalElements": 156,
  "totalPages": 8,
  "first": true,
  "last": false,
  "numberOfElements": 20
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  },
  "timestamp": "2025-01-15T14:30:00Z",
  "requestId": "req_123456789"
}
```

---

## Error Handling

### HTTP Status Codes

- **200 OK:** Request successful
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource conflict
- **422 Unprocessable Entity:** Validation error
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Server error

### Error Codes

```json
{
  "AUTHENTICATION_FAILED": "Invalid credentials",
  "TOKEN_EXPIRED": "Authentication token has expired",
  "INSUFFICIENT_PERMISSIONS": "User lacks required permissions",
  "VALIDATION_ERROR": "Request data validation failed",
  "RESOURCE_NOT_FOUND": "Requested resource not found",
  "RESOURCE_CONFLICT": "Resource conflicts with existing data",
  "RATE_LIMIT_EXCEEDED": "Too many requests, please try again later",
  "INTERNAL_SERVER_ERROR": "An unexpected error occurred"
}
```

---

## Rate Limiting

### Limits
- **Authenticated Users:** 1000 requests per hour
- **Premium Users:** 5000 requests per hour
- **Guest Users:** 100 requests per hour

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

---

## Webhooks & Events

### Event Types
```json
{
  "TASK_COMPLETED": "Task completion event",
  "STREAK_UPDATED": "Streak update event",
  "GOAL_ACHIEVED": "Goal achievement event",
  "PLAN_COMPLETED": "Study plan completion event",
  "REMINDER_TRIGGERED": "Reminder notification event"
}
```

### Webhook Payload
```json
{
  "event": "TASK_COMPLETED",
  "timestamp": "2025-01-15T14:30:00Z",
  "data": {
    "taskId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "completionTime": "2025-01-15T14:30:00Z"
  }
}
```

---

## SDKs & Libraries

### Official SDKs
- **JavaScript/TypeScript:** `@xploar/sdk-js`
- **Python:** `xploar-python-sdk`
- **Java:** `com.xploar.sdk`
- **Swift:** `XploarSDK`
- **Kotlin:** `com.xploar.sdk.kotlin`

### Community Libraries
- **React:** `react-xploar`
- **Vue:** `vue-xploar`
- **Flutter:** `xploar_flutter`
- **React Native:** `react-native-xploar`

---

## Support & Resources

### Documentation
- **API Reference:** https://docs.xploar.ai/api
- **SDK Documentation:** https://docs.xploar.ai/sdk
- **Integration Guides:** https://docs.xploar.ai/integrations

### Support Channels
- **Email:** api-support@xploar.ai
- **Discord:** https://discord.gg/xploar
- **GitHub Issues:** https://github.com/xploar/backend/issues

### Status Page
- **Service Status:** https://status.xploar.ai
- **API Health:** https://api.xploar.ai/health

---

*Last Updated: January 15, 2025*  
*API Version: v2.0*  
*Documentation Version: 2.0.0*
