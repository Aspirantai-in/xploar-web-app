import { Question } from '@/lib/types';

export function calculateMockScore(
    questions: Question[],
    userAnswers: Record<string, number>,
    useNegativeMarking: boolean = true
): number {
    let score = 0;

    questions.forEach((question, index) => {
        const questionId = index.toString();
        const userAnswer = userAnswers[questionId];

        if (userAnswer === undefined) {
            // Not attempted - no points
            return;
        }

        if (userAnswer === question.ans) {
            // Correct answer
            score += 1;
        } else if (useNegativeMarking) {
            // Wrong answer with negative marking
            score -= 0.33;
        }
    });

    // Ensure score doesn't go below 0
    return Math.max(0, Math.round(score * 100) / 100);
}

export function calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

export function getPerformanceLevel(accuracy: number): string {
    if (accuracy >= 80) return 'Excellent';
    if (accuracy >= 65) return 'Good';
    if (accuracy >= 50) return 'Average';
    return 'Needs Improvement';
}