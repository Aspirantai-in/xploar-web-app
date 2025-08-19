'use client';
import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy data for the leaderboard
const leaderboardData = [
    { rank: 1, name: 'Ananya S.', points: 1250, tier: 'Diamond' },
    { rank: 2, name: 'Rohan V.', points: 1180, tier: 'Diamond' },
    { rank: 3, name: 'Priya K.', points: 1120, tier: 'Platinum' },
    { rank: 4, name: 'You', points: 1050, tier: 'Platinum' },
    { rank: 5, name: 'Sameer P.', points: 980, tier: 'Gold' },
    { rank: 6, name: 'Kavita M.', points: 950, tier: 'Gold' },
    { rank: 7, name: 'Vikram R.', points: 890, tier: 'Silver' },
];

export function Leaderboard() {
    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Diamond': return 'text-blue-400';
            case 'Platinum': return 'text-purple-500';
            case 'Gold': return 'text-yellow-500';
            default: return 'text-gray-400';
        }
    };

    return (
        <Card>
            <CardHeader className="text-center">
                <Trophy className="h-12 w-12 mx-auto text-yellow-400 mb-2" />
                <CardTitle>Weekly Leaderboard</CardTitle>
                <CardDescription>See how you rank among your peers this week. Keep up the great work!</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {leaderboardData.map((user, index) => (
                        <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg flex items-center justify-between ${user.name === 'You' ? 'bg-electric-aqua/20 border-2 border-electric-aqua' : 'bg-gray-50'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-lg w-6 text-center">{user.rank}</span>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <div className="flex items-center space-x-1">
                                        <Star className={`h-4 w-4 ${getTierColor(user.tier)}`} />
                                        <span className={`text-xs font-medium ${getTierColor(user.tier)}`}>{user.tier} Tier</span>
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-lg text-dark-blue">{user.points} pts</span>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
