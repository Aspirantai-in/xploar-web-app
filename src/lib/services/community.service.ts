import { CommunityService as ApiCommunityService } from '../api/community';
import { ValidationUtils } from '../utils/validation';
import { StorageUtils } from '../utils/storage';
import { DateUtils } from '../utils/date';

export class CommunityService {
  private static instance: CommunityService;
  private apiService: ApiCommunityService;

  private constructor() {
    this.apiService = new ApiCommunityService();
  }

  public static getInstance(): CommunityService {
    if (!CommunityService.instance) {
      CommunityService.instance = new CommunityService();
    }
    return CommunityService.instance;
  }

  /**
   * Create a study group
   */
  async createStudyGroup(groupData: {
    name: string;
    description: string;
    subject: string;
    maxMembers: number;
    isPublic: boolean;
    tags?: string[];
  }) {
    try {
      // Validate group data
      const validation = this.validateStudyGroupData(groupData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.createStudyGroup(groupData);
      if (response.success && response.data) {
        // Clear study groups cache to refresh data
        this.clearStudyGroupsCache();
        return response;
      }
      throw new Error(response.message || 'Failed to create study group');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get study groups
   */
  async getStudyGroups(filters?: {
    subject?: string;
    isPublic?: boolean;
    hasSpace?: boolean;
    search?: string;
  }) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_study_groups_${JSON.stringify(filters || {})}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getStudyGroups(filters);
      if (response.success && response.data) {
        // Cache the study groups
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch study groups');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get study group details
   */
  async getStudyGroupDetails(groupId: string) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_study_group_${groupId}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getStudyGroupDetails(groupId);
      if (response.success && response.data) {
        // Cache the group details
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch study group details');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Join a study group
   */
  async joinStudyGroup(groupId: string, userId: string) {
    try {
      const response = await this.apiService.joinStudyGroup(groupId, userId);
      if (response.success && response.data) {
        // Clear related caches to refresh data
        this.clearStudyGroupsCache();
        this.clearStudyGroupDetailsCache(groupId);
        return response;
      }
      throw new Error(response.message || 'Failed to join study group');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Leave a study group
   */
  async leaveStudyGroup(groupId: string, userId: string) {
    try {
      const response = await this.apiService.leaveStudyGroup(groupId, userId);
      if (response.success) {
        // Clear related caches to refresh data
        this.clearStudyGroupsCache();
        this.clearStudyGroupDetailsCache(groupId);
        return response;
      }
      throw new Error(response.message || 'Failed to leave study group');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a forum post
   */
  async createForumPost(postData: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    attachments?: File[];
  }) {
    try {
      // Validate post data
      const validation = this.validateForumPostData(postData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.createForumPost(postData);
      if (response.success && response.data) {
        // Clear forum posts cache to refresh data
        this.clearForumPostsCache();
        return response;
      }
      throw new Error(response.message || 'Failed to create forum post');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get forum posts
   */
  async getForumPosts(filters?: {
    category?: string;
    author?: string;
    search?: string;
    tags?: string[];
  }) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_forum_posts_${JSON.stringify(filters || {})}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getForumPosts(filters);
      if (response.success && response.data) {
        // Cache the forum posts
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch forum posts');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get forum post details
   */
  async getForumPostDetails(postId: string) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_forum_post_${postId}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getForumPostDetails(postId);
      if (response.success && response.data) {
        // Cache the post details
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch forum post details');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reply to a forum post
   */
  async replyToForumPost(postId: string, replyData: {
    content: string;
    parentReplyId?: string;
  }) {
    try {
      if (!replyData.content.trim()) {
        throw new Error('Reply content is required');
      }

      const response = await this.apiService.replyToForumPost(postId, replyData);
      if (response.success && response.data) {
        // Clear related caches to refresh data
        this.clearForumPostsCache();
        this.clearForumPostDetailsCache(postId);
        return response;
      }
      throw new Error(response.message || 'Failed to reply to forum post');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit work for peer review
   */
  async submitForPeerReview(submissionData: {
    title: string;
    description: string;
    subject: string;
    topic: string;
    content: string;
    attachments?: File[];
    requestedFeedback?: string[];
  }) {
    try {
      // Validate submission data
      const validation = this.validatePeerReviewSubmissionData(submissionData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.submitForPeerReview(submissionData);
      if (response.success && response.data) {
        // Clear peer review cache to refresh data
        this.clearPeerReviewCache();
        return response;
      }
      throw new Error(response.message || 'Failed to submit for peer review');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get peer review submissions
   */
  async getPeerReviewSubmissions(filters?: {
    subject?: string;
    status?: 'pending' | 'in-review' | 'completed';
    author?: string;
  }) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_peer_review_submissions_${JSON.stringify(filters || {})}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getPeerReviewSubmissions(filters);
      if (response.success && response.data) {
        // Cache the submissions
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch peer review submissions');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit peer review
   */
  async submitPeerReview(submissionId: string, reviewData: {
    rating: number;
    feedback: string;
    suggestions: string[];
    strengths: string[];
    areasForImprovement: string[];
  }) {
    try {
      // Validate review data
      const validation = this.validatePeerReviewData(reviewData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.submitPeerReview(submissionId, reviewData);
      if (response.success && response.data) {
        // Clear related caches to refresh data
        this.clearPeerReviewCache();
        return response;
      }
      throw new Error(response.message || 'Failed to submit peer review');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get leaderboards
   */
  async getLeaderboards(category: 'overall' | 'subject' | 'weekly' | 'monthly' = 'overall') {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_leaderboard_${category}`;
      const cached = StorageUtils.sessionStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await this.apiService.getLeaderboards(category);
      if (response.success && response.data) {
        // Cache the leaderboard
        StorageUtils.sessionStorage.set(cacheKey, response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch leaderboard');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(userId: string) {
    try {
      // Try to get from cache first
      const cacheKey = `xploar_user_achievements_${userId}`;
      const cached = StorageUtils.localStorage.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      // In a real app, you would call the API
      // const response = await this.apiService.getUserAchievements(userId);
      
      // For now, generate mock achievements
      const mockAchievements = this.generateMockUserAchievements();
      
      // Cache the achievements
      StorageUtils.localStorage.set(cacheKey, mockAchievements);
      return { success: true, data: mockAchievements };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search community content
   */
  async searchCommunityContent(query: string, filters?: {
    type?: 'groups' | 'posts' | 'submissions';
    subject?: string;
    dateRange?: { start: string; end: string };
  }) {
    try {
      if (!query.trim()) {
        throw new Error('Search query is required');
      }

      const response = await this.apiService.searchCommunityContent(query, filters);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(response.message || 'Failed to search community content');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate study group data
   */
  private validateStudyGroupData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = 'Group name is required';
    }

    if (!data.description.trim()) {
      errors.description = 'Group description is required';
    }

    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (data.maxMembers < 2 || data.maxMembers > 100) {
      errors.maxMembers = 'Maximum members must be between 2 and 100';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate forum post data
   */
  private validateForumPostData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.title.trim()) {
      errors.title = 'Post title is required';
    }

    if (!data.content.trim()) {
      errors.content = 'Post content is required';
    }

    if (!data.category.trim()) {
      errors.category = 'Post category is required';
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
   * Validate peer review submission data
   */
  private validatePeerReviewSubmissionData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.title.trim()) {
      errors.title = 'Submission title is required';
    }

    if (!data.description.trim()) {
      errors.description = 'Submission description is required';
    }

    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!data.topic.trim()) {
      errors.topic = 'Topic is required';
    }

    if (!data.content.trim()) {
      errors.content = 'Submission content is required';
    }

    if (data.attachments && data.attachments.length > 10) {
      errors.attachments = 'Maximum 10 attachments allowed';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate peer review data
   */
  private validatePeerReviewData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (data.rating < 1 || data.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    if (!data.feedback.trim()) {
      errors.feedback = 'Feedback is required';
    }

    if (!data.suggestions || data.suggestions.length === 0) {
      errors.suggestions = 'At least one suggestion is required';
    }

    if (!data.strengths || data.strengths.length === 0) {
      errors.strengths = 'At least one strength is required';
    }

    if (!data.areasForImprovement || data.areasForImprovement.length === 0) {
      errors.areasForImprovement = 'At least one area for improvement is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Generate mock user achievements
   */
  private generateMockUserAchievements() {
    return [
      {
        id: 'ach_1',
        title: 'First Steps',
        description: 'Complete your first study session',
        icon: '🎯',
        unlockedAt: '2024-01-15T10:30:00.000Z',
        category: 'study',
      },
      {
        id: 'ach_2',
        title: 'Streak Master',
        description: 'Maintain a 7-day study streak',
        icon: '🔥',
        unlockedAt: '2024-01-20T14:15:00.000Z',
        category: 'consistency',
      },
      {
        id: 'ach_3',
        title: 'Quiz Champion',
        description: 'Score 90% or higher in a mock test',
        icon: '🏆',
        unlockedAt: '2024-01-18T16:45:00.000Z',
        category: 'performance',
      },
      {
        id: 'ach_4',
        title: 'Community Helper',
        description: 'Help 5 other students with their questions',
        icon: '🤝',
        unlockedAt: '2024-01-22T09:20:00.000Z',
        category: 'community',
      },
      {
        id: 'ach_5',
        title: 'Subject Expert',
        description: 'Complete 100 questions in Mathematics',
        icon: '📚',
        unlockedAt: '2024-01-25T11:30:00.000Z',
        category: 'mastery',
      },
    ];
  }

  /**
   * Clear study groups cache
   */
  private clearStudyGroupsCache() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('xploar_study_groups_')) {
        StorageUtils.sessionStorage.remove(key);
      }
    });
  }

  /**
   * Clear study group details cache
   */
  private clearStudyGroupDetailsCache(groupId: string) {
    StorageUtils.sessionStorage.remove(`xploar_study_group_${groupId}`);
  }

  /**
   * Clear forum posts cache
   */
  private clearForumPostsCache() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('xploar_forum_posts_')) {
        StorageUtils.sessionStorage.remove(key);
      }
    });
  }

  /**
   * Clear forum post details cache
   */
  private clearForumPostDetailsCache(postId: string) {
    StorageUtils.sessionStorage.remove(`xploar_forum_post_${postId}`);
  }

  /**
   * Clear peer review cache
   */
  private clearPeerReviewCache() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('xploar_peer_review_')) {
        StorageUtils.sessionStorage.remove(key);
      }
    });
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || 'Community operation failed');
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
export const communityService = CommunityService.getInstance();
