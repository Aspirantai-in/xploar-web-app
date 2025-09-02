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

export interface ProfilePictureResponse {
    profilePictureUrl: string;
}

export class UserProfileService {
    async getUserProfile(): Promise<UserProfile | null> {
        try {
            const response = await apiClient.get<UserProfile>('/api/user-profile');
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch user profile');
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch user profile');
        }
    }

    async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
        try {
            const response = await apiClient.put<UserProfile>('/api/user-profile', updates);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update profile');
            }
            return response.data;
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
                            onboardingData.studyPattern === 'EVENING_PERSON' ? 'EVENING' : 'AFTERNOON',
                        breakDuration: onboardingData.breakDuration,
                        weeklyOffDays: onboardingData.weeklyOffDays,
                        aiRecommendations: onboardingData.aiRecommendations,
                    },
                },
            });

            // Create study plan - Updated to only include fields that exist in backend API
            await apiClient.post('/api/study-planner/plans', {
                title: `${onboardingData.goal} Preparation`,
                description: `Study plan for ${onboardingData.goal}`,
                startDate: onboardingData.startDate,
                endDate: new Date(new Date(onboardingData.startDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                targetHoursPerDay: onboardingData.targetHoursPerDay,
                difficultyLevel: onboardingData.difficultyLevel,
                subjects: {
                    mandatory: onboardingData.subjects.mandatory,
                    optional: onboardingData.subjects.optional,
                    // Removed: languages - not in backend API
                },
                // Removed: preferences - not in backend API
                // Removed: aiMetadata - not in backend API
            });
        } catch (error) {
            throw this.handleError(error, 'Failed to complete onboarding');
        }
    }

    async updateProfilePicture(imageFile: File): Promise<ProfilePictureResponse> {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            // Don't set Content-Type header for FormData - browser will set it automatically with boundary
            const response = await apiClient.post<ProfilePictureResponse>('/api/user-profile/picture', formData);

            if (!response.success) {
                throw new Error(response.message || 'Failed to update profile picture');
            }

            return response.data;
        } catch (error) {
            throw this.handleError(error, 'Failed to update profile picture');
        }
    }

    async changePassword(passwordData: PasswordChange): Promise<void> {
        try {
            const response = await apiClient.post<void>('/api/user-profile/change-password', passwordData);

            if (!response.success) {
                throw new Error(response.message || 'Failed to change password');
            }
        } catch (error) {
            throw this.handleError(error, 'Failed to change password');
        }
    }

    private handleError(error: unknown, defaultMessage: string): Error {
        if (error && typeof error === 'object' && 'response' in error) {
            const responseError = error as { response?: { data?: { error?: { message?: string } } } };
            if (responseError.response?.data?.error?.message) {
                return new Error(responseError.response.data.error.message);
            }
        }
        return new Error(error instanceof Error ? error.message : defaultMessage);
    }
}

export const userProfileService = new UserProfileService();
