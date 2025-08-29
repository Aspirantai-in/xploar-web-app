import { apiClient } from './client';

export interface MentorSearchParams {
    topicIds?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    rating?: number;
    availability?: 'weekdays' | 'weekends' | 'anytime';
    priceRange?: 'low' | 'medium' | 'high';
    searchQuery?: string;
    page?: number;
    size?: number;
}

export interface MentorProfile {
    id: string;
    name: string;
    bio: string;
    expertise: string[];
    experience: number;
    rating: number;
    totalSessions: number;
    hourlyRate: number;
    availability: string[];
    languages: string[];
    achievements: string[];
    education: string[];
    certifications: string[];
}

export interface SessionBookingRequest {
    mentorId: string;
    topicId: string;
    sessionType: 'one_on_one' | 'group' | 'mock_interview';
    duration: number; // in minutes
    preferredDate: string;
    preferredTimeSlots: string[];
    sessionGoals: string;
    additionalNotes?: string;
}

export interface SessionRescheduleRequest {
    sessionId: string;
    newDate: string;
    newTimeSlot: string;
    reason?: string;
}

export interface SessionFeedback {
    sessionId: string;
    rating: number;
    feedback: string;
    topicsCovered: string[];
    improvementAreas: string[];
    wouldRecommend: boolean;
}

export interface MentorshipProgram {
    id: string;
    title: string;
    description: string;
    mentorId: string;
    topicIds: string[];
    duration: number; // in weeks
    totalSessions: number;
    price: number;
    maxStudents: number;
    currentStudents: number;
    startDate: string;
    endDate: string;
    syllabus: string[];
    requirements: string[];
}

export class MentorConnectService {
    // Mentor Discovery
    async searchMentors(params: MentorSearchParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.experienceLevel) queryParams.append('experienceLevel', params.experienceLevel);
            if (params.rating) queryParams.append('rating', params.rating.toString());
            if (params.availability) queryParams.append('availability', params.availability);
            if (params.priceRange) queryParams.append('priceRange', params.priceRange);
            if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/mentor-connect/search?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to search mentors');
        }
    }

    async getMentorProfile(mentorId: string) {
        try {
            const response = await apiClient.get(`/api/mentor-connect/mentors/${mentorId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mentor profile');
        }
    }

    async getMentorAvailability(mentorId: string, date: string) {
        try {
            const response = await apiClient.get(`/api/mentor-connect/mentors/${mentorId}/availability?date=${date}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mentor availability');
        }
    }

    async getMentorReviews(mentorId: string, params: {
        page?: number;
        size?: number;
        sortBy?: 'date' | 'rating';
        sortOrder?: 'asc' | 'desc';
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());
            if (params.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

            const url = `/api/mentor-connect/mentors/${mentorId}/reviews?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mentor reviews');
        }
    }

    // Session Booking
    async bookSession(bookingData: SessionBookingRequest) {
        try {
            const response = await apiClient.post('/api/mentor-connect/sessions/book', bookingData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to book session');
        }
    }

    async getAvailableTimeSlots(mentorId: string, date: string, duration: number) {
        try {
            const response = await apiClient.get(`/api/mentor-connect/sessions/available-slots?mentorId=${mentorId}&date=${date}&duration=${duration}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch available time slots');
        }
    }

    async getSessionDetails(sessionId: string) {
        try {
            const response = await apiClient.get(`/api/mentor-connect/sessions/${sessionId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch session details');
        }
    }

    async rescheduleSession(sessionId: string, rescheduleData: SessionRescheduleRequest) {
        try {
            const response = await apiClient.put(`/api/mentor-connect/sessions/${sessionId}/reschedule`, rescheduleData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to reschedule session');
        }
    }

    async cancelSession(sessionId: string, reason?: string) {
        try {
            const response = await apiClient.delete(`/api/mentor-connect/sessions/${sessionId}`, {
                data: { reason }
            });
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to cancel session');
        }
    }

    // Session Management
    async getUserSessions(params: {
        status?: 'upcoming' | 'completed' | 'cancelled';
        mentorId?: string;
        page?: number;
        size?: number;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.status) queryParams.append('status', params.status);
            if (params.mentorId) queryParams.append('mentorId', params.mentorId);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/mentor-connect/sessions/my-sessions?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch user sessions');
        }
    }

    async joinSession(sessionId: string) {
        try {
            const response = await apiClient.post(`/api/mentor-connect/sessions/${sessionId}/join`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to join session');
        }
    }

    async leaveSession(sessionId: string) {
        try {
            const response = await apiClient.post(`/api/mentor-connect/sessions/${sessionId}/leave`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to leave session');
        }
    }

    // Session Communication
    async getSessionChat(sessionId: string, params: {
        page?: number;
        size?: number;
        before?: string;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());
            if (params.before) queryParams.append('before', params.before);

            const url = `/api/mentor-connect/sessions/${sessionId}/chat?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch session chat');
        }
    }

    async sendSessionMessage(sessionId: string, message: string, messageType: 'text' | 'file' = 'text') {
        try {
            const response = await apiClient.post(`/api/mentor-connect/sessions/${sessionId}/chat`, {
                message,
                messageType,
                sentAt: new Date().toISOString()
            });
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to send session message');
        }
    }

    // Session Feedback
    async submitSessionFeedback(feedbackData: SessionFeedback) {
        try {
            const response = await apiClient.post('/api/mentor-connect/sessions/feedback', feedbackData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to submit session feedback');
        }
    }

    async getSessionFeedback(sessionId: string) {
        try {
            const response = await apiClient.get(`/api/mentor-connect/sessions/${sessionId}/feedback`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch session feedback');
        }
    }

    // Mentorship Programs
    async getMentorshipPrograms(params: {
        topicIds?: string[];
        mentorId?: string;
        priceRange?: 'low' | 'medium' | 'high';
        duration?: number;
        searchQuery?: string;
        page?: number;
        size?: number;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.mentorId) queryParams.append('mentorId', params.mentorId);
            if (params.priceRange) queryParams.append('priceRange', params.priceRange);
            if (params.duration) queryParams.append('duration', params.duration.toString());
            if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/mentor-connect/programs?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mentorship programs');
        }
    }

    async getProgramDetails(programId: string) {
        try {
            const response = await apiClient.get(`/api/mentor-connect/programs/${programId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch program details');
        }
    }

    async enrollInProgram(programId: string) {
        try {
            const response = await apiClient.post(`/api/mentor-connect/programs/${programId}/enroll`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to enroll in program');
        }
    }

    async getEnrolledPrograms(params: {
        status?: 'active' | 'completed' | 'cancelled';
        page?: number;
        size?: number;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.status) queryParams.append('status', params.status);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/mentor-connect/programs/enrolled?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch enrolled programs');
        }
    }

    // Mentor Requests
    async sendMentorRequest(mentorId: string, requestData: {
        message: string;
        topicIds: string[];
        preferredSchedule: string;
        goals: string;
    }) {
        try {
            const response = await apiClient.post(`/api/mentor-connect/mentors/${mentorId}/request`, requestData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to send mentor request');
        }
    }

    async getMentorRequests(params: {
        status?: 'pending' | 'accepted' | 'rejected';
        page?: number;
        size?: number;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.status) queryParams.append('status', params.status);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/mentor-connect/mentor-requests?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mentor requests');
        }
    }

    // Analytics & Insights
    async getMentorshipAnalytics(params: {
        timeRange?: 'week' | 'month' | 'quarter' | 'year';
        mentorId?: string;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.timeRange) queryParams.append('timeRange', params.timeRange);
            if (params.mentorId) queryParams.append('mentorId', params.mentorId);

            const url = `/api/mentor-connect/analytics?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch mentorship analytics');
        }
    }

    private handleError(error: any, defaultMessage: string): Error {
        if (error.response?.data?.error?.message) {
            return new Error(error.response.data.error.message);
        }
        return new Error(error.message || defaultMessage);
    }
}

export const mentorConnectService = new MentorConnectService();
