import { StudyConfig, PlanDay, Task, TaskID, TopicID } from '@/lib/types';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { addDaysToDate } from './dateUtils';

export function generateStudyPlan(config: StudyConfig): PlanDay[] {
    const plan: PlanDay[] = [];
    const topics = UPSC_FOUNDATION;

    for (let day = 1; day <= config.durationDays; day++) {
        const currentDate = addDaysToDate(config.startDate, day - 1);
        const topicIndex = (day - 1) % topics.length;
        const currentTopic = topics[topicIndex];

        // Calculate task durations
        const practiceMins = 60;
        const explainMins = 15;
        const recallMins = 10;
        const readMins = Math.max(30, (config.hoursPerDay * 60) - practiceMins - explainMins - recallMins);

        const tasks: Task[] = [
            {
                id: `task_${day}_read` as TaskID,
                topicId: currentTopic.id as TopicID,
                kind: "Read",
                durationMins: readMins,
                isDone: false,
            },
            {
                id: `task_${day}_practice` as TaskID,
                topicId: currentTopic.id as TopicID,
                kind: "Practice",
                durationMins: practiceMins,
                isDone: false,
            },
            {
                id: `task_${day}_explain` as TaskID,
                topicId: currentTopic.id as TopicID,
                kind: "Explain",
                durationMins: explainMins,
                isDone: false,
            },
            {
                id: `task_${day}_recall` as TaskID,
                topicId: currentTopic.id as TopicID,
                kind: "Recall",
                durationMins: recallMins,
                isDone: false,
            },
        ];

        plan.push({
            day,
            date: currentDate,
            tasks,
        });
    }

    return plan;
}
