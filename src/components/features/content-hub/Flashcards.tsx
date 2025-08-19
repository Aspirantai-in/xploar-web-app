'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Flashcard, FlashcardDeck } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function Flashcards() {
    const { fetchFlashcardDecks, fetchFlashcardsForDeck } = useAppStore();
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDecks = async () => {
            setLoading(true);
            const fetchedDecks = await fetchFlashcardDecks();
            setDecks(fetchedDecks);
            setLoading(false);
        };
        loadDecks();
    }, [fetchFlashcardDecks]);

    const handleSelectDeck = async (deck: FlashcardDeck) => {
        setLoading(true);
        setSelectedDeck(deck);
        const fetchedCards = await fetchFlashcardsForDeck(deck.id);
        setCards(fetchedCards);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setLoading(false);
    };

    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => (prev + 1) % cards.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length);
    };

    if (loading && !selectedDeck) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading Decks..." /></div>;
    }

    if (selectedDeck) {
        const card = cards[currentCardIndex];
        return (
            <div>
                <Button variant="outline" onClick={() => setSelectedDeck(null)} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Decks
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>{selectedDeck.title}</CardTitle>
                        <CardDescription>Card {currentCardIndex + 1} of {cards.length}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <motion.div
                            className="w-full h-64 rounded-lg cursor-pointer flex items-center justify-center p-6 text-center"
                            onClick={() => setIsFlipped(!isFlipped)}
                            style={{ transformStyle: 'preserve-3d' }}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="absolute w-full h-full bg-electric-aqua/10 border-2 border-electric-aqua rounded-lg flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                                <p className="text-lg font-semibold">{card?.front}</p>
                            </div>
                            <div className="absolute w-full h-full bg-dark-blue/10 border-2 border-dark-blue rounded-lg flex items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <p>{card?.back}</p>
                            </div>
                        </motion.div>
                        <div className="mt-4 flex items-center justify-between w-full">
                            <Button variant="ghost" onClick={handlePrevCard}><ChevronLeft className="h-4 w-4 mr-2" /> Prev</Button>
                            <Button onClick={() => setIsFlipped(!isFlipped)}><RotateCcw className="h-4 w-4 mr-2" /> Flip</Button>
                            <Button variant="ghost" onClick={handleNextCard}>Next <ChevronRight className="h-4 w-4 ml-2" /></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Flashcard Decks</CardTitle>
                <CardDescription>Select a deck to start your spaced repetition session.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decks.map(deck => (
                    <motion.div
                        key={deck.id}
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                        onClick={() => handleSelectDeck(deck)}
                    >
                        <Card className="h-full">
                            <CardContent className="p-6 text-center">
                                <Layers className="h-8 w-8 mx-auto mb-2 text-electric-aqua" />
                                <h3 className="font-semibold">{deck.title}</h3>
                                <p className="text-xs text-void-black/60">{deck.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
