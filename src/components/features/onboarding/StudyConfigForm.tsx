'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { getTodayString } from '@/lib/utils/dateUtils';

export function StudyConfigForm() {
    const { studyConfiguration, updateStudyConfig, generateStudyPlan, currentUser } = useAppStore();
    const [goal, setGoal] = useState(studyConfiguration.goal || 'Clear UPSC Prelims 2025');
    const [startDate, setStartDate] = useState(studyConfiguration.startDate || getTodayString());
    const [durationDays, setDurationDays] = useState(studyConfiguration.durationDays.toString());
    const [hoursPerDay, setHoursPerDay] = useState(studyConfiguration.hoursPerDay.toString());

    const handleGeneratePlan = () => {
        const config = {
            goal,
            startDate,
            durationDays: parseInt(durationDays),
            hoursPerDay: parseInt(hoursPerDay),
        };

        updateStudyConfig(config);
        generateStudyPlan();
    };

    const presetGoals = [
        'Clear UPSC Prelims 2025',
        'Clear UPSC Mains 2025',
        'Complete Foundation Course',
        'Revision for Upcoming Exam',
        'Custom Goal'
    ];

    const durationOptions = [
        { value: '30', label: '1 Month' },
        { value: '60', label: '2 Months' },
        { value: '90', label: '3 Months' },
        { value: '180', label: '6 Months' },
        { value: '365', label: '1 Year' },
    ];

    const hoursOptions = [
        { value: '2', label: '2 hours/day' },
        { value: '3', label: '3 hours/day' },
        { value: '4', label: '4 hours/day' },
        { value: '5', label: '5 hours/day' },
        { value: '6', label: '6 hours/day' },
        { value: '8', label: '8 hours/day' },
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">
                    Let's Create Your Study Plan
                </h1>
                <p className="text-void-black/70">
                    Tell us about your goals and we'll generate a personalized study schedule
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Target className="h-5 w-5 text-electric-aqua" />
                            <span>Study Configuration</span>
                        </CardTitle>
                        <CardDescription>
                            Configure your study plan based on your timeline and availability
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Goal Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center space-x-2">
                                <Target className="h-4 w-4" />
                                <span>Study Goal</span>
                            </label>
                            <Select value={goal} onValueChange={setGoal}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your goal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {presetGoals.map((presetGoal) => (
                                        <SelectItem key={presetGoal} value={presetGoal}>
                                            {presetGoal}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {goal === 'Custom Goal' && (
                                <Input
                                    placeholder="Enter your custom goal"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Start Date</span>
                            </label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={getTodayString()}
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Study Duration</span>
                            </label>
                            <Select value={durationDays} onValueChange={setDurationDays}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durationOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Hours Per Day */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Daily Study Hours</span>
                            </label>
                            <Select value={hoursPerDay} onValueChange={setHoursPerDay}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select daily hours" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hoursOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Summary */}
                        <motion.div
                            className="p-4 bg-dark-blue/5 rounded-lg border border-dark-blue/20"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="font-semibold mb-2">Plan Summary</h3>
                            <div className="text-sm text-void-black/70 space-y-1">
                                <p><strong>Goal:</strong> {goal}</p>
                                <p><strong>Duration:</strong> {durationDays} days ({Math.round(parseInt(durationDays) / 30)} months)</p>
                                <p><strong>Daily Commitment:</strong> {hoursPerDay} hours</p>
                                <p><strong>Total Study Hours:</strong> {parseInt(durationDays) * parseInt(hoursPerDay)} hours</p>
                            </div>
                        </motion.div>

                        <Button
                            variant="default"
                            size="lg"
                            className="w-full"
                            onClick={handleGeneratePlan}
                        >
                            Generate My Study Plan
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
