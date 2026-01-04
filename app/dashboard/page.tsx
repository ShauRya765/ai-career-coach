'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Roadmap, RoadmapItem } from '@/types';
import RoadmapCard from '@/components/dashboard/RoadmapCard';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import ShareButton from '@/components/dashboard/ShareButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportToPDF } from '@/lib/exportPDF';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const roadmapId = searchParams.get('roadmapId');

    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [completedItems, setCompletedItems] = useState<string[]>([]);

    useEffect(() => {
        if (roadmapId) {
            loadRoadmap(roadmapId);
        }
    }, [roadmapId]);

    async function loadRoadmap(id: string) {
        try {
            const { data, error } = await supabase
                .from('roadmaps')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            const roadmapData: Roadmap = {
                ...data.roadmap_data,
                id: data.id,
                user_id: data.user_id,
                created_at: data.created_at,
                progress: data.progress,
                completed_items: data.completed_items || [],
            };

            roadmapData.items = roadmapData.items.map((item) => ({
                ...item,
                completed: data.completed_items?.includes(item.id) || false,
            }));

            setRoadmap(roadmapData);
            setCompletedItems(data.completed_items || []);
        } catch (error) {
            console.error('Error loading roadmap:', error);
            toast.error('Failed to load roadmap');
        } finally {
            setLoading(false);
        }
    }

    async function toggleItemComplete(itemId: string) {
        if (!roadmap) return;

        const isCompleted = completedItems.includes(itemId);
        const newCompletedItems = isCompleted
            ? completedItems.filter((id) => id !== itemId)
            : [...completedItems, itemId];

        const newProgress = Math.round((newCompletedItems.length / roadmap.items.length) * 100);

        try {
            const { error } = await supabase
                .from('roadmaps')
                .update({
                    completed_items: newCompletedItems,
                    progress: newProgress,
                })
                .eq('id', roadmap.id);

            if (error) throw error;

            setCompletedItems(newCompletedItems);

            setRoadmap({
                ...roadmap,
                items: roadmap.items.map((item) => ({
                    ...item,
                    completed: newCompletedItems.includes(item.id),
                })),
                progress: newProgress,
            });

            toast.success(isCompleted ? 'Item unmarked' : 'Great job! Keep going! 🎉');
        } catch (error) {
            console.error('Error updating progress:', error);
            toast.error('Failed to update progress');
        }
    }

    const handleExportPDF = () => {
        if (roadmap) {
            exportToPDF(roadmap);
            toast.success('Opening print dialog...');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Roadmap Not Found</CardTitle>
                        <CardDescription>
                            {`We couldn't find the roadmap you're looking for.`}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const itemsByCategory = {
        foundation: roadmap.items.filter((item) => item.category === 'foundation'),
        technical: roadmap.items.filter((item) => item.category === 'technical'),
        practical: roadmap.items.filter((item) => item.category === 'practical'),
        career: roadmap.items.filter((item) => item.category === 'career'),
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header with Share/Export */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Learning Roadmap</h1>
                            <p className="text-lg text-gray-600">{roadmap.summary}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <ShareButton roadmapId={roadmap.id!} />
                            <Button onClick={handleExportPDF} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Progress Overview */}
                <ProgressOverview
                    totalItems={roadmap.items.length}
                    completedItems={completedItems.length}
                    totalWeeks={roadmap.totalWeeks}
                />

                {/* Phases Overview */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Your Journey Phases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            {roadmap.phases.map((phase, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="font-semibold text-lg">{phase.name}</h3>
                                    <p className="text-sm text-gray-600">{phase.duration}</p>
                                    <p className="text-sm text-gray-700 mt-1">{phase.focus}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Roadmap Items by Category */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="all">
                            All ({roadmap.items.length})
                        </TabsTrigger>
                        <TabsTrigger value="foundation">
                            Foundation ({itemsByCategory.foundation.length})
                        </TabsTrigger>
                        <TabsTrigger value="technical">
                            Technical ({itemsByCategory.technical.length})
                        </TabsTrigger>
                        <TabsTrigger value="practical">
                            Practical ({itemsByCategory.practical.length})
                        </TabsTrigger>
                        <TabsTrigger value="career">
                            Career ({itemsByCategory.career.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-6">
                        {roadmap.items.map((item) => (
                            <RoadmapCard
                                key={item.id}
                                item={item}
                                onToggleComplete={toggleItemComplete}
                            />
                        ))}
                    </TabsContent>

                    {Object.entries(itemsByCategory).map(([category, items]) => (
                        <TabsContent key={category} value={category} className="space-y-4 mt-6">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <RoadmapCard
                                        key={item.id}
                                        item={item}
                                        onToggleComplete={toggleItemComplete}
                                    />
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="py-8 text-center text-gray-500">
                                        No items in this category
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}