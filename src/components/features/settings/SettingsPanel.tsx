'use client';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Palette, Database, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';

export function SettingsPanel() {
    const { currentUser, isProUser, resetApplicationState } = useAppStore();

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
                            {isProUser && (
                                <div className="p-3 bg-dark-blue/10 rounded-lg border border-dark-blue/20">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-dark-blue rounded-full"></div>
                                        <span className="text-sm font-medium text-dark-blue">Pro Member</span>
                                    </div>
                                    <p className="text-xs text-void-black/70 mt-1">
                                        You have access to all premium features
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Application Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
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
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Data Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
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

                {/* About */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Info className="h-5 w-5 text-electric-aqua" />
                                <span>About xploar.ai</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-void-black/70 space-y-2">
                                <p><strong>Version:</strong> 1.0.0</p>
                                <p><strong>Build:</strong> Production</p>
                                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="pt-4 border-t border-electric-aqua/20">
                                <p className="text-sm text-void-black/70">
                                    Built with ❤️ for UPSC aspirants across India.
                                    Your success is our mission.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}