import { ContentHubService as ApiContentHubService } from '../api/content-hub';
import { ValidationUtils } from '../utils/validation';
import { StorageUtils } from '../utils/storage';
import { DateUtils } from '../utils/date';

export class ContentHubService {
  private static instance: ContentHubService;
  private apiService: ApiContentHubService;

  private constructor() {
    this.apiService = new ApiContentHubService();
  }

  public static getInstance(): ContentHubService {
    if (!ContentHubService.instance) {
      ContentHubService.instance = new ContentHubService();
    }
    return ContentHubService.instance;
  }

  /**
   * Get current affairs
   */
  async getCurrentAffairs(category?: string, limit?: number) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_current_affairs_${category || 'all'}_${limit || 'default'}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getCurrentAffairs(category, limit);
      if (response.success && response.data) {
        // Cache the current affairs
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch current affairs');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get daily quiz
   */
  async getDailyQuiz(date?: string) {
    try {
      const quizDate = date || new Date().toISOString().split('T')[0];
      
      // Try to get from cache first
      const cacheKey = `xploar_daily_quiz_${quizDate}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getDailyQuiz(quizDate);
      if (response.success && response.data) {
        // Cache the daily quiz
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch daily quiz');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit daily quiz answer
   */
  async submitDailyQuizAnswer(quizId: string, answers: Record<string, string>) {
    try {
      const response = await this.apiService.submitDailyQuizAnswer(quizId, answers);
      if (response.success && response.data) {
        // Cache the quiz result
        const cacheKey = `xploar_quiz_result_${quizId}`;
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to submit quiz answers');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get digital library resources
   */
  async getDigitalLibraryResources(filters?: {
    subject?: string;
    type?: 'pdf' | 'video' | 'audio' | 'interactive';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    search?: string;
  }) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_digital_library_${JSON.stringify(filters || {})}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getDigitalLibraryResources(filters);
      if (response.success && response.data) {
        // Cache the resources
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch digital library resources');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get flashcards for a subject
   */
  async getFlashcards(subject: string, topic?: string) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_flashcards_${subject}_${topic || 'all'}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getFlashcards(subject, topic);
      if (response.success && response.data) {
        // Cache the flashcards
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch flashcards');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new flashcard
   */
  async createFlashcard(flashcardData: {
    subject: string;
    topic: string;
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags?: string[];
  }) {
    try {
      // Validate flashcard data
      const validation = this.validateFlashcardData(flashcardData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.createFlashcard(flashcardData);
      if (response.success && response.data) {
        // Clear cache for this subject/topic to refresh data
        const cacheKey = `xploar_flashcards_${flashcardData.subject}_${flashcardData.topic}`;
        StorageUtils.sessionStorage.remove(cacheKey);
        return response;
      }
      throw new Error(response.message || 'Failed to create flashcard');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a flashcard
   */
  async updateFlashcard(flashcardId: string, updates: {
    question?: string;
    answer?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  }) {
    try {
      const response = await this.apiService.updateFlashcard(flashcardId, updates);
      if (response.success && response.data) {
        // Clear related caches to refresh data
        this.clearFlashcardCaches();
        return response;
      }
      throw new Error(response.message || 'Failed to update flashcard');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a flashcard
   */
  async deleteFlashcard(flashcardId: string) {
    try {
      const response = await this.apiService.deleteFlashcard(flashcardId);
      if (response.success) {
        // Clear related caches to refresh data
        this.clearFlashcardCaches();
        return response;
      }
      throw new Error(response.message || 'Failed to delete flashcard');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user notes
   */
  async getUserNotes(subject?: string, topic?: string) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_user_notes_${subject || 'all'}_${topic || 'all'}`;
      const cached = StorageUtils.localStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getUserNotes(subject, topic);
      if (response.success && response.data) {
        // Cache the notes
        StorageUtils.localStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch user notes');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new note
   */
  async createNote(noteData: {
    subject: string;
    topic: string;
    title: string;
    content: string;
    tags?: string[];
    attachments?: File[];
  }) {
    try {
      // Validate note data
      const validation = this.validateNoteData(noteData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.createNote(noteData);
      if (response.success && response.data) {
        // Clear cache for this subject/topic to refresh data
        const cacheKey = `xploar_user_notes_${noteData.subject}_${noteData.topic}`;
        StorageUtils.localStorage.remove(cacheKey);
        return response;
      }
      throw new Error(response.message || 'Failed to create note');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a note
   */
  async updateNote(noteId: string, updates: {
    title?: string;
    content?: string;
    tags?: string[];
  }) {
    try {
      const response = await this.apiService.updateNote(noteId, updates);
      if (response.success && response.data) {
        // Clear related caches to refresh data
        this.clearNoteCaches();
        return response;
      }
      throw new Error(response.message || 'Failed to update note');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string) {
    try {
      const response = await this.apiService.deleteNote(noteId);
      if (response.success) {
        // Clear related caches to refresh data
        this.clearNoteCaches();
        return response;
      }
      throw new Error(response.message || 'Failed to delete note');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search content
   */
  async searchContent(query: string, filters?: {
    type?: 'current-affairs' | 'quiz' | 'library' | 'flashcards' | 'notes';
    subject?: string;
    dateRange?: { start: string; end: string };
  }) {
    try {
      if (!query.trim()) {
        throw new Error('Search query is required');
      }

      const response = await this.apiService.searchContent(query, filters);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(response.message || 'Failed to search content');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get content recommendations
   */
  async getContentRecommendations(userId: string, limit: number = 10) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_content_recommendations_${userId}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached.slice(0, limit) };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getContentRecommendations(userId, limit);
      
      // For now, generate mock recommendations
      const mockRecommendations = this.generateMockContentRecommendations(limit);
      
      // Cache the recommendations
      StorageUtils.sessionStorage.set(cacheKey, mockRecommendations);
      return { success: true, data: mockRecommendations.slice(0, limit) };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark content as favorite
   */
  async toggleFavorite(contentId: string, contentType: string) {
    try {
      // Update local favorites cache
      const favorites = StorageUtils.localStorage.get('xploar_favorites') || [];
      const existingIndex = favorites.findIndex((fav: any) => 
        fav.contentId === contentId && fav.contentType === contentType
      );

      if (existingIndex !== -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
      } else {
        // Add to favorites
        favorites.push({
          contentId,
          contentType,
          addedAt: new Date().toISOString(),
        });
      }

      StorageUtils.localStorage.set('xploar_favorites', favorites);

      // In a real app, you would also send this to the API
      // await this.apiService.toggleFavorite(contentId, contentType);
      
      return { 
        success: true, 
        data: { 
          isFavorite: existingIndex === -1,
          favorites 
        } 
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user favorites
   */
  async getUserFavorites() {
    try {
      const favorites = StorageUtils.localStorage.get('xploar_favorites') || [];
      return { success: true, data: favorites };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate flashcard data
   */
  private validateFlashcardData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!data.topic.trim()) {
      errors.topic = 'Topic is required';
    }

    if (!data.question.trim()) {
      errors.question = 'Question is required';
    }

    if (!data.answer.trim()) {
      errors.answer = 'Answer is required';
    }

    if (!['easy', 'medium', 'hard'].includes(data.difficulty)) {
      errors.difficulty = 'Invalid difficulty level';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate note data
   */
  private validateNoteData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!data.topic.trim()) {
      errors.topic = 'Topic is required';
    }

    if (!data.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!data.content.trim()) {
      errors.content = 'Content is required';
    }

    if (data.attachments && data.attachments.length > 5) {
      errors.attachments = 'Maximum 5 attachments allowed';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Clear flashcard caches
   */
  private clearFlashcardCaches() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('xploar_flashcards_')) {
        StorageUtils.sessionStorage.remove(key);
      }
    });
  }

  /**
   * Clear note caches
   */
  private clearNoteCaches() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('xploar_user_notes_')) {
        StorageUtils.localStorage.remove(key);
      }
    });
  }

  /**
   * Generate mock content recommendations
   */
  private generateMockContentRecommendations(limit: number) {
    const recommendations = [
      {
        id: 'rec_1',
        type: 'current-affairs',
        title: 'Latest Developments in Quantum Computing',
        description: 'Stay updated with the latest breakthroughs in quantum computing technology',
        subject: 'Physics',
        relevance: 95,
        estimatedTime: 15,
      },
      {
        id: 'rec_2',
        type: 'quiz',
        title: 'Advanced Mathematics Challenge',
        description: 'Test your skills with complex mathematical problems',
        subject: 'Mathematics',
        relevance: 88,
        estimatedTime: 30,
      },
      {
        id: 'rec_3',
        type: 'library',
        title: 'Comprehensive Biology Study Guide',
        description: 'Complete study material covering all biology topics',
        subject: 'Biology',
        relevance: 82,
        estimatedTime: 120,
      },
      {
        id: 'rec_4',
        type: 'flashcards',
        title: 'Chemistry Formulas Quick Review',
        description: 'Essential chemical formulas and equations',
        subject: 'Chemistry',
        relevance: 78,
        estimatedTime: 20,
      },
      {
        id: 'rec_5',
        type: 'notes',
        title: 'Historical Timeline Summary',
        description: 'Key historical events and their significance',
        subject: 'History',
        relevance: 75,
        estimatedTime: 45,
      },
    ];

    return recommendations.slice(0, limit);
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || 'Content hub operation failed');
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const contentHubService = ContentHubService.getInstance();
