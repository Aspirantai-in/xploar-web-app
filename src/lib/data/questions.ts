import { Question, TopicID } from '@/lib/types';

export const MCQ_BANK: Record<TopicID, Question[]> = {
    "polity_preamble": [
        {
            "stem": "Who gives the Preamble its authority?",
            "options": ["Parliament", "People of India", "Supreme Court", "President"],
            "ans": 1
        },
        {
            "stem": "The Preamble describes India as a what kind of republic?",
            "options": ["Federal", "Socialist Secular Democratic", "Parliamentary", "Constitutional"],
            "ans": 1
        },
        {
            "stem": "Which word was added to the Preamble by the 42nd Amendment?",
            "options": ["Socialist", "Secular", "Democratic", "Both Socialist and Secular"],
            "ans": 3
        },
        {
            "stem": "The Preamble is based on which resolution?",
            "options": ["Quit India", "Objectives Resolution", "Cabinet Mission", "Mountbatten Plan"],
            "ans": 1
        },
        {
            "stem": "Liberty of thought, expression, belief, faith and worship is mentioned in?",
            "options": ["Fundamental Rights", "Preamble", "DPSP", "Fundamental Duties"],
            "ans": 1
        }
    ],
    "polity_fr": [
        {
            "stem": "Fundamental Rights are enshrined in which Part of the Constitution?",
            "options": ["Part III", "Part IV", "Part V", "Part IX"],
            "ans": 0
        },
        {
            "stem": "Right to Constitutional Remedies is guaranteed under which Article?",
            "options": ["Article 30", "Article 31", "Article 32", "Article 33"],
            "ans": 2
        },
        {
            "stem": "Which Article guarantees Right to Equality?",
            "options": ["Article 12", "Article 13", "Article 14", "Article 15"],
            "ans": 2
        },
        {
            "stem": "Cultural and Educational Rights are given in Articles?",
            "options": ["29-30", "31-32", "25-28", "19-22"],
            "ans": 0
        },
        {
            "stem": "Which Article prohibits discrimination on grounds of religion, race, caste?",
            "options": ["Article 14", "Article 15", "Article 16", "Article 17"],
            "ans": 1
        }
    ],
    "history_ivc": [
        {
            "stem": "Harappan civilization belongs to which age?",
            "options": ["Paleolithic", "Mesolithic", "Neolithic", "Bronze Age"],
            "ans": 3
        },
        {
            "stem": "The Great Bath was found at which Harappan site?",
            "options": ["Harappa", "Mohenjodaro", "Dholavira", "Kalibangan"],
            "ans": 1
        },
        {
            "stem": "Harappan civilization was discovered in which year?",
            "options": ["1920", "1921", "1922", "1924"],
            "ans": 1
        },
        {
            "stem": "Which was the largest Harappan site?",
            "options": ["Harappa", "Mohenjodaro", "Dholavira", "Rakhigarhi"],
            "ans": 3
        },
        {
            "stem": "Harappan seals were mostly made of?",
            "options": ["Bronze", "Copper", "Steatite", "Gold"],
            "ans": 2
        }
    ],
    "geog_monsoon": [
        {
            "stem": "Southwest monsoon reaches Kerala in which month?",
            "options": ["May", "June", "July", "August"],
            "ans": 1
        },
        {
            "stem": "Which mountain range blocks northeast monsoon from reaching northern plains?",
            "options": ["Himalayas", "Western Ghats", "Eastern Ghats", "Aravalli"],
            "ans": 1
        },
        {
            "stem": "Tamil Nadu receives most rainfall from which monsoon?",
            "options": ["Southwest", "Northeast", "Western disturbances", "Cyclones"],
            "ans": 1
        },
        {
            "stem": "Which phenomenon is associated with monsoon failure?",
            "options": ["La Nina", "El Nino", "Indian Ocean Dipole", "All of these"],
            "ans": 3
        },
        {
            "stem": "Break in monsoon refers to?",
            "options": ["End of monsoon", "Temporary cessation", "Heavy rainfall", "Cyclonic activity"],
            "ans": 1
        }
    ],
    "econ_fiscal": [
        {
            "stem": "Fiscal policy is concerned with?",
            "options": ["Money supply", "Government expenditure and taxation", "Exchange rate", "All of these"],
            "ans": 1
        },
        {
            "stem": "Budget deficit means?",
            "options": ["Revenue > Expenditure", "Revenue < Expenditure", "Revenue = Expenditure", "None"],
            "ans": 1
        },
        {
            "stem": "Fiscal deficit is calculated as?",
            "options": ["Total expenditure - Total receipts", "Total expenditure - Total receipts excluding borrowings", "Revenue expenditure - Revenue receipts", "None"],
            "ans": 1
        },
        {
            "stem": "Primary deficit excludes?",
            "options": ["Interest payments", "Salary payments", "Subsidies", "Capital expenditure"],
            "ans": 0
        },
        {
            "stem": "FRBM Act stands for?",
            "options": ["Fiscal Responsibility Budget Management", "Financial Responsibility and Budget Management", "Fiscal Reform and Budget Management", "None"],
            "ans": 1
        }
    ],
    "env_bio": [
        {
            "stem": "Biodiversity hotspots are characterized by?",
            "options": ["High endemism", "High threat", "Both", "Neither"],
            "ans": 2
        },
        {
            "stem": "How many biodiversity hotspots are there in India?",
            "options": ["2", "3", "4", "5"],
            "ans": 2
        },
        {
            "stem": "Western Ghats is a biodiversity hotspot because of?",
            "options": ["High rainfall", "Endemic species", "Tropical climate", "All of these"],
            "ans": 3
        },
        {
            "stem": "Convention on Biological Diversity was signed in?",
            "options": ["1990", "1992", "1994", "1996"],
            "ans": 1
        },
        {
            "stem": "In-situ conservation includes?",
            "options": ["National Parks", "Botanical gardens", "Gene banks", "Zoos"],
            "ans": 0
        }
    ],
    "sci_space": [
        {
            "stem": "ISRO was established in which year?",
            "options": ["1969", "1970", "1971", "1972"],
            "ans": 0
        },
        {
            "stem": "India's first satellite was?",
            "options": ["Rohini", "Bhaskara", "Aryabhatta", "Apple"],
            "ans": 2
        },
        {
            "stem": "Chandrayaan-3 landed on which part of moon?",
            "options": ["North pole", "South pole", "Equator", "Far side"],
            "ans": 1
        },
        {
            "stem": "PSLV stands for?",
            "options": ["Polar Satellite Launch Vehicle", "Payload Satellite Launch Vehicle", "Primary Satellite Launch Vehicle", "None"],
            "ans": 0
        },
        {
            "stem": "India's Mars mission is called?",
            "options": ["Mangalyaan", "Mars Orbiter Mission", "Both", "None"],
            "ans": 2
        }
    ],
    "ethics_integrity": [
        {
            "stem": "Integrity means?",
            "options": ["Honesty", "Wholeness", "Both", "None"],
            "ans": 2
        },
        {
            "stem": "Ethical relativism suggests?",
            "options": ["Universal moral standards", "Context-dependent morality", "No morality", "Absolute ethics"],
            "ans": 1
        },
        {
            "stem": "Whistleblowing is an example of?",
            "options": ["Loyalty", "Integrity", "Obedience", "Conformity"],
            "ans": 1
        },
        {
            "stem": "Professional ethics are important because?",
            "options": ["Legal requirement", "Social responsibility", "Personal growth", "All of these"],
            "ans": 3
        },
        {
            "stem": "Conflict of interest arises when?",
            "options": ["Personal and professional interests clash", "Multiple roles", "Unclear guidelines", "All of these"],
            "ans": 3
        }
    ]
};