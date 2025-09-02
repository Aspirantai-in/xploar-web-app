import { useState, useCallback, useRef } from 'react';

export interface LoadingState {
    isLoading: boolean;
    message?: string;
    progress?: number;
}

export interface UseLoadingReturn {
    loadingState: LoadingState;
    startLoading: (message?: string) => void;
    stopLoading: () => void;
    updateProgress: (progress: number) => void;
    setMessage: (message: string) => void;
    withLoading: <T>(asyncFn: () => Promise<T>, message?: string) => Promise<T>;
}

export function useLoading(initialMessage?: string): UseLoadingReturn {
    const [loadingState, setLoadingState] = useState<LoadingState>({
        isLoading: false,
        message: initialMessage,
        progress: 0,
    });

    const timeoutRef = useRef<NodeJS.Timeout>();
    const stopLoadingRef = useRef<() => void>();

    const stopLoading = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
        setLoadingState({
            isLoading: false,
            message: undefined,
            progress: 0,
        });
    }, []);

    // Store stopLoading in ref for use in timeout
    stopLoadingRef.current = stopLoading;

    const startLoading = useCallback((message?: string) => {
        setLoadingState({
            isLoading: true,
            message: message || loadingState.message || 'Loading...',
            progress: 0,
        });

        // Auto-clear loading after 30 seconds to prevent infinite loading states
        timeoutRef.current = setTimeout(() => {
            stopLoadingRef.current?.();
        }, 30000);
    }, [loadingState.message]);

    const updateProgress = useCallback((progress: number) => {
        setLoadingState(prev => ({
            ...prev,
            progress: Math.max(0, Math.min(100, progress)),
        }));
    }, []);

    const setMessage = useCallback((message: string) => {
        setLoadingState(prev => ({
            ...prev,
            message,
        }));
    }, []);

    const withLoading = useCallback(async <T,>(
        asyncFn: () => Promise<T>,
        message?: string
    ): Promise<T> => {
        try {
            startLoading(message);
            const result = await asyncFn();
            return result;
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    return {
        loadingState,
        startLoading,
        stopLoading,
        updateProgress,
        setMessage,
        withLoading,
    };
}

// Hook for managing multiple loading states
export function useMultiLoading() {
    const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

    const setLoadingState = useCallback((key: string, state: LoadingState) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: state,
        }));
    }, []);

    const startLoading = useCallback((key: string, message?: string) => {
        setLoadingState(key, {
            isLoading: true,
            message: message || 'Loading...',
            progress: 0,
        });
    }, [setLoadingState]);

    const stopLoading = useCallback((key: string) => {
        setLoadingState(key, {
            isLoading: false,
            message: undefined,
            progress: 0,
        });
    }, [setLoadingState]);

    const updateProgress = useCallback((key: string, progress: number) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                progress: Math.max(0, Math.min(100, progress)),
            },
        }));
    }, []);

    const getLoadingState = useCallback((key: string): LoadingState => {
        return loadingStates[key] || { isLoading: false };
    }, [loadingStates]);

    const isAnyLoading = Object.values(loadingStates).some(state => state.isLoading);
    const allMessages = Object.values(loadingStates)
        .filter(state => state.isLoading && state.message)
        .map(state => state.message);

    return {
        loadingStates,
        startLoading,
        stopLoading,
        updateProgress,
        getLoadingState,
        isAnyLoading,
        messages: allMessages,
    };
}
