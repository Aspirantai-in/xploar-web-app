import { VALIDATION } from '../constants';

/**
 * Validation utility functions
 */
export class ValidationUtils {
    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= VALIDATION.EMAIL_MAX_LENGTH;
    }

    /**
     * Validate password strength
     */
    static isValidPassword(password: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
            errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
        }

        if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
            errors.push(`Password must be no more than ${VALIDATION.PASSWORD_MAX_LENGTH} characters long`);
        }

        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push('Password must contain at least one special character (@$!%*?&)');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Validate username format
     */
    static isValidUsername(username: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
            errors.push(`Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters long`);
        }

        if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
            errors.push(`Username must be no more than ${VALIDATION.USERNAME_MAX_LENGTH} characters long`);
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, underscores, and hyphens');
        }

        if (/^[0-9_-]/.test(username)) {
            errors.push('Username cannot start with a number, underscore, or hyphen');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Validate name format
     */
    static isValidName(name: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!name.trim()) {
            errors.push('Name is required');
        }

        if (name.length > VALIDATION.NAME_MAX_LENGTH) {
            errors.push(`Name must be no more than ${VALIDATION.NAME_MAX_LENGTH} characters long`);
        }

        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Validate phone number format
     */
    static isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    /**
     * Validate URL format
     */
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate date format
     */
    static isValidDate(date: string): boolean {
        const dateObj = new Date(date);
        return dateObj instanceof Date && !isNaN(dateObj.getTime());
    }

    /**
     * Validate if date is in the future
     */
    static isFutureDate(date: string): boolean {
        const dateObj = new Date(date);
        const now = new Date();
        return dateObj > now;
    }

    /**
     * Validate if date is in the past
     */
    static isPastDate(date: string): boolean {
        const dateObj = new Date(date);
        const now = new Date();
        return dateObj < now;
    }

    /**
     * Validate file size
     */
    static isValidFileSize(fileSize: number, maxSizeMB: number): boolean {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return fileSize <= maxSizeBytes;
    }

    /**
     * Validate file type
     */
    static isValidFileType(fileName: string, allowedTypes: string[]): boolean {
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        return fileExtension ? allowedTypes.includes(fileExtension) : false;
    }

    /**
     * Validate required fields
     */
    static validateRequiredFields(data: Record<string, any>, requiredFields: string[]): {
        isValid: boolean;
        errors: Record<string, string>;
    } {
        const errors: Record<string, string> = {};

        requiredFields.forEach(field => {
            if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }

    /**
     * Sanitize input string
     */
    static sanitizeString(input: string): string {
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Validate study plan data
     */
    static validateStudyPlan(data: {
        title: string;
        description?: string;
        startDate: string;
        endDate: string;
        subjects: string[];
    }): {
        isValid: boolean;
        errors: Record<string, string>;
    } {
        const errors: Record<string, string> = {};

        // Required fields
        if (!data.title.trim()) {
            errors.title = 'Title is required';
        }

        if (!data.startDate) {
            errors.startDate = 'Start date is required';
        }

        if (!data.endDate) {
            errors.endDate = 'End date is required';
        }

        if (!data.subjects || data.subjects.length === 0) {
            errors.subjects = 'At least one subject is required';
        }

        // Date validation
        if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (startDate >= endDate) {
                errors.endDate = 'End date must be after start date';
            }

            if (startDate < new Date()) {
                errors.startDate = 'Start date cannot be in the past';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }

    /**
     * Validate task data
     */
    static validateTask(data: {
        title: string;
        description?: string;
        dueDate?: string;
        priority: 'low' | 'medium' | 'high';
        estimatedTime: number;
    }): {
        isValid: boolean;
        errors: Record<string, string>;
    } {
        const errors: Record<string, string> = {};

        if (!data.title.trim()) {
            errors.title = 'Title is required';
        }

        if (data.estimatedTime <= 0) {
            errors.estimatedTime = 'Estimated time must be greater than 0';
        }

        if (data.estimatedTime > 480) { // 8 hours
            errors.estimatedTime = 'Estimated time cannot exceed 8 hours';
        }

        if (data.dueDate && !this.isValidDate(data.dueDate)) {
            errors.dueDate = 'Invalid due date format';
        }

        if (!['low', 'medium', 'high'].includes(data.priority)) {
            errors.priority = 'Invalid priority level';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }
}
