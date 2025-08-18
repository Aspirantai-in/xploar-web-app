'use client';
import { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DebateTimerProps {
    time: number;
    onTimeUpdate: (time: number) => void;
}

export function DebateTimer({ time, onTimeUpdate }: DebateTimerProps) {
    useEffect(() => {
        const interval = setInterval(() => {
            onTimeUpdate(time + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time, onTimeUpdate]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center space-x-1 text-sm">
            <Clock className="h-4 w-4 text-electric-aqua" />
            <span className="font-mono">{formatTime(time)}</span>
        </div>
    );
}