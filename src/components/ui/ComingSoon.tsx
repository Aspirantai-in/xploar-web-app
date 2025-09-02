import { motion } from 'framer-motion';
import { Construction, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';

interface ComingSoonProps {
    featureName: string;
    description?: string;
}

export function ComingSoon({ featureName, description }: ComingSoonProps) {
    const { navigateTo } = useAppStore();

    const handleGoBack = () => {
        navigateTo(FEATURES.STUDY_PLANNER);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ice-white via-ice-white to-electric-aqua/10 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full text-center"
            >
                <motion.div
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative">
                        <Construction className="w-24 h-24 text-cosmic-indigo" />
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute -top-2 -right-2"
                        >
                            <Calendar className="w-8 h-8 text-neon-lilac" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl font-bold text-dark-blue mb-4"
                >
                    {featureName} Coming Soon!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-dark-blue/70 mb-2 leading-relaxed"
                >
                    {description || `We're working hard to bring you the ${featureName} feature. This will be available once our backend API is fully implemented.`}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-sm text-dark-blue/50 mb-8"
                >
                    In the meantime, explore our Study Planner and Daily Planner features that are fully functional!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="space-y-4"
                >
                    <Button
                        onClick={handleGoBack}
                        className="w-full bg-cosmic-indigo hover:bg-cosmic-indigo/90 text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Study Planner
                    </Button>

                    <motion.div
                        animate={{
                            background: [
                                'linear-gradient(90deg, #4AE3B5 0%, #E879F9 50%, #7C3AED 100%)',
                                'linear-gradient(90deg, #7C3AED 0%, #4AE3B5 50%, #E879F9 100%)',
                                'linear-gradient(90deg, #E879F9 0%, #7C3AED 50%, #4AE3B5 100%)'
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-1 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
