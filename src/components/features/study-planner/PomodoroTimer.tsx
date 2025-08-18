'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { APP_CONFIG } from '@/lib/utils/constants';

export function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(APP_CONFIG.POMODORO_DURATION * 60); // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer finished
            setIsActive(false);
            if (isBreak) {
                // Break finished, start new session
                setIsBreak(false);
                setTimeLeft(APP_CONFIG.POMODORO_DURATION * 60);
            } else {
                // Session finished, start break
                setSessions(prev => prev + 1);
                setIsBreak(true);
                setTimeLeft(APP_CONFIG.BREAK_DURATION * 60);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, isBreak]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => setIsActive(true);
    const handlePause = () => setIsActive(false);
    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(isBreak ? APP_CONFIG.BREAK_DURATION * 60 : APP_CONFIG.POMODORO_DURATION * 60);
    };

    const totalTime = isBreak ? APP_CONFIG.BREAK_DURATION * 60 : APP_CONFIG.POMODORO_DURATION * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Timer className="h-5 w-5 text-electric-aqua" />
                        <span>Pomodoro Timer</span>
                    </CardTitle>
                    <CardDescription>
                        {isBreak ? 'Break time! Relax and recharge.' : 'Focus time! Stay concentrated on your tasks.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <motion.div
                            className="text-4xl font-mono font-bold text-void-black mb-2"
                            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {formatTime(timeLeft)}
                        </motion.div>
                        <p className="text-sm text-void-black/70">
                            {isBreak ? 'Break Time' : 'Focus Time'} • Session {sessions + 1}
                        </p>
                    </div>

                    <Progress value={progress} className="h-2" />

                    <div className="flex justify-center space-x-2">
                        {!isActive ? (
                            <Button variant="gradient" onClick={handleStart}>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={handlePause}>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </Button>
                        )}
                        <Button variant="ghost" onClick={handleReset}>
                            <Square className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>

                    <div className="text-center text-sm text-void-black/70">
                        Completed sessions: {sessions}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}