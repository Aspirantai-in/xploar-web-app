import { apiClient } from './client';

export interface StudyGroupParams {
    topicIds?: string[];
    searchQuery?: string;
    page?: number;
    size?: number;
}

export interface StudyGroupCreate {
    name: string;
    description: string;
    topicIds: string[];
    isPrivate?: boolean;
    maxMembers?: number;
}

export interface StudyGroupUpdate {
    name?: string;
    description?: string;
    topicIds?: string[];
    isPrivate?: boolean;
    maxMembers?: number;
}

export interface ForumPostParams {
    topicIds?: string[];
    searchQuery?: string;
    sortBy?: 'date' | 'relevance' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    size?: number;
}

export interface ForumPostCreate {
    title: string;
    content: string;
    topicIds: string[];
    tags?: string[];
}

export interface ForumReplyCreate {
    content: string;
    parentPostId?: string;
}

export interface PeerReviewParams {
    status?: 'pending_review' | 'reviewed' | 'closed';
    topicIds?: string[];
    page?: number;
    size?: number;
}

export interface PeerReviewSubmission {
    submissionId: string;
    feedback: string;
    rubricScores: {
        structure: number;
        contentClarity: number;
        relevance: number;
    };
}

export class CommunityService {
    // Study Groups
    async getStudyGroups(params: StudyGroupParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/community/study-groups?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch study groups');
        }
    }

    async getStudyGroupDetails(groupId: string) {
        try {
            const response = await apiClient.get(`/api/community/study-groups/${groupId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch study group details');
        }
    }

    async createStudyGroup(groupData: StudyGroupCreate) {
        try {
            const response = await apiClient.post('/api/community/study-groups', groupData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to create study group');
        }
    }

    async updateStudyGroup(groupId: string, updates: StudyGroupUpdate) {
        try {
            const response = await apiClient.put(`/api/community/study-groups/${groupId}`, updates);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to update study group');
        }
    }

    async joinStudyGroup(groupId: string) {
        try {
            const response = await apiClient.post(`/api/community/study-groups/${groupId}/join`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to join study group');
        }
    }

    async leaveStudyGroup(groupId: string) {
        try {
            const response = await apiClient.post(`/api/community/study-groups/${groupId}/leave`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to leave study group');
        }
    }

    async getGroupMembers(groupId: string) {
        try {
            const response = await apiClient.get(`/api/community/study-groups/${groupId}/members`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch group members');
        }
    }

    // Group Chat
    async getGroupChatMessages(groupId: string, params: {
        page?: number;
        size?: number;
        before?: string;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());
            if (params.before) queryParams.append('before', params.before);

            const url = `/api/community/study-groups/${groupId}/chat?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch chat messages');
        }
    }

    async sendGroupChatMessage(groupId: string, message: string) {
        try {
            const response = await apiClient.post(`/api/community/study-groups/${groupId}/chat`, {
                message,
                sentAt: new Date().toISOString()
            });
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to send chat message');
        }
    }

    // Discussion Forums
    async getForumPosts(params: ForumPostParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
            if (params.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/community/forums/posts?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch forum posts');
        }
    }

    async getForumPost(postId: string) {
        try {
            const response = await apiClient.get(`/api/community/forums/posts/${postId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch forum post');
        }
    }

    async createForumPost(postData: ForumPostCreate) {
        try {
            const response = await apiClient.post('/api/community/forums/posts', postData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to create forum post');
        }
    }

    async updateForumPost(postId: string, updates: Partial<ForumPostCreate>) {
        try {
            const response = await apiClient.put(`/api/community/forums/posts/${postId}`, updates);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to update forum post');
        }
    }

    async deleteForumPost(postId: string) {
        try {
            const response = await apiClient.delete(`/api/community/forums/posts/${postId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to delete forum post');
        }
    }

    // Forum Replies
    async getForumReplies(postId: string, params: {
        page?: number;
        size?: number;
        sortBy?: 'date' | 'relevance';
        sortOrder?: 'asc' | 'desc';
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());
            if (params.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

            const url = `/api/community/forums/posts/${postId}/replies?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch forum replies');
        }
    }

    async replyToForumPost(postId: string, replyData: ForumReplyCreate) {
        try {
            const response = await apiClient.post(`/api/community/forums/posts/${postId}/replies`, replyData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to reply to forum post');
        }
    }

    // Peer Review
    async getSubmissionsToReview(params: PeerReviewParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.status) queryParams.append('status', params.status);
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/community/peer-review/submissions?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch submissions to review');
        }
    }

    async getSubmissionDetails(submissionId: string) {
        try {
            const response = await apiClient.get(`/api/community/peer-review/submissions/${submissionId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch submission details');
        }
    }

    async submitPeerReview(submissionId: string, reviewData: PeerReviewSubmission) {
        try {
            const response = await apiClient.post(`/api/community/peer-review/submissions/${submissionId}/review`, reviewData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to submit peer review');
        }
    }

    async getUserSubmissions(params: {
        status?: 'pending_review' | 'reviewed' | 'closed';
        topicIds?: string[];
        page?: number;
        size?: number;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.status) queryParams.append('status', params.status);
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/community/peer-review/my-submissions?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch user submissions');
        }
    }

    async createSubmission(submissionData: {
        questionText: string;
        answerText: string;
        topicId: string;
    }) {
        try {
            const response = await apiClient.post('/api/community/peer-review/submissions', submissionData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to create submission');
        }
    }

    // Leaderboard
    async getLeaderboard(params: {
        timeRange?: 'week' | 'month' | 'quarter' | 'year';
        category?: 'overall' | 'topics' | 'streaks';
        topicId?: string;
        page?: number;
        size?: number;
    } = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.timeRange) queryParams.append('timeRange', params.timeRange);
            if (params.category) queryParams.append('category', params.category);
            if (params.topicId) queryParams.append('topicId', params.topicId);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/community/leaderboard?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch leaderboard');
        }
    }

    private handleError(error: any, defaultMessage: string): Error {
        if (error.response?.data?.error?.message) {
            return new Error(error.response.data.error.message);
        }
        return new Error(error.message || defaultMessage);
    }
}

export const communityService = new CommunityService();
