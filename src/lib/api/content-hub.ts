import { apiClient } from './client';

export interface CurrentAffairsParams {
    date?: string;
    topicIds?: string[];
    mediaType?: 'article' | 'mindmap' | 'infographic';
    page?: number;
    size?: number;
}

export interface DailyQuizParams {
    date?: string;
    topicIds?: string[];
}

export interface DigitalLibraryParams {
    topicIds?: string[];
    resourceType?: 'book' | 'report' | 'website' | 'video';
    searchQuery?: string;
    page?: number;
    size?: number;
}

export interface FlashcardParams {
    deckId?: string;
    topicId?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export class ContentHubService {
    // Current Affairs
    async getCurrentAffairs(params: CurrentAffairsParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.date) queryParams.append('date', params.date);
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.mediaType) queryParams.append('mediaType', params.mediaType);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/content/current-affairs?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch current affairs');
        }
    }

    async getCurrentAffairsArticle(articleId: string) {
        try {
            const response = await apiClient.get(`/api/content/current-affairs/${articleId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch article');
        }
    }

    // Daily Quiz
    async getDailyQuiz(params: DailyQuizParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.date) queryParams.append('date', params.date);
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));

            const url = `/api/content/daily-quiz?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch daily quiz');
        }
    }

    async submitQuizAttempt(quizId: string, answers: Record<number, number>) {
        try {
            const response = await apiClient.post(`/api/content/daily-quiz/${quizId}/attempt`, {
                answers,
                submittedAt: new Date().toISOString()
            });
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to submit quiz attempt');
        }
    }

    // Digital Library
    async getCuratedResources(params: DigitalLibraryParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicIds) queryParams.append('topicIds', params.topicIds.join(','));
            if (params.resourceType) queryParams.append('resourceType', params.resourceType);
            if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.size) queryParams.append('size', params.size.toString());

            const url = `/api/content/curated-resources?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch curated resources');
        }
    }

    async getResourceDetails(resourceId: string) {
        try {
            const response = await apiClient.get(`/api/content/curated-resources/${resourceId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch resource details');
        }
    }

    // Flashcards
    async getFlashcardDecks(params: FlashcardParams = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.topicId) queryParams.append('topicId', params.topicId);
            if (params.difficulty) queryParams.append('difficulty', params.difficulty);

            const url = `/api/content/flashcard-decks?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch flashcard decks');
        }
    }

    async getFlashcardsForDeck(deckId: string) {
        try {
            const response = await apiClient.get(`/api/content/flashcard-decks/${deckId}/flashcards`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch flashcards');
        }
    }

    async updateFlashcardReview(cardId: string, performance: 'easy' | 'good' | 'hard') {
        try {
            const response = await apiClient.post(`/api/content/flashcards/${cardId}/review`, {
                performance,
                reviewedAt: new Date().toISOString()
            });
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to update flashcard review');
        }
    }

    // User Notes
    async createUserNote(noteData: {
        title: string;
        content?: string;
        topicIds: string[];
        fileUrl?: string;
        fileType?: 'pdf' | 'docx' | 'jpg';
    }) {
        try {
            const response = await apiClient.post('/api/content/user-notes', noteData);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to create note');
        }
    }

    async getUserNotes(topicIds?: string[]) {
        try {
            const queryParams = new URLSearchParams();
            if (topicIds) queryParams.append('topicIds', topicIds.join(','));

            const url = `/api/content/user-notes?${queryParams.toString()}`;
            const response = await apiClient.get(url);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to fetch user notes');
        }
    }

    async updateUserNote(noteId: string, updates: Partial<{
        title: string;
        content: string;
        topicIds: string[];
    }>) {
        try {
            const response = await apiClient.put(`/api/content/user-notes/${noteId}`, updates);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to update note');
        }
    }

    async deleteUserNote(noteId: string) {
        try {
            const response = await apiClient.delete(`/api/content/user-notes/${noteId}`);
            return response;
        } catch (error) {
            throw this.handleError(error, 'Failed to delete note');
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

export const contentHubService = new ContentHubService();
