'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Webinar } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Calendar, Video, History } from 'lucide-react';

export function Webinars() {
    const { fetchUpcomingWebinars, fetchRecordedWebinars } = useAppStore();
    const [upcoming, setUpcoming] = useState<Webinar[]>([]);
    const [recorded, setRecorded] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [upcomingData, recordedData] = await Promise.all([
                fetchUpcomingWebinars(),
                fetchRecordedWebinars()
            ]);
            setUpcoming(upcomingData);
            setRecorded(recordedData);
            setLoading(false);
        };
        loadData();
    }, [fetchUpcomingWebinars, fetchRecordedWebinars]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Loading Webinars..." /></div>;
    }

    return (
        <div className="space-y-8">
            {/* Upcoming Webinars */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><Calendar className="h-6 w-6 mr-3 text-electric-aqua" /> Upcoming Webinars</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {upcoming.map((webinar, index) => (
                        <motion.div
                            key={webinar.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>{webinar.title}</CardTitle>
                                    <CardDescription>by Mentor {webinar.hostId.slice(-3)}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-void-black/80 mb-4">{webinar.description}</p>
                                    <p className="text-sm font-medium mb-4">
                                        Scheduled for: {new Date(webinar.scheduledTime).toLocaleString('en-IN')}
                                    </p>
                                    <a href={webinar.registrationLink} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full">Register Now</Button>
                                    </a>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recorded Webinars */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><History className="h-6 w-6 mr-3 text-electric-aqua" /> Recorded Webinars</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {recorded.map((webinar, index) => (
                        <motion.div
                            key={webinar.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (upcoming.length + index) * 0.1 }}
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>{webinar.title}</CardTitle>
                                    <CardDescription>by Mentor {webinar.hostId.slice(-3)}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-void-black/80 mb-4">{webinar.description}</p>
                                    <a href={webinar.recordingUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full">
                                            <Video className="h-4 w-4 mr-2" /> Watch Recording
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
