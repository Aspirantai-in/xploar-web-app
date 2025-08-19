'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, PlusCircle, ChevronLeft, Send } from 'lucide-react';
import { SAMPLE_STUDY_GROUPS } from '@/lib/data/extended-data';
import { StudyGroup } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StudyGroupView } from './StudyGroupView';
import { useAppStore } from '@/lib/store';

export function StudyGroups() {
    const [groups, setGroups] = useState<StudyGroup[]>(SAMPLE_STUDY_GROUPS);
    const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
    const [view, setView] = useState<'list' | 'create'>('list');
    const { createStudyGroup } = useAppStore();

    // State for new group form
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');

    const handleCreateGroup = () => {
        if (!newGroupName || !newGroupDesc) return;
        const groupData = { name: newGroupName, description: newGroupDesc };
        createStudyGroup(groupData);
        // Add to local state to simulate real-time update
        setGroups(prev => [{
            ...groupData,
            id: `group_${Date.now()}`,
            createdAt: new Date().toISOString(),
            adminId: 'user_current_001',
            memberIds: ['user_current_001']
        }, ...prev]);
        alert(`Study group "${newGroupName}" has been created!`);
        // Reset form and view
        setNewGroupName('');
        setNewGroupDesc('');
        setView('list');
    };

    const handleLeaveGroup = (groupId: string, groupName: string) => {
        // In a real app, you might use a custom modal component instead of window.confirm
        if (window.confirm(`Are you sure you want to leave the group "${groupName}"?`)) {
            setGroups(prev => prev.filter(g => g.id !== groupId));
            setSelectedGroup(null);
            alert("You have left the group.");
        }
    };

    if (selectedGroup) {
        return <StudyGroupView group={selectedGroup} onBack={() => setSelectedGroup(null)} onLeave={handleLeaveGroup} />;
    }

    if (view === 'create') {
        return (
            <div>
                <Button variant="outline" onClick={() => setView('list')} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Groups
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Study Group</CardTitle>
                        <CardDescription>Start a new group to collaborate with peers on specific topics.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Group Name</label>
                            <Input
                                placeholder="e.g., Polity Masters 2025"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="w-full h-24 p-3 border border-dark-blue/20 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-dark-blue bg-ice-white text-sm"
                                placeholder="What is the focus of this group?"
                                value={newGroupDesc}
                                onChange={(e) => setNewGroupDesc(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleCreateGroup} disabled={!newGroupName || !newGroupDesc}>
                            <PlusCircle className="h-4 w-4 mr-2" /> Create Group
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Study Groups</CardTitle>
                    <CardDescription>Find and join groups to study with peers.</CardDescription>
                </div>
                <Button onClick={() => setView('create')}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Create Group
                </Button>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group, index) => (
                    <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">{group.name}</CardTitle>
                                <CardDescription>{group.memberIds.length} members</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-void-black/80">{group.description}</p>
                            </CardContent>
                            <div className="p-4 pt-0">
                                <Button className="w-full" onClick={() => setSelectedGroup(group)}>View Group</Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
