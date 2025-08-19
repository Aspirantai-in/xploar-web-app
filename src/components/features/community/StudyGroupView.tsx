'use client';
import { motion } from 'framer-motion';
import { ChevronLeft, Users, Target, Send } from 'lucide-react';
import { StudyGroup } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudyGroupViewProps {
    group: StudyGroup;
    onBack: () => void;
    onLeave: (groupId: string, groupName: string) => void;
}

export function StudyGroupView({ group, onBack, onLeave }: StudyGroupViewProps) {

    const handleLeaveClick = () => {
        onLeave(group.id, group.name);
    };

    return (
        <div>
            <Button variant="outline" onClick={onBack} className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Groups
            </Button>
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Chat Section */}
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>{group.name} - Group Chat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 bg-gray-50 p-4 space-y-4">
                            {/* Chat messages would be listed here */}
                            <div className="text-center text-sm text-gray-500">Chat history is empty.</div>
                        </CardContent>
                        <div className="p-4 border-t flex space-x-2">
                            <Input placeholder="Type a message..." />
                            <Button><Send className="h-4 w-4" /></Button>
                        </div>
                    </Card>
                </div>
                {/* Group Info Section */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2"><Users className="h-5 w-5 text-electric-aqua" /><span>Members</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {group.memberIds.map(id => <li key={id}>User {id.slice(-3)} {id === group.adminId && '(Admin)'}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2"><Target className="h-5 w-5 text-electric-aqua" /><span>Group Goals</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-center text-void-black/50">No goals set yet.</p>
                        </CardContent>
                    </Card>
                    <Button variant="destructive" className="w-full" onClick={handleLeaveClick}>Leave Group</Button>
                </div>
            </div>
        </div>
    );
}
