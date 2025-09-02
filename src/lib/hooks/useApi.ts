import { useState, useCallback, useRef } from 'react';

export interface ApiState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

export interface ApiCallOptions {
    onSuccess?: (data: unknown) => void;
    onError?: (error: string) => void;
    immediate?: boolean;
}

export const useApi = <T = unknown>(
    apiCall: (...args: unknown[]) => Promise<T>,
    options: ApiCallOptions = {}
) => {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const execute = useCallback(
        async (...args: unknown[]) => {
            // Cancel previous request if it exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const result = await apiCall(...args);

                setState({
                    data: result,
                    isLoading: false,
                    error: null,
                });

                options.onSuccess?.(result);
                return { success: true, data: result };
            } catch (error: unknown) {
                // Don't update state if request was cancelled
                if (error instanceof Error && error.name === 'AbortError') {
                    return { success: false, cancelled: true };
                }

                const errorMessage = error instanceof Error ? error.message : 'API call failed';

                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));

                options.onError?.(errorMessage);
                return { success: false, error: errorMessage };
            }
        },
        [apiCall, options.onSuccess, options.onError]
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            isLoading: false,
            error: null,
        });
    }, []);

    const setData = useCallback((data: T) => {
        setState(prev => ({ ...prev, data, error: null }));
    }, []);

    const setError = useCallback((error: string) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Cleanup function to cancel pending requests
    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    return {
        ...state,
        execute,
        reset,
        setData,
        setError,
        clearError,
        cancel,
    };
};

// Specialized hooks for common patterns
export const useApiWithCache = <T = unknown>(
    apiCall: (...args: unknown[]) => Promise<T>,
    cacheKey: string,
    options: ApiCallOptions & { cacheTime?: number } = {}
) => {
    const [cache, setCache] = useState<Map<string, { data: T; timestamp: number }>>(new Map());

    const { cacheTime = 5 * 60 * 1000, ...apiOptions } = options; // Default 5 minutes

    const executeWithCache = useCallback(
        async (...args: unknown[]) => {
            const now = Date.now();
            const cached = cache.get(cacheKey);

            // Return cached data if it's still valid
            if (cached && (now - cached.timestamp) < cacheTime) {
                return { success: true, data: cached.data, fromCache: true };
            }

            // Make API call
            const result = await apiCall(...args);

            // Cache the result
            setCache(prev => new Map(prev).set(cacheKey, { data: result, timestamp: now }));

            return { success: true, data: result, fromCache: false };
        },
        [apiCall, cacheKey, cacheTime]
    );

    const clearCache = useCallback(() => {
        setCache(new Map());
    }, []);

    const invalidateCache = useCallback(() => {
        setCache(prev => {
            const newCache = new Map(prev);
            newCache.delete(cacheKey);
            return newCache;
        });
    }, [cacheKey]);

    return {
        executeWithCache,
        clearCache,
        invalidateCache,
        hasCachedData: cache.has(cacheKey),
    };
};
