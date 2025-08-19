'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Search, Upload, PlusCircle, ChevronLeft, Save } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CuratedResource, UserNote } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function DigitalLibrary() {
    const { fetchCuratedResources, createUserNote } = useAppStore();
    const [resources, setResources] = useState<CuratedResource[]>([]);
    const [userNotes, setUserNotes] = useState<UserNote[]>([]); // This would come from the store
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'main' | 'create-note'>('main');

    // State for new note form
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const fetchedResources = await fetchCuratedResources();
            setResources(fetchedResources);
            setLoading(false);
        };
        loadData();
    }, [fetchCuratedResources]);

    const handleCreateNote = () => {
        if (!newNoteTitle || !newNoteContent) return;
        const noteData = {
            userId: 'user_current_001', // Placeholder
            title: newNoteTitle,
            content: newNoteContent,
            topicIds: [] // Placeholder
        };
        createUserNote(noteData);
        alert("Your note has been saved!");
        setNewNoteTitle('');
        setNewNoteContent('');
        setView('main');
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading Library..." /></div>;
    }

    if (view === 'create-note') {
        return (
            <div>
                <Button variant="outline" onClick={() => setView('main')} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Library
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Note</CardTitle>
                        <CardDescription>Jot down your thoughts, summaries, or key points.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Note Title</label>
                            <Input
                                placeholder="Enter a title for your note"
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <textarea
                                className="w-full h-48 p-3 border border-dark-blue/20 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-dark-blue bg-ice-white text-sm"
                                placeholder="Start writing your note here..."
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleCreateNote} disabled={!newNoteTitle || !newNoteContent}>
                            <Save className="h-4 w-4 mr-2" /> Save Note
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Search and Actions */}
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-void-black/50" />
                        <Input
                            placeholder="Search resources and notes..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={() => setView('create-note')}><PlusCircle className="h-4 w-4 mr-2" /> New Note</Button>
                        <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload File</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Curated Resources */}
            <Card>
                <CardHeader>
                    <CardTitle>Curated Resources</CardTitle>
                    <CardDescription>Official study materials recommended by experts.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((res, index) => (
                        <motion.a
                            key={res.id}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="block"
                        >
                            <Card className="h-full hover:border-electric-aqua transition-colors cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="text-base">{res.title}</CardTitle>
                                    <CardDescription>{res.authorOrSource}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-void-black/70 mb-2">{res.description}</p>
                                    <span className="px-2 py-1 text-xs bg-dark-blue/10 text-dark-blue rounded-full capitalize">{res.type}</span>
                                </CardContent>
                            </Card>
                        </motion.a>
                    ))}
                </CardContent>
            </Card>

            {/* User Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>My Notes & Files</CardTitle>
                    <CardDescription>Your personal notes and uploaded documents.</CardDescription>
                </CardHeader>
                <CardContent>
                    {userNotes.length === 0 ? (
                        <p className="text-sm text-center text-void-black/50 py-8">You haven't created any notes yet.</p>
                    ) : (
                        <div>{/* List user notes here */}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
