import { useState, useEffect, useCallback } from 'react';
import { studyPlannerService } from '@/lib/api/study-planner';
import { StudyPlan, PlanStatus, CreateStudyPlanRequest } from '@/lib/types/study-planner';

export function useStudyPlans() {
    const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
    const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStudyPlans = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await studyPlannerService.listStudyPlans({
                status: PlanStatus.ACTIVE,
                sortBy: 'createdDate',
                sortOrder: 'DESC'
            });

            if (response && response.content) {
                setStudyPlans(response.content);

                // Set the first active plan as current plan
                if (response.content.length > 0) {
                    setCurrentPlan(response.content[0]);
                }
            } else {
                setError('Failed to load study plans');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load study plans';
            setError(errorMessage);
            console.error('Error loading study plans:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createStudyPlan = useCallback(async (planData: CreateStudyPlanRequest) => {
        try {
            setError(null);
            const response = await studyPlannerService.createStudyPlan(planData);

            if (response.success && response.data) {
                // Reload plans after creation
                await loadStudyPlans();
                return response;
            } else {
                throw new Error(response.message || 'Failed to create study plan');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create study plan';
            setError(errorMessage);
            throw err;
        }
    }, [loadStudyPlans]);

    const updateStudyPlan = useCallback(async (planId: string, updates: Partial<StudyPlan>) => {
        try {
            setError(null);
            const response = await studyPlannerService.updateStudyPlan(planId, updates);

            if (response.success && response.data) {
                // Update local state
                setStudyPlans(prev => prev.map(plan =>
                    plan.planId === planId ? { ...plan, ...updates } : plan
                ));

                if (currentPlan?.planId === planId) {
                    setCurrentPlan(prev => prev ? { ...prev, ...updates } : null);
                }

                return response;
            } else {
                throw new Error(response.message || 'Failed to update study plan');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update study plan';
            setError(errorMessage);
            throw err;
        }
    }, [currentPlan]);

    const selectStudyPlan = useCallback((plan: StudyPlan | null) => {
        setCurrentPlan(plan);
    }, []);

    useEffect(() => {
        loadStudyPlans();
    }, [loadStudyPlans]);

    return {
        studyPlans,
        currentPlan,
        isLoading,
        error,
        loadStudyPlans,
        createStudyPlan,
        updateStudyPlan,
        selectStudyPlan,
        setCurrentPlan: selectStudyPlan
    };
}
