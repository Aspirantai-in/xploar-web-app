/**
 * UNIFIED ERROR SYSTEM
 * All error types for consistent error handling
 */

export interface BaseError {
  code: string;
  message: string;
  timestamp: string;
  requestId?: string;
  details?: Record<string, unknown>;
}

export interface ApiError extends BaseError {
  status: number;
  endpoint: string;
  method: string;
}

export interface ValidationError extends BaseError {
  field: string;
  value: unknown;
  constraints: string[];
}

export interface NetworkError extends BaseError {
  isOffline: boolean;
  retryable: boolean;
}

export interface AuthError extends BaseError {
  authCode: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'UNAUTHORIZED' | 'FORBIDDEN';
  requiresReauth: boolean;
}

export interface StudyPlannerError extends BaseError {
  plannerCode: 'PLAN_NOT_FOUND' | 'TASK_CONFLICT' | 'INVALID_DATE_RANGE' | 'DEPENDENCY_ERROR';
  relatedEntityId?: string;
}

export interface TaskError extends BaseError {
  taskCode: 'TASK_NOT_FOUND' | 'INVALID_STATUS_TRANSITION' | 'SCHEDULING_CONFLICT' | 'DEPENDENCY_UNMET';
  taskId?: string;
  conflictingTaskId?: string;
}

// Error factory functions
export function createApiError(message: string, status: number, endpoint: string, method: string): ApiError {
  return {
    code: 'API_ERROR',
    message,
    status,
    endpoint,
    method,
    timestamp: new Date().toISOString()
  };
}

export function createValidationError(message: string, field: string, value: unknown, constraints: string[]): ValidationError {
  return {
    code: 'VALIDATION_ERROR',
    message,
    field,
    value,
    constraints,
    timestamp: new Date().toISOString()
  };
}

export function createNetworkError(message: string, isOffline: boolean = false, retryable: boolean = true): NetworkError {
  return {
    code: 'NETWORK_ERROR',
    message,
    isOffline,
    retryable,
    timestamp: new Date().toISOString()
  };
}

export function createAuthError(message: string, authCode: AuthError['authCode'], requiresReauth: boolean = true): AuthError {
  return {
    code: 'AUTH_ERROR',
    message,
    authCode,
    requiresReauth,
    timestamp: new Date().toISOString()
  };
}

export function createStudyPlannerError(message: string, plannerCode: StudyPlannerError['plannerCode'], relatedEntityId?: string): StudyPlannerError {
  return {
    code: 'STUDY_PLANNER_ERROR',
    message,
    plannerCode,
    relatedEntityId,
    timestamp: new Date().toISOString()
  };
}

export function createTaskError(message: string, taskCode: TaskError['taskCode'], taskId?: string, conflictingTaskId?: string): TaskError {
  return {
    code: 'TASK_ERROR',
    message,
    taskCode,
    taskId,
    conflictingTaskId,
    timestamp: new Date().toISOString()
  };
}

// Error handling utilities
export function isRetryableError(error: BaseError): boolean {
  if ('retryable' in error) {
    return (error as NetworkError).retryable;
  }
  if ('status' in error) {
    const status = (error as ApiError).status;
    return status >= 500 || status === 408 || status === 429;
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unexpected error occurred';
}

export function sanitizeError(error: unknown): BaseError {
  const message = getErrorMessage(error);
  return {
    code: 'UNKNOWN_ERROR',
    message,
    timestamp: new Date().toISOString()
  };
}

// Type guard functions (required by errorHandler.ts)
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null &&
    'code' in error && (error as BaseError).code === 'API_ERROR' &&
    'status' in error && 'endpoint' in error && 'method' in error;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return typeof error === 'object' && error !== null &&
    'code' in error && (error as BaseError).code === 'NETWORK_ERROR' &&
    'isOffline' in error && 'retryable' in error;
}

export function isAuthError(error: unknown): error is AuthError {
  return typeof error === 'object' && error !== null &&
    'code' in error && (error as BaseError).code === 'AUTH_ERROR' &&
    'authCode' in error && 'requiresReauth' in error;
}

export function isValidationError(error: unknown): error is ValidationError {
  return typeof error === 'object' && error !== null &&
    'code' in error && (error as BaseError).code === 'VALIDATION_ERROR' &&
    'field' in error && 'value' in error && 'constraints' in error;
}

export function isStudyPlannerError(error: unknown): error is StudyPlannerError {
  return typeof error === 'object' && error !== null &&
    'code' in error && (error as BaseError).code === 'STUDY_PLANNER_ERROR' &&
    'plannerCode' in error;
}

export function isTaskError(error: unknown): error is TaskError {
  return typeof error === 'object' && error !== null &&
    'code' in error && (error as BaseError).code === 'TASK_ERROR' &&
    'taskCode' in error;
}