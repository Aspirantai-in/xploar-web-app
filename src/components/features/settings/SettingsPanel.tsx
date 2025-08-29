'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Palette, Database, Wifi, WifiOff, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';

export function SettingsPanel() {
    const { currentUser, isProUser, resetApplicationState, navigateTo, downgradeFromPro } = useAppStore();
    const [isOfflineSynced, setIsOfflineSynced] = useState(false);

    const handleSyncToggle = () => {
        setIsOfflineSynced(prev => !prev);
        alert(isOfflineSynced ? "Offline data unsynced." : "Offline kit synced successfully!");
    };

    const handleCancelSubscription = () => {
        if (window.confirm("Are you sure you want to cancel your Pro subscription? You will lose access to all Pro features at the end of your billing cycle.")) {
            downgradeFromPro();
            alert("Your Pro subscription has been cancelled.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-void-black mb-2">Settings</h1>
                <p className="text-void-black/70">
                    Manage your account and application preferences
                </p>
            </motion.div>

            <div className="space-y-6">
                {/* Profile Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-electric-aqua" />
                                <span>Profile Settings</span>
                            </CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input value={currentUser?.name || ''} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input value={currentUser?.email || ''} readOnly />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Subscription Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Crown className="h-5 w-5 text-electric-aqua" />
                                <span>Subscription Management</span>
                            </CardTitle>
                            <CardDescription>Manage your xploar.ai subscription plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Your Current Plan: <span className={isProUser ? "text-electric-aqua font-bold" : "font-bold"}>{isProUser ? 'Pro' : 'Free'}</span></p>
                                    <p className="text-sm text-void-black/70">{isProUser ? 'You have access to all premium features.' : 'Upgrade to unlock your full potential.'}</p>
                                </div>
                                {isProUser ? (
                                    <Button variant="destructive" size="sm" onClick={handleCancelSubscription}>
                                        Cancel Subscription
                                    </Button>
                                ) : (
                                    <Button size="sm" onClick={() => navigateTo(FEATURES.PRICING)}>
                                        Upgrade to Pro
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Application Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="h-5 w-5 text-electric-aqua" />
                                <span>Application Settings</span>
                            </CardTitle>
                            <CardDescription>Configure your app preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Notifications</p>
                                    <p className="text-sm text-void-black/70">Receive study reminders and updates</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Bell className="h-4 w-4 mr-2" />
                                    Configure
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Theme</p>
                                    <p className="text-sm text-void-black/70">Customize app appearance</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Palette className="h-4 w-4 mr-2" />
                                    Light Mode
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Offline Kit Sync (Demo)</p>
                                    <p className="text-sm text-void-black/70">Sync your progress for offline access.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleSyncToggle}>
                                    {isOfflineSynced ? <WifiOff className="h-4 w-4 mr-2 text-red-500" /> : <Wifi className="h-4 w-4 mr-2 text-green-500" />}
                                    {isOfflineSynced ? 'Unsync' : 'Sync Now'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Data Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Database className="h-5 w-5 text-electric-aqua" />
                                <span>Data Management</span>
                            </CardTitle>
                            <CardDescription>Manage your application data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Export Data</p>
                                    <p className="text-sm text-void-black/70">Download your study progress and test history</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Export
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-red-600">Reset All Data</p>
                                    <p className="text-sm text-void-black/70">This will delete all your progress permanently</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={resetApplicationState}
                                >
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
