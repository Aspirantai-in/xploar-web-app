import { TopicID } from '@/lib/types';

export interface SyllabusSubTopic {
    id: TopicID;
    name: string;
}

export interface SyllabusTopic {
    id: TopicID;
    name: string;
    subTopics: SyllabusSubTopic[];
}

export interface SyllabusPaper {
    name: string;
    topics: SyllabusTopic[];
}

export const UPSC_SYLLABUS: Record<string, SyllabusPaper> = {
    "Prelims GS-I": {
        name: "Prelims General Studies Paper I",
        topics: [
            {
                id: "history", name: "History of India and Indian National Movement",
                subTopics: [
                    { id: "history_ivc", name: "Indus Valley Civilization" },
                    { id: "history_vedic", name: "Vedic Period" },
                    { id: "history_modern", name: "Modern Indian History (1757-1947)" }
                ]
            },
            {
                id: "polity", name: "Indian Polity and Governance",
                subTopics: [
                    { id: "polity_preamble", name: "Preamble & Features of Constitution" },
                    { id: "polity_fr", name: "Fundamental Rights & Duties" },
                    { id: "polity_parliament", name: "Parliament and State Legislatures" }
                ]
            },
            {
                id: "geography", name: "Indian and World Geography",
                subTopics: [
                    { id: "geog_physical", name: "Physical Geography" },
                    { id: "geog_monsoon", name: "Indian Monsoon System" },
                ]
            },
            {
                id: "economy", name: "Economic and Social Development",
                subTopics: [
                    { id: "econ_fiscal", name: "Fiscal Policy" },
                    { id: "econ_banking", name: "Banking & Monetary Policy" },
                ]
            },
        ]
    },
    "Prelims CSAT": {
        name: "Prelims CSAT Paper II",
        topics: [
            {
                id: "csat_comprehension", name: "Comprehension",
                subTopics: []
            },
            {
                id: "csat_reasoning", name: "Logical Reasoning and Analytical Ability",
                subTopics: []
            },
            {
                id: "csat_numeracy", name: "Basic Numeracy",
                subTopics: []
            },
        ]
    },
    "Mains GS-I": {
        name: "Mains General Studies Paper I",
        topics: [
            {
                id: "mains_gs1_art", name: "Indian Art and Culture",
                subTopics: []
            },
            {
                id: "mains_gs1_history", name: "Modern Indian History & Freedom Struggle",
                subTopics: []
            },
            {
                id: "mains_gs1_society", name: "Indian Society",
                subTopics: []
            },
        ]
    },
    "Mains GS-II": {
        name: "Mains General Studies Paper II",
        topics: [
            { id: "mains_gs2_governance", name: "Governance & Constitution", subTopics: [] },
            { id: "mains_gs2_social", name: "Social Justice", subTopics: [] },
            { id: "mains_gs2_ir", name: "International Relations", subTopics: [] },
        ]
    },
    "Mains GS-III": {
        name: "Mains General Studies Paper III",
        topics: [
            { id: "mains_gs3_tech", name: "Technology & Economic Development", subTopics: [] },
            { id: "mains_gs3_env", name: "Biodiversity & Environment", subTopics: [] },
            { id: "mains_gs3_security", name: "Security & Disaster Management", subTopics: [] },
        ]
    },
    "Mains GS-IV": {
        name: "Mains General Studies Paper IV",
        topics: [
            { id: "mains_gs4_ethics", name: "Ethics and Human Interface", subTopics: [] },
            { id: "mains_gs4_attitude", name: "Attitude & Foundational Values", subTopics: [] },
            { id: "mains_gs4_probity", name: "Probity in Governance", subTopics: [] },
        ]
    }
};
