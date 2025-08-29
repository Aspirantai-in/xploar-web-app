'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { MentorProfile, TopicID } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { UPSC_FOUNDATION } from '@/lib/data/topics';
import { MentorProfileView } from './MentorProfileView';

export function FindMentor() {
    const { fetchMentors } = useAppStore();
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [filteredMentors, setFilteredMentors] = useState<MentorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState<TopicID | 'all'>('all');
    const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const fetchedMentors = await fetchMentors();
            setMentors(fetchedMentors);
            setFilteredMentors(fetchedMentors);
            setLoading(false);
        };
        loadData();
    }, [fetchMentors]);

    useEffect(() => {
        if (selectedTopic === 'all') {
            setFilteredMentors(mentors);
        } else {
            setFilteredMentors(mentors.filter(m => m.expertise.includes(selectedTopic)));
        }
    }, [selectedTopic, mentors]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Finding Mentors..." /></div>;
    }

    if (selectedMentor) {
        return <MentorProfileView mentor={selectedMentor} onBack={() => setSelectedMentor(null)} />;
    }

    return (
        <div>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Find Your Mentor</CardTitle>
                    <CardDescription>Filter mentors based on their expertise.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedTopic} onValueChange={(value) => setSelectedTopic(value as TopicID | 'all')}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Filter by topic" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Topics</SelectItem>
                            {UPSC_FOUNDATION.map(topic => (
                                <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor, index) => (
                    <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full flex flex-col hover:border-electric-aqua transition-colors duration-300">
                            <CardHeader className="items-center text-center">
                                <Image src={mentor.imageUrl} alt={mentor.name} width={96} height={96} className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md" />
                                <CardTitle className="text-lg">{mentor.name}</CardTitle>
                                <CardDescription>{mentor.headline}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-void-black/80 mb-4 text-center">{mentor.bio.substring(0, 100)}...</p>
                                <div className="text-center space-x-1">
                                    {mentor.expertise.slice(0, 2).map(exp => (
                                        <span key={exp} className="px-2 py-1 text-xs bg-dark-blue/10 text-dark-blue rounded-full">
                                            {UPSC_FOUNDATION.find(t => t.id === exp)?.name}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                            <div className="p-4 pt-0 flex items-center justify-between">
                                <span className="font-bold text-lg">₹{mentor.hourlyRate}/hr</span>
                                <Button onClick={() => setSelectedMentor(mentor)}>View Profile</Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
