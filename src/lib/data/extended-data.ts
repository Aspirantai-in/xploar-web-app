import {
    CurrentAffairsArticle,
    DailyQuiz,
    CuratedResource,
    FlashcardDeck,
    Flashcard,
    MentorProfile,
    Webinar,
    ForumPost,
    StudyGroup
} from '@/lib/types';

// ... (other sample data remains the same)

// Mentor Data
export const SAMPLE_MENTORS: MentorProfile[] = [
    {
        id: "mentor_001",
        userId: "user_mentor_001",
        name: "Priya Sharma",
        imageUrl: "https://placehold.co/400x400/4AE3B5/0B0B0F?text=PS",
        headline: "AIR 15, CSE 2022 - Polity & Governance Expert",
        bio: "Former IAS officer with expertise in Constitutional Law and Public Administration. Helped 200+ aspirants clear UPSC.",
        expertise: ["polity_preamble", "polity_fr", "ethics_integrity"],
        hourlyRate: 2000,
        availabilitySlots: [
            "2025-08-20T10:00:00.000Z",
            "2025-08-20T15:00:00.000Z",
            "2025-08-21T09:00:00.000Z",
            "2025-08-21T16:00:00.000Z"
        ]
    },
    {
        id: "mentor_002",
        userId: "user_mentor_002",
        name: "Rahul Verma",
        imageUrl: "https://placehold.co/400x400/E879F9/0B0B0F?text=RV",
        headline: "AIR 8, CSE 2021 - Geography & Environment Specialist",
        bio: "Geography optional specialist with deep knowledge of climate change and environmental issues. Clear, concept-based teaching approach.",
        expertise: ["geog_monsoon", "env_bio"],
        hourlyRate: 1800,
        availabilitySlots: [
            "2025-08-20T11:00:00.000Z",
            "2025-08-20T17:00:00.000Z",
            "2025-08-22T10:00:00.000Z"
        ]
    },
    {
        id: "mentor_003",
        userId: "user_mentor_003",
        name: "Anjali Singh",
        imageUrl: "https://placehold.co/400x400/7C3AED/FFFFFF?text=AS",
        headline: "AIR 25, CSE 2023 - Economics & Current Affairs",
        bio: "Economics graduate from Delhi School of Economics. Specializes in making complex economic concepts simple and relatable.",
        expertise: ["econ_fiscal", "history_ivc"],
        hourlyRate: 1500,
        availabilitySlots: [
            "2025-08-20T14:00:00.000Z",
            "2025-08-21T11:00:00.000Z",
            "2025-08-22T15:00:00.000Z"
        ]
    }
];

// ... (other sample data remains the same)
// Current Affairs Data
export const SAMPLE_CURRENT_AFFAIRS: CurrentAffairsArticle[] = [
    {
        id: "ca_001",
        title: "New Education Policy Implementation Update",
        publicationDate: "2025-08-19T09:00:00.000Z",
        source: "PIB",
        summary: "Government announces key milestones in NEP 2020 implementation across states.",
        content: "The Ministry of Education today announced significant progress in the implementation of the National Education Policy 2020...",
        relevantTopicIds: ["polity_preamble", "polity_fr"],
        mediaType: "article"
    },
    {
        id: "ca_002",
        title: "Climate Change Impact on Monsoons",
        publicationDate: "2025-08-18T15:30:00.000Z",
        source: "The Hindu",
        summary: "Latest research shows shifting monsoon patterns due to global warming.",
        content: "Recent studies by the Indian Meteorological Department reveal concerning trends in monsoon behavior...",
        relevantTopicIds: ["geog_monsoon", "env_bio"],
        mediaType: "article"
    },
    {
        id: "ca_003",
        title: "ISRO's New Space Mission Launch",
        publicationDate: "2025-08-17T12:00:00.000Z",
        source: "Press Trust of India",
        summary: "India successfully launches advanced earth observation satellite.",
        content: "The Indian Space Research Organisation (ISRO) today successfully launched...",
        relevantTopicIds: ["sci_space"],
        mediaType: "infographic",
        mediaUrl: "/images/isro-mission-infographic.jpg"
    }
];

export const SAMPLE_DAILY_QUIZ: DailyQuiz = {
    id: "quiz_20250819",
    quizDate: "2025-08-19",
    title: "Daily Current Affairs Quiz",
    questions: [
        {
            question: "Which ministry announced the NEP 2020 implementation update?",
            options: ["Ministry of Education", "Ministry of HRD", "Ministry of Information", "Ministry of Culture"],
            correctAnswerIndex: 0,
            explanation: "The Ministry of Education is responsible for implementing the National Education Policy 2020."
        },
        {
            question: "What is the main concern regarding monsoon patterns mentioned in recent studies?",
            options: ["Increased rainfall", "Shifting patterns", "Early onset", "Reduced intensity"],
            correctAnswerIndex: 1,
            explanation: "Climate change is causing shifting monsoon patterns, affecting traditional weather cycles."
        },
        {
            question: "ISRO's recent launch was for which type of satellite?",
            options: ["Communication", "Navigation", "Earth observation", "Weather monitoring"],
            correctAnswerIndex: 2,
            explanation: "The recent ISRO launch was for an advanced earth observation satellite."
        }
    ]
};

// Digital Library Data
export const SAMPLE_CURATED_RESOURCES: CuratedResource[] = [
    {
        id: "res_001",
        title: "Constitution of India - Annotated",
        authorOrSource: "Government of India",
        type: "book",
        url: "https://example.com/constitution-annotated.pdf",
        description: "Complete annotated version of the Indian Constitution with explanations.",
        topicIds: ["polity_preamble", "polity_fr"]
    },
    {
        id: "res_002",
        title: "Climate Change and India",
        authorOrSource: "Ministry of Environment",
        type: "report",
        url: "https://example.com/climate-report.pdf",
        description: "Comprehensive report on climate change impacts on India.",
        topicIds: ["env_bio", "geog_monsoon"]
    },
    {
        id: "res_003",
        title: "Economic Survey 2024",
        authorOrSource: "Ministry of Finance",
        type: "report",
        url: "https://example.com/economic-survey-2024.pdf",
        description: "Annual economic survey highlighting fiscal policies and economic trends.",
        topicIds: ["econ_fiscal"]
    },
    {
        id: "res_004",
        title: "Space Technology Explained",
        authorOrSource: "ISRO Educational",
        type: "video",
        url: "https://youtube.com/watch?v=example",
        description: "Educational video series on space technology and satellite systems.",
        topicIds: ["sci_space"]
    }
];

// Flashcard Data
export const SAMPLE_FLASHCARD_DECKS: FlashcardDeck[] = [
    {
        id: "deck_001",
        title: "Fundamental Rights Essentials",
        description: "Key concepts and articles related to Fundamental Rights",
        topicId: "polity_fr",
        isOfficial: true
    },
    {
        id: "deck_002",
        title: "Geography Quick Facts",
        description: "Important geographical facts for quick revision",
        topicId: "geog_monsoon",
        isOfficial: true
    },
    {
        id: "deck_003",
        title: "Economic Terms",
        description: "Essential economic terminology and concepts",
        topicId: "econ_fiscal",
        isOfficial: true
    }
];

export const SAMPLE_FLASHCARDS: Flashcard[] = [
    {
        id: "card_001",
        deckId: "deck_001",
        front: "Which article guarantees Right to Equality?",
        back: "Article 14 - Right to Equality before law and equal protection of laws"
    },
    {
        id: "card_002",
        deckId: "deck_001",
        front: "What is Article 32 called?",
        back: "Heart and Soul of the Constitution - Right to Constitutional Remedies"
    },
    {
        id: "card_003",
        deckId: "deck_002",
        front: "When does SW monsoon reach Kerala?",
        back: "Usually around June 1st (1st June is considered the normal onset date)"
    },
    {
        id: "card_004",
        deckId: "deck_002",
        front: "What causes monsoon winds?",
        back: "Differential heating between land and sea masses creating seasonal wind patterns"
    },
    {
        id: "card_005",
        deckId: "deck_003",
        front: "What does FRBM Act stand for?",
        back: "Fiscal Responsibility and Budget Management Act - ensures fiscal discipline"
    },
    {
        id: "card_006",
        deckId: "deck_003",
        front: "What is fiscal deficit?",
        back: "Total expenditure minus total receipts excluding borrowings"
    }
];

// Webinar Data
export const SAMPLE_WEBINARS: Webinar[] = [
    {
        id: "webinar_001",
        title: "Cracking Polity: Fundamental Rights Deep Dive",
        hostId: "mentor_001",
        description: "Comprehensive session on Fundamental Rights with case studies and exam strategies.",
        scheduledTime: "2025-08-25T18:00:00.000Z",
        durationMins: 90,
        registrationLink: "https://zoom.us/webinar/register/example1"
    },
    {
        id: "webinar_002",
        title: "Climate Change & UPSC: Complete Coverage",
        hostId: "mentor_002",
        description: "Everything you need to know about climate change for UPSC preparation.",
        scheduledTime: "2025-08-27T19:00:00.000Z",
        durationMins: 120,
        registrationLink: "https://zoom.us/webinar/register/example2"
    },
    {
        id: "webinar_003",
        title: "Economic Survey 2024: Key Highlights",
        hostId: "mentor_003",
        description: "Detailed analysis of Economic Survey 2024 with focus on exam-relevant portions.",
        scheduledTime: "2025-08-30T17:30:00.000Z",
        durationMins: 75,
        registrationLink: "https://zoom.us/webinar/register/example3",
        recordingUrl: "https://zoom.us/rec/play/example3" // This one is recorded
    }
];

// Community Data
export const SAMPLE_FORUM_POSTS: ForumPost[] = [
    {
        id: "post_001",
        authorId: "user_001",
        topicId: "polity_fr",
        title: "Confusion about Article 19 restrictions",
        content: "Can someone explain the reasonable restrictions on freedom of speech and expression under Article 19(2)?",
        createdAt: "2025-08-18T10:30:00.000Z",
        isPinned: false,
        isLocked: false
    },
    {
        id: "post_002",
        authorId: "user_002",
        topicId: "geog_monsoon",
        title: "Best way to remember monsoon onset dates?",
        content: "I'm struggling to remember the exact dates when monsoon reaches different parts of India. Any memory techniques?",
        createdAt: "2025-08-17T14:20:00.000Z",
        isPinned: true,
        isLocked: false
    },
    {
        id: "post_003",
        authorId: "user_003",
        topicId: "econ_fiscal",
        title: "Fiscal vs Revenue Deficit - Simple explanation needed",
        content: "The concepts of fiscal deficit and revenue deficit are confusing me. Can someone break it down in simple terms?",
        createdAt: "2025-08-16T09:15:00.000Z",
        isPinned: false,
        isLocked: false
    }
];

export const SAMPLE_STUDY_GROUPS: StudyGroup[] = [
    {
        id: "group_001",
        name: "Polity Masters 2025",
        description: "Focused group for comprehensive polity preparation. Daily discussions and mock tests.",
        createdAt: "2025-08-01T10:00:00.000Z",
        adminId: "user_001",
        memberIds: ["user_001", "user_002", "user_003", "user_004", "user_005"]
    },
    {
        id: "group_002",
        name: "Geography Geeks",
        description: "For geography optional and general studies geography preparation.",
        createdAt: "2025-08-05T15:30:00.000Z",
        adminId: "user_002",
        memberIds: ["user_002", "user_006", "user_007", "user_008"]
    },
    {
        id: "group_003",
        name: "Current Affairs Daily",
        description: "Daily current affairs discussion and quiz. Stay updated together!",
        createdAt: "2025-08-10T08:00:00.000Z",
        adminId: "user_003",
        memberIds: ["user_003", "user_009", "user_010", "user_011", "user_012", "user_013"]
    }
];
