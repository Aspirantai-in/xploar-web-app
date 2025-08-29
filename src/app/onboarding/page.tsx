'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { OnboardingData } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { studyPlannerService, StudyPlanData } from '@/lib/api/study-planner';
import {
  Target,
  Calendar,
  Clock,
  BookOpen,
  Sun,
  Coffee,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BarChart
} from 'lucide-react';

// Import existing onboarding components
import { GoalScreen } from '@/components/features/onboarding/GoalScreen';
import { TimeScreen } from '@/components/features/onboarding/TimeScreen';
import { BaselineScreen } from '@/components/features/onboarding/BaselineScreen';
import { GeneratingPlanScreen } from '@/components/features/onboarding/GeneratingPlanScreen';

const ONBOARDING_STEPS = [
  {
    id: 'goal',
    title: 'What is your goal?',
    description: 'Tell us what you want to achieve',
    icon: Target,
  },
  {
    id: 'schedule',
    title: 'Study Schedule',
    description: 'Set your study timeline and daily hours',
    icon: Calendar,
  },
  {
    id: 'subjects',
    title: 'Subjects & Topics',
    description: 'Choose what you want to study',
    icon: BookOpen,
  },
  {
    id: 'preferences',
    title: 'Study Preferences',
    description: 'Customize your learning experience',
    icon: Settings,
  },
  {
    id: 'baseline',
    title: 'Current Level',
    description: 'Assess your preparation level',
    icon: BarChart,
  },
  {
    id: 'generating',
    title: 'Creating Your Plan',
    description: 'We\'re crafting your personalized study plan',
    icon: Settings,
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    goal: '',
    startDate: new Date().toISOString().split('T')[0],
    targetHoursPerDay: 4,
    difficultyLevel: 'INTERMEDIATE',
    subjects: {
      mandatory: [],
      optional: [],
      languages: [],
    },
    studyPattern: 'MORNING_PERSON',
    breakDuration: 15,
    weeklyOffDays: ['SUNDAY'],
    aiRecommendations: true,
  });

  const { completeOnboarding, isLoading } = useAuth();
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
    setError(null); // Clear any previous errors
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (onboardingData.goal && onboardingData.startDate && onboardingData.targetHoursPerDay) {
      try {
        setIsCreatingPlan(true);
        setError(null);

        // Prepare data for API
        const planData: StudyPlanData = {
          title: `${onboardingData.goal} Preparation Plan`,
          description: `Personalized study plan for ${onboardingData.goal}`,
          startDate: onboardingData.startDate!,
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from start
          targetHoursPerDay: onboardingData.targetHoursPerDay!,
          difficultyLevel: onboardingData.difficultyLevel!,
          subjects: {
            mandatory: onboardingData.subjects?.mandatory || [],
            optional: onboardingData.subjects?.optional || [],
            languages: onboardingData.subjects?.languages || [],
          },
          preferences: {
            studyPattern: onboardingData.studyPattern!,
            breakDuration: onboardingData.breakDuration!,
            weeklyOffDays: onboardingData.weeklyOffDays!,
            aiRecommendations: onboardingData.aiRecommendations!,
          },
        };

        // Create study plan via API
        const response = await studyPlannerService.createStudyPlan(planData);

        if (response.success) {
          // Complete onboarding in auth context
          await completeOnboarding(onboardingData as OnboardingData);

          // Navigate to next step (generating plan)
          nextStep();
        } else {
          throw new Error(response.message || 'Failed to create study plan');
        }
      } catch (error) {
        console.error('Study plan creation error:', error);
        setError(error instanceof Error ? error.message : 'Failed to create study plan');
      } finally {
        setIsCreatingPlan(false);
      }
    }
  };

  const handlePlanGenerationComplete = () => {
    // Navigate to dashboard or study planner
    window.location.href = '/dashboard';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <GoalStep data={onboardingData} onUpdate={updateOnboardingData} />;
      case 1:
        return <ScheduleStep data={onboardingData} onUpdate={updateOnboardingData} />;
      case 2:
        return <SubjectsStep data={onboardingData} onUpdate={updateOnboardingData} />;
      case 3:
        return <PreferencesStep data={onboardingData} onUpdate={updateOnboardingData} />;
      case 4:
        return <BaselineStep data={onboardingData} onUpdate={updateOnboardingData} />;
      case 5:
        return <GeneratingPlanScreen onComplete={handlePlanGenerationComplete} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Something went wrong</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setError(null)} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-white">X</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Let's personalize your learning journey
          </h1>
          <p className="text-lg text-gray-600">
            We'll ask you a few questions to create the perfect study plan for you
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-2 ${isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isCompleted
                    ? 'bg-green-100 border-green-600'
                    : isCurrent
                      ? 'bg-blue-100 border-blue-600'
                      : 'bg-gray-100 border-gray-300'
                    }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center max-w-20">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {ONBOARDING_STEPS[currentStep].title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {ONBOARDING_STEPS[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === ONBOARDING_STEPS.length - 2 ? (
            <Button
              onClick={handleComplete}
              disabled={isCreatingPlan || !onboardingData.goal}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isCreatingPlan ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating your plan...
                </div>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : currentStep < ONBOARDING_STEPS.length - 2 ? (
            <Button
              onClick={nextStep}
              disabled={!onboardingData.goal}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Step Components - Now using your existing components
function GoalStep({ data, onUpdate }: { data: Partial<OnboardingData>; onUpdate: (data: Partial<OnboardingData>) => void }) {
  const handleGoalSelect = (goal: string) => {
    onUpdate({ goal });
  };

  const handleNext = () => {
    // This will be handled by the parent component
  };

  return (
    <div className="max-w-2xl mx-auto">
      <GoalScreen
        onNext={handleNext}
        externalData={{ goal: data.goal }}
        onGoalSelect={handleGoalSelect}
      />
    </div>
  );
}

function ScheduleStep({ data, onUpdate }: { data: Partial<OnboardingData>; onUpdate: (data: Partial<OnboardingData>) => void }) {
  const handleDataUpdate = (updates: { targetHoursPerDay?: number; startDate?: string; difficultyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" }) => {
    onUpdate(updates);
  };

  const handleNext = () => {
    // This will be handled by the parent component
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TimeScreen
        onNext={handleNext}
        externalData={{
          targetHoursPerDay: data.targetHoursPerDay,
          startDate: data.startDate,
          difficultyLevel: data.difficultyLevel
        }}
        onDataUpdate={handleDataUpdate}
      />
    </div>
  );
}


function SubjectsStep({ data, onUpdate }: { data: Partial<OnboardingData>; onUpdate: (data: Partial<OnboardingData>) => void }) {
  const mandatorySubjects = [
    'GENERAL_STUDIES_1',
    'GENERAL_STUDIES_2',
    'ESSAY',
    'HISTORY',
    'GEOGRAPHY',
    'POLITICAL_SCIENCE',
    'ECONOMICS',
    'MATHEMATICS',
    'PHYSICS',
    'CHEMISTRY',
  ];

  const languages = ['HINDI', 'ENGLISH', 'SANSKRIT', 'FRENCH', 'GERMAN'];

  const toggleSubject = (subject: string, category: 'mandatory' | 'optional' | 'languages') => {
    const currentSubjects = data.subjects?.[category] || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];

    onUpdate({
      subjects: {
        ...data.subjects,
        [category]: newSubjects,
      } as OnboardingData['subjects'],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select mandatory subjects
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mandatorySubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => toggleSubject(subject, 'mandatory')}
              className={`p-3 text-left rounded-lg border-2 transition-all ${data.subjects?.mandatory?.includes(subject)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">{subject.replace(/_/g, ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select languages (optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => toggleSubject(language, 'languages')}
              className={`p-3 text-left rounded-lg border-2 transition-all ${data.subjects?.languages?.includes(language)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">{language}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreferencesStep({ data, onUpdate }: { data: Partial<OnboardingData>; onUpdate: (data: Partial<OnboardingData>) => void }) {
  const studyPatterns = [
    { id: 'MORNING_PERSON', label: 'Morning Person', icon: Sun, description: 'I prefer studying early in the day' },
    { id: 'EVENING_PERSON', label: 'Evening Person', icon: Coffee, description: 'I prefer studying in the evening' },
    { id: 'FLEXIBLE', label: 'Flexible', icon: Clock, description: 'I can study at any time' },
  ];

  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  const toggleWeekDay = (day: string) => {
    const currentDays = data.weeklyOffDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];

    onUpdate({ weeklyOffDays: newDays });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's your preferred study pattern?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studyPatterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <button
                key={pattern.id}
                onClick={() => onUpdate({ studyPattern: pattern.id as any })}
                className={`p-4 text-center rounded-lg border-2 transition-all ${data.studyPattern === pattern.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">{pattern.label}</div>
                <div className="text-sm text-gray-600">{pattern.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How long should your study breaks be?
        </label>
        <select
          value={data.breakDuration}
          onChange={(e) => onUpdate({ breakDuration: parseInt(e.target.value) })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        >
          {[5, 10, 15, 20, 25, 30].map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutes
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Which days would you like to take off?
        </label>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => toggleWeekDay(day)}
              className={`p-3 text-center rounded-lg border-2 transition-all text-sm ${data.weeklyOffDays?.includes(day)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={data.aiRecommendations}
            onChange={(e) => onUpdate({ aiRecommendations: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable AI-powered study recommendations and adaptive learning
          </span>
        </label>
      </div>
    </div>
  );
}

function BaselineStep({ data, onUpdate }: { data: Partial<OnboardingData>; onUpdate: (data: Partial<OnboardingData>) => void }) {
  const handleDataUpdate = (updates: { difficultyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" }) => {
    onUpdate(updates);
  };

  const handleNext = () => {
    // This will be handled by the parent component
  };

  return (
    <div className="max-w-2xl mx-auto">
      <BaselineScreen
        onNext={handleNext}
        externalData={{ difficultyLevel: data.difficultyLevel }}
        onDataUpdate={handleDataUpdate}
      />
    </div>
  );
}
