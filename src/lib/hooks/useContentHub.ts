import { useState, useEffect, useCallback } from 'react';
import { contentHubService, CurrentAffairsParams, DailyQuizParams, DigitalLibraryParams, FlashcardParams } from '@/lib/api';

export interface UseContentHubReturn {
    // Current Affairs
    currentAffairs: any[];
    currentAffairsLoading: boolean;
    currentAffairsError: string | null;
    fetchCurrentAffairs: (params?: CurrentAffairsParams) => Promise<void>;

    // Daily Quiz
    dailyQuiz: any | null;
    dailyQuizLoading: boolean;
    dailyQuizError: string | null;
    fetchDailyQuiz: (params?: DailyQuizParams) => Promise<void>;
    submitQuizAnswer: (questionId: string, answer: string) => Promise<void>;

    // Digital Library
    digitalLibrary: any[];
    digitalLibraryLoading: boolean;
    digitalLibraryError: string | null;
    fetchDigitalLibrary: (params?: DigitalLibraryParams) => Promise<void>;
    searchResources: (query: string, filters?: any) => Promise<void>;

    // Flashcards
    flashcardDecks: any[];
    flashcardDecksLoading: boolean;
    flashcardDecksError: string | null;
    fetchFlashcardDecks: (params?: FlashcardParams) => Promise<void>;

    flashcards: any[];
    flashcardsLoading: boolean;
    flashcardsError: string | null;
    fetchFlashcards: (deckId: string, params?: FlashcardParams) => Promise<void>;

    // User Notes
    userNotes: any[];
    userNotesLoading: boolean;
    userNotesError: string | null;
    fetchUserNotes: (params?: any) => Promise<void>;
    createUserNote: (noteData: any) => Promise<void>;
    updateUserNote: (noteId: string, updates: any) => Promise<void>;
    deleteUserNote: (noteId: string) => Promise<void>;

    // Utilities
    clearErrors: () => void;
    refreshAll: () => Promise<void>;
}

export function useContentHub(): UseContentHubReturn {
    // Current Affairs State
    const [currentAffairs, setCurrentAffairs] = useState<any[]>([]);
    const [currentAffairsLoading, setCurrentAffairsLoading] = useState(false);
    const [currentAffairsError, setCurrentAffairsError] = useState<string | null>(null);

    // Daily Quiz State
    const [dailyQuiz, setDailyQuiz] = useState<any | null>(null);
    const [dailyQuizLoading, setDailyQuizLoading] = useState(false);
    const [dailyQuizError, setDailyQuizError] = useState<string | null>(null);

    // Digital Library State
    const [digitalLibrary, setDigitalLibrary] = useState<any[]>([]);
    const [digitalLibraryLoading, setDigitalLibraryLoading] = useState(false);
    const [digitalLibraryError, setDigitalLibraryError] = useState<string | null>(null);

    // Flashcard Decks State
    const [flashcardDecks, setFlashcardDecks] = useState<any[]>([]);
    const [flashcardDecksLoading, setFlashcardDecksLoading] = useState(false);
    const [flashcardDecksError, setFlashcardDecksError] = useState<string | null>(null);

    // Flashcards State
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [flashcardsLoading, setFlashcardsLoading] = useState(false);
    const [flashcardsError, setFlashcardsError] = useState<string | null>(null);

    // User Notes State
    const [userNotes, setUserNotes] = useState<any[]>([]);
    const [userNotesLoading, setUserNotesLoading] = useState(false);
    const [userNotesError, setUserNotesError] = useState<string | null>(null);

    // Clear all errors
    const clearErrors = useCallback(() => {
        setCurrentAffairsError(null);
        setDailyQuizError(null);
        setDigitalLibraryError(null);
        setFlashcardDecksError(null);
        setFlashcardsError(null);
        setUserNotesError(null);
    }, []);

    // Current Affairs
    const fetchCurrentAffairs = useCallback(async (params?: CurrentAffairsParams) => {
        try {
            setCurrentAffairsLoading(true);
            setCurrentAffairsError(null);

            const response = await contentHubService.getCurrentAffairs(params);

            if (response.data) {
                setCurrentAffairs(response.data);
            }
        } catch (err: any) {
            setCurrentAffairsError(err.message || 'Failed to fetch current affairs');
        } finally {
            setCurrentAffairsLoading(false);
        }
    }, []);

    // Daily Quiz
    const fetchDailyQuiz = useCallback(async (params?: DailyQuizParams) => {
        try {
            setDailyQuizLoading(true);
            setDailyQuizError(null);

            const response = await contentHubService.getDailyQuiz(params);

            if (response.data) {
                setDailyQuiz(response.data);
            }
        } catch (err: any) {
            setDailyQuizError(err.message || 'Failed to fetch daily quiz');
        } finally {
            setDailyQuizLoading(false);
        }
    }, []);

    const submitQuizAnswer = useCallback(async (questionId: string, answer: string) => {
        try {
            setDailyQuizError(null);

            const response = await contentHubService.submitQuizAnswer(questionId, answer);

            if (response.data) {
                // Update the quiz with the result
                setDailyQuiz(prev => prev ? { ...prev, userAnswer: answer, result: response.data } : null);
            }
        } catch (err: any) {
            setDailyQuizError(err.message || 'Failed to submit quiz answer');
            throw err;
        }
    }, []);

    // Digital Library
    const fetchDigitalLibrary = useCallback(async (params?: DigitalLibraryParams) => {
        try {
            setDigitalLibraryLoading(true);
            setDigitalLibraryError(null);

            const response = await contentHubService.getDigitalLibrary(params);

            if (response.data) {
                setDigitalLibrary(response.data);
            }
        } catch (err: any) {
            setDigitalLibraryError(err.message || 'Failed to fetch digital library');
        } finally {
            setDigitalLibraryLoading(false);
        }
    }, []);

    const searchResources = useCallback(async (query: string, filters?: any) => {
        try {
            setDigitalLibraryLoading(true);
            setDigitalLibraryError(null);

            const response = await contentHubService.searchResources(query, filters);

            if (response.data) {
                setDigitalLibrary(response.data);
            }
        } catch (err: any) {
            setDigitalLibraryError(err.message || 'Failed to search resources');
        } finally {
            setDigitalLibraryLoading(false);
        }
    }, []);

    // Flashcard Decks
    const fetchFlashcardDecks = useCallback(async (params?: FlashcardParams) => {
        try {
            setFlashcardDecksLoading(true);
            setFlashcardDecksError(null);

            const response = await contentHubService.getFlashcardDecks(params);

            if (response.data) {
                setFlashcardDecks(response.data);
            }
        } catch (err: any) {
            setFlashcardDecksError(err.message || 'Failed to fetch flashcard decks');
        } finally {
            setFlashcardDecksLoading(false);
        }
    }, []);

    // Flashcards
    const fetchFlashcards = useCallback(async (deckId: string, params?: FlashcardParams) => {
        try {
            setFlashcardsLoading(true);
            setFlashcardsError(null);

            const response = await contentHubService.getFlashcards(deckId, params);

            if (response.data) {
                setFlashcards(response.data);
            }
        } catch (err: any) {
            setFlashcardsError(err.message || 'Failed to fetch flashcards');
        } finally {
            setFlashcardsLoading(false);
        }
    }, []);

    // User Notes
    const fetchUserNotes = useCallback(async (params?: any) => {
        try {
            setUserNotesLoading(true);
            setUserNotesError(null);

            const response = await contentHubService.getUserNotes(params);

            if (response.data) {
                setUserNotes(response.data);
            }
        } catch (err: any) {
            setUserNotesError(err.message || 'Failed to fetch user notes');
        } finally {
            setUserNotesLoading(false);
        }
    }, []);

    const createUserNote = useCallback(async (noteData: any) => {
        try {
            setUserNotesError(null);

            const response = await contentHubService.createUserNote(noteData);

            if (response.data) {
                // Add the new note to the list
                setUserNotes(prev => [response.data, ...prev]);
            }
        } catch (err: any) {
            setUserNotesError(err.message || 'Failed to create user note');
            throw err;
        }
    }, []);

    const updateUserNote = useCallback(async (noteId: string, updates: any) => {
        try {
            setUserNotesError(null);

            const response = await contentHubService.updateUserNote(noteId, updates);

            if (response.data) {
                // Update the note in the list
                setUserNotes(prev => prev.map(note =>
                    note.id === noteId ? { ...note, ...response.data } : note
                ));
            }
        } catch (err: any) {
            setUserNotesError(err.message || 'Failed to update user note');
            throw err;
        }
    }, []);

    const deleteUserNote = useCallback(async (noteId: string) => {
        try {
            setUserNotesError(null);

            await contentHubService.deleteUserNote(noteId);

            // Remove the note from the list
            setUserNotes(prev => prev.filter(note => note.id !== noteId));
        } catch (err: any) {
            setUserNotesError(err.message || 'Failed to delete user note');
            throw err;
        }
    }, []);

    // Refresh all content
    const refreshAll = useCallback(async () => {
        await Promise.all([
            fetchCurrentAffairs(),
            fetchDailyQuiz(),
            fetchDigitalLibrary(),
            fetchFlashcardDecks(),
            fetchUserNotes(),
        ]);
    }, [fetchCurrentAffairs, fetchDailyQuiz, fetchDigitalLibrary, fetchFlashcardDecks, fetchUserNotes]);

    // Load initial data on mount
    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return {
        // Current Affairs
        currentAffairs,
        currentAffairsLoading,
        currentAffairsError,
        fetchCurrentAffairs,

        // Daily Quiz
        dailyQuiz,
        dailyQuizLoading,
        dailyQuizError,
        fetchDailyQuiz,
        submitQuizAnswer,

        // Digital Library
        digitalLibrary,
        digitalLibraryLoading,
        digitalLibraryError,
        fetchDigitalLibrary,
        searchResources,

        // Flashcards
        flashcardDecks,
        flashcardDecksLoading,
        flashcardDecksError,
        fetchFlashcardDecks,

        flashcards,
        flashcardsLoading,
        flashcardsError,
        fetchFlashcards,

        // User Notes
        userNotes,
        userNotesLoading,
        userNotesError,
        fetchUserNotes,
        createUserNote,
        updateUserNote,
        deleteUserNote,

        // Utilities
        clearErrors,
        refreshAll,
    };
}
