import { UserProfileService } from '../api/user-profile';
import { ValidationUtils } from '../utils/validation';
import { StorageUtils } from '../utils/storage';

export class UserService {
  private static instance: UserService;
  private apiService: UserProfileService;

  private constructor() {
    this.apiService = new UserProfileService();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    try {
      const response = await this.apiService.getProfile();
      if (response.success && response.data) {
        // Cache user profile in session storage
        StorageUtils.sessionStorage.set('xploar_user_profile', response.data);
        return response;
      }
      throw new Error(response.message || 'Failed to fetch user profile');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    dateOfBirth?: string;
    location?: string;
    interests?: string[];
  }) {
    try {
      // Validate profile data
      const validation = this.validateProfileData(profileData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.updateProfile(profileData);
      if (response.success && response.data) {
        // Update cached profile
        const currentProfile = StorageUtils.sessionStorage.get('xploar_user_profile');
        if (currentProfile) {
          StorageUtils.sessionStorage.set('xploar_user_profile', {
            ...currentProfile,
            ...response.data,
          });
        }
        return response;
      }
      throw new Error(response.message || 'Failed to update user profile');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update profile picture
   */
  async updateProfilePicture(file: File) {
    try {
      // Validate file
      const validation = this.validateProfilePicture(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const response = await this.apiService.updateProfilePicture(file);
      if (response.success && response.data) {
        // Update cached profile with new picture URL
        const currentProfile = StorageUtils.sessionStorage.get('xploar_user_profile');
        if (currentProfile) {
          StorageUtils.sessionStorage.set('xploar_user_profile', {
            ...currentProfile,
            profilePicture: response.data.profilePicture,
          });
        }
        return response;
      }
      throw new Error(response.message || 'Failed to update profile picture');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    try {
      // Validate password data
      const validation = this.validatePasswordChange(passwordData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }

      const response = await this.apiService.changePassword(passwordData);
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Failed to change password');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences() {
    try {
      // Try to get from cache first
      const cached = StorageUtils.localStorage.get('xploar_user_preferences');
      if (cached) {
        return { success: true, data: cached };
      }

      // If not cached, fetch from API (placeholder for now)
      const defaultPreferences = {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false,
        },
        study: {
          defaultStudyDuration: 25,
          breakDuration: 5,
          autoStartBreaks: true,
        },
      };

      // Cache preferences
      StorageUtils.localStorage.set('xploar_user_preferences', defaultPreferences);
      return { success: true, data: defaultPreferences };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: any) {
    try {
      // Update cached preferences
      StorageUtils.localStorage.set('xploar_user_preferences', preferences);
      
      // In a real app, you would also send this to the API
      // await this.apiService.updatePreferences(preferences);
      
      return { success: true, data: preferences };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(confirmation: string) {
    try {
      if (confirmation !== 'DELETE') {
        throw new Error('Please type DELETE to confirm account deletion');
      }

      // Clear all cached data
      StorageUtils.sessionStorage.remove('xploar_user_profile');
      StorageUtils.localStorage.remove('xploar_user_preferences');
      StorageUtils.localStorage.remove('xploar_theme');
      StorageUtils.localStorage.remove('xploar_language');

      // In a real app, you would call the API to delete the account
      // await this.apiService.deleteAccount();

      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate profile data
   */
  private validateProfileData(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (data.firstName && !ValidationUtils.isValidName(data.firstName)) {
      errors.firstName = 'Invalid first name format';
    }

    if (data.lastName && !ValidationUtils.isValidName(data.lastName)) {
      errors.lastName = 'Invalid last name format';
    }

    if (data.email && !ValidationUtils.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (data.phone && !ValidationUtils.isValidPhoneNumber(data.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (data.dateOfBirth && !ValidationUtils.isValidDate(data.dateOfBirth)) {
      errors.dateOfBirth = 'Invalid date format';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate profile picture
   */
  private validateProfilePicture(file: File): { isValid: boolean; error?: string } {
    // Check file size (max 5MB)
    if (!ValidationUtils.isValidFileSize(file.size, 5)) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    return { isValid: true };
  }

  /**
   * Validate password change
   */
  private validatePasswordChange(data: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!data.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = ValidationUtils.isValidPassword(data.newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.errors.join(', ');
      }
    }

    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (data.currentPassword === data.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.message || 'User operation failed');
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
export const userService = UserService.getInstance();
