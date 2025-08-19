import { TopicID } from '@/lib/types';

export type TopicWeight = 'High' | 'Medium' | 'Low';

export interface SyllabusSubTopic {
    id: TopicID;
    name: string;
    weight: TopicWeight;
    why: string; // Why this topic is important for the exam
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
                    { id: "history_ivc", name: "Indus Valley Civilization", weight: 'Medium', why: 'Forms the basis of ancient history; questions often appear on art and culture.' },
                    { id: "history_vedic", name: "Vedic Period", weight: 'Medium', why: 'Crucial for understanding social and religious evolution in ancient India.' },
                    { id: "history_modern", name: "Modern Indian History (1757-1947)", weight: 'High', why: 'A significant portion of the history questions in Prelims and Mains come from this area.' }
                ]
            },
            {
                id: "polity", name: "Indian Polity and Governance",
                subTopics: [
                    { id: "polity_preamble", name: "Preamble & Features of Constitution", weight: 'Medium', why: 'Core philosophical foundation of the Indian constitution; essential for essay and ethics papers.' },
                    { id: "polity_fr", name: "Fundamental Rights & Duties", weight: 'High', why: 'Frequently tested area in both Prelims and Mains, forms the bedrock of Indian democracy.' },
                    { id: "polity_parliament", name: "Parliament and State Legislatures", weight: 'High', why: 'Understanding the functioning of the legislature is critical for governance questions.' }
                ]
            },
            {
                id: "geography", name: "Indian and World Geography",
                subTopics: [
                    { id: "geog_physical", name: "Physical Geography", weight: 'Medium', why: 'Fundamental concepts that apply across various environmental and geographical topics.' },
                    { id: "geog_monsoon", name: "Indian Monsoon System", weight: 'High', why: 'Directly impacts Indian economy and agriculture; a favorite topic for Mains.' },
                ]
            },
            {
                id: "economy", name: "Economic and Social Development",
                subTopics: [
                    { id: "econ_fiscal", name: "Fiscal Policy", weight: 'High', why: 'Core of economic policy, directly related to budget, taxation, and government spending.' },
                    { id: "econ_banking", name: "Banking & Monetary Policy", weight: 'High', why: 'Crucial for understanding inflation, banking reforms, and RBI\'s role.' },
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
