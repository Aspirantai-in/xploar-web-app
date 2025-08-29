import { apiClient } from './client';
import { UserProfile, OnboardingData } from '@/lib/types';

export interface UserProfileUpdate {
    personalInfo?: {
        firstName?: string;
        lastName?: string;
        mobileNumber?: string;
        dateOfBirth?: string;
        gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    };
    academicInfo?: {
        currentEducation?: 'HIGH_SCHOOL' | 'UNDERGRADUATE' | 'GRADUATE' | 'POSTGRADUATE' | 'WORKING_PROFESSIONAL';
        fieldOfStudy?: string;
        institution?: string;
        graduationYear?: number;
        academicAchievements?: string[];
    };
    examInfo?: {
        targetExam?: string;
        examYear?: number;
        attemptNumber?: number;
        targetRank?: string;
    };
    preferences?: {
        timezone?: string;
        language?: string;
        notificationSettings?: {
            email?: boolean;
            sms?: boolean;
            push?: boolean;
            reminderTime?: string;
        };
        studyPreferences?: {
            preferredStudyTime?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
            breakDuration?: number;
            weeklyOffDays?: string[];
            aiRecommendations?: boolean;
        };
    };
}

export interface PasswordChange {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export class UserProfileService {
    async getUserProfile(): Promise<UserProfile | null> {
        try {
            const response = await apiClient.get('/api/user-profile');
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch user profile');
        }
    }

    async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
        try {
            const response = await apiClient.put('/api/user-profile', updates);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error('Failed to update profile');
        } catch (error) {
            throw this.handleError(error, 'Failed to update user profile');
        }
    }

    async completeOnboarding(onboardingData: OnboardingData): Promise<void> {
        try {
            // First update user profile with exam info
            await this.updateUserProfile({
                examInfo: {
                    targetExam: onboardingData.goal,
                    examYear: new Date().getFullYear() + 1,
                    attemptNumber: 1,
                },
                preferences: {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    language: 'en',
                    notificationSettings: {
                        email: true,
                        sms: false,
                        push: true,
                    },
                    studyPreferences: {
                        preferredStudyTime: onboardingData.studyPattern === 'MORNING_PERSON' ? 'MORNING' : 
                                           onboardingData.studyPattern === 'EVENING_PERSON' ? 'EVENING' : 'FLEXIBLE',
                        breakDuration: onboardingData.breakDuration,
                        weeklyOffDays: onboardingData.weeklyOffDays,
                        aiRecommendations: onboardingData.aiRecommendations,
                    },
                },
            });

            // Create study plan
            await apiClient.post('/api/study-planner/plans', {
                title: `${onboardingData.goal} Preparation`,
                description: `Study plan for ${onboardingData.goal}`,
                startDate: onboardingData.startDate,
                endDate: new Date(new Date(onboardingData.startDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                targetHoursPerDay: onboardingData.targetHoursPerDay,
                difficultyLevel: onboardingData.difficultyLevel,
                subjects: onboardingData.subjects,
                preferences: {
                    studyPattern: onboardingData.studyPattern,
                    breakDuration: onboardingData.breakDuration,
                    weeklyOffDays: onboardingData.weeklyOffDays,
                    aiRecommendations: onboardingData.aiRecommendations,
                },
            });
        } catch (error) {
            throw this.handleError(error, 'Failed to complete onboarding');
        }
    }

    async updateProfilePicture(imageFile: File) {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await apiClient.post('/api/user-profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to update profile picture');
        }
    }

    async changePassword(passwordData: PasswordChange) {
        try {
            const response = await apiClient.post('/api/user-profile/change-password', passwordData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to change password');
        }
    }

    private handleError(error: any, defaultMessage: string): Error {
        if (error.response?.data?.error?.message) {
            return new Error(error.response.data.error.message);
        }
        return new Error(error.message || defaultMessage);
    }
}

export const userProfileService = new UserProfileService();
