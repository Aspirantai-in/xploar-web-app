'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, CheckCircle } from 'lucide-react';
import { MentorProfile, ISOString } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { UPSC_FOUNDATION } from '@/lib/data/topics';

interface MentorProfileViewProps {
    mentor: MentorProfile;
    onBack: () => void;
}

export function MentorProfileView({ mentor, onBack }: MentorProfileViewProps) {
    const { bookMentorshipSession } = useAppStore();
    const [selectedSlot, setSelectedSlot] = useState<ISOString | null>(null);
    const [view, setView] = useState<'profile' | 'confirm' | 'booked'>('profile');

    const handleBookSession = async () => {
        if (!selectedSlot) return;
        const result = await bookMentorshipSession({ mentorId: mentor.id, time: selectedSlot });
        if (result.success) {
            setView('booked');
        } else {
            alert("Booking failed. Please try again.");
        }
    };

    const formatSlot = (slot: ISOString) => {
        return new Date(slot).toLocaleString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (view === 'confirm') {
        return (
            <div>
                <Button variant="outline" onClick={() => setView('profile')} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Profile
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Confirm Your Booking</CardTitle>
                        <CardDescription>Please review the details of your mentorship session.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Image src={mentor.imageUrl} alt={mentor.name} width={64} height={64} className="w-16 h-16 rounded-full" />
                            <div>
                                <p><strong>Mentor:</strong> {mentor.name}</p>
                                <p className="text-sm text-void-black/70">{mentor.headline}</p>
                            </div>
                        </div>
                        <p><strong>Time:</strong> {selectedSlot ? formatSlot(selectedSlot) : 'N/A'}</p>
                        <p><strong>Duration:</strong> 60 minutes</p>
                        <p><strong>Price:</strong> ₹{mentor.hourlyRate}</p>
                        <div className="flex space-x-2 pt-4">
                            <Button className="w-full" onClick={handleBookSession}>Confirm & Book</Button>
                            <Button variant="outline" className="w-full" onClick={() => setView('profile')}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (view === 'booked') {
        return (
            <div className="text-center py-16">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Session Booked!</h2>
                <p className="text-void-black/70 mb-4">Your session with {mentor.name} is confirmed for {selectedSlot ? formatSlot(selectedSlot) : ''}.</p>
                <Button onClick={onBack}>Back to Mentors</Button>
            </div>
        );
    }

    return (
        <div>
            <Button variant="outline" onClick={onBack} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Mentor List
            </Button>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-6">
                            <Image src={mentor.imageUrl} alt={mentor.name} width={112} height={112} className="w-28 h-28 rounded-full border-4 border-white shadow-lg" />
                            <div>
                                <CardTitle className="text-3xl">{mentor.name}</CardTitle>
                                <CardDescription className="text-base">{mentor.headline}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6">{mentor.bio}</p>
                            <h3 className="font-semibold mb-2 text-lg">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {mentor.expertise.map(exp => (
                                    <span key={exp} className="px-3 py-1 text-sm bg-electric-aqua/20 text-electric-aqua-dark rounded-full">
                                        {UPSC_FOUNDATION.find(t => t.id === exp)?.name}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Book a Session</CardTitle>
                            <CardDescription>Select an available time slot.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {mentor.availabilitySlots.map(slot => (
                                <Button
                                    key={slot}
                                    variant={selectedSlot === slot ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    <Calendar className="h-4 w-4 mr-2" /> {formatSlot(slot)}
                                </Button>
                            ))}
                            <Button className="w-full mt-4" disabled={!selectedSlot} onClick={() => setView('confirm')}>
                                Book Selected Slot
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
