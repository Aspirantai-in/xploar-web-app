// Enhanced Error Handling Utilities
// Centralized error handling to replace 'unknown' error handling

import {
  ApiError,
  ValidationError,
  NetworkError,
  AuthError,
  StudyPlannerError,
  TaskError,
  isApiError,
  isValidationError,
  isNetworkError,
  isAuthError,
  isStudyPlannerError,
  isTaskError,
  createApiError,
  createNetworkError,
  createAuthError
} from '@/lib/types/errors';

type AppError = ApiError | ValidationError | NetworkError | AuthError | StudyPlannerError | TaskError;

// Error handler class for consistent error processing
export class ErrorHandler {

  /**
   * Process any error and convert to our typed error system
   */
  static processError(error: unknown, context?: string): AppError {
    if (this.isAppError(error)) {
      return error as AppError;
    }

    // Axios-like error
    if (this.isAxiosLikeError(error)) {
      const status = error.response?.status ?? 500;
      const message = (error.response?.data?.message as string) || (error.message as string) || 'Request failed';

      if (status === 401) {
        return createAuthError(message, 'UNAUTHORIZED', true);
      }
      if (status === 403) {
        return createAuthError(message, 'FORBIDDEN');
      }
      return createApiError(message, status, 'unknown', 'unknown');
    }

    // Standard JS Error
    if (error && typeof error === 'object' && 'message' in error) {
      const msg = String((error as { message?: unknown }).message || 'Unknown error');
      if (msg.toLowerCase().includes('timeout')) {
        return createNetworkError(`Request timeout: ${msg}`, false, true);
      }
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        return createNetworkError(`Network error: ${msg}`, typeof navigator !== 'undefined' ? !navigator.onLine : false, true);
      }
      return createApiError(msg, 500, 'unknown', 'unknown');
    }

    if (typeof error === 'string') {
      return createApiError(error, 500, 'unknown', 'unknown');
    }

    return createApiError(context ? `Unknown error in ${context}` : 'An unexpected error occurred', 500, 'unknown', 'unknown');
  }

  /**
   * Get user-friendly error message from any error
   */
  static getDisplayMessage(error: unknown): string {
    const processedError = this.processError(error);

    // Customize messages based on error type
    if (isNetworkError(processedError)) {
      if (processedError.message.toLowerCase().includes('timeout')) {
        return 'Request timed out. Please check your connection and try again.';
      }
      return processedError.isOffline
        ? 'Unable to connect to the server. Please check your internet connection.'
        : 'Network error. Please try again.';
    }

    if (isAuthError(processedError)) {
      if (processedError.authCode === 'UNAUTHORIZED') {
        return 'Your session has expired. Please log in again.';
      }
      if (processedError.authCode === 'FORBIDDEN') {
        return 'You do not have permission to perform this action.';
      }
    }

    if (isApiError(processedError)) {
      if (processedError.status >= 500) {
        return 'Server error. Please try again later.';
      }
      if (processedError.status === 404) {
        return 'The requested resource was not found.';
      }
      if (processedError.status === 400) {
        return 'Invalid request. Please check your input.';
      }
    }

    if (isValidationError(processedError)) {
      return `Validation error: ${processedError.message}`;
    }

    if (isStudyPlannerError(processedError)) {
      return `Study planner error: ${processedError.message}`;
    }

    if (isTaskError(processedError)) {
      return `Task error: ${processedError.message}`;
    }

    // Fallback to the error message
    return processedError.message;
  }

  /**
   * Log error with appropriate level and context
   */
  static logError(error: unknown, context?: string, userId?: string): void {
    const processedError = this.processError(error, context);

    const logData = {
      error: processedError,
      context,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', logData);
    }

    // In production, you might want to send to error tracking service
    // Example: Sentry, LogRocket, DataDog, etc.
    // if (process.env.NODE_ENV === 'production') {
    //   sendToErrorTrackingService(logData);
    // }
  }

  /**
   * Handle async operations with proper error handling
   */
  static async handleAsync<T>(
    operation: () => Promise<T>,
    context?: string,
    onError?: (error: AppError) => void
  ): Promise<{ data: T | null; error: AppError | null }> {
    try {
      const data = await operation();
      return { data, error: null };
    } catch (error) {
      const processedError = this.processError(error, context);
      this.logError(processedError, context);

      if (onError) {
        onError(processedError);
      }

      return { data: null, error: processedError };
    }
  }

  /**
   * Type guard to check if error is our AppError type
   */
  private static isAppError(error: unknown): error is AppError {
    return (
      isApiError(error) ||
      isValidationError(error) ||
      isNetworkError(error) ||
      isAuthError(error) ||
      isStudyPlannerError(error) ||
      isTaskError(error)
    );
  }

  /**
   * Type guard for axios-like errors
   */
  private static isAxiosLikeError(error: unknown): error is {
    response?: {
      status: number;
      data?: { message?: string; code?: string };
    };
    message?: string;
  } {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('response' in error || 'message' in error)
    );
  }
}

// Convenience functions for common error handling patterns
export function handleApiCall<T>(
  apiCall: () => Promise<T>,
  context?: string
): Promise<{ data: T | null; error: AppError | null }> {
  return ErrorHandler.handleAsync(apiCall, context);
}

export function getErrorMessage(error: unknown, fallback?: string): string {
  return ErrorHandler.getDisplayMessage(error) || fallback || 'An unexpected error occurred';
}

export function logError(error: unknown, context?: string, userId?: string): void {
  ErrorHandler.logError(error, context, userId);
}

// Hook for React components to handle errors consistently
export function useErrorHandler() {
  const handleError = (error: unknown, context?: string) => {
    const processedError = ErrorHandler.processError(error, context);
    ErrorHandler.logError(processedError, context);
    return processedError;
  };

  const getDisplayMessage = (error: unknown) => {
    return ErrorHandler.getDisplayMessage(error);
  };

  return {
    handleError,
    getDisplayMessage,
    logError: ErrorHandler.logError
  };
}
