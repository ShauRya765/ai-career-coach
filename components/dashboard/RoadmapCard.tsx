'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {CheckCircle2, Circle, ExternalLink} from 'lucide-react';
import type {RoadmapItem} from '@/types';

interface RoadmapCardProps {
    item: RoadmapItem;
    onToggleComplete: (itemId: string) => void;
}

export default function RoadmapCard({item, onToggleComplete}: RoadmapCardProps) {
    const categoryColors = {
        foundation: 'bg-blue-100 text-blue-800',
        technical: 'bg-purple-100 text-purple-800',
        practical: 'bg-green-100 text-green-800',
        career: 'bg-orange-100 text-orange-800',
    };

    const priorityColors = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-gray-100 text-gray-800',
    };

    return (
        <Card className={item.completed ? 'opacity-60' : ''}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={categoryColors[item.category]} variant="secondary">
                                {item.category}
                            </Badge>
                            <Badge className={priorityColors[item.priority]} variant="secondary">
                                {item.priority} priority
                            </Badge>
                            <Badge variant="outline">{item.estimatedWeeks} weeks</Badge>
                        </div>
                        <CardTitle className="flex items-center gap-2">
                            <button
                                onClick={() => onToggleComplete(item.id)}
                                className="flex-shrink-0"
                            >
                                {item.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600"/>
                                ) : (
                                    <Circle className="h-5 w-5 text-gray-400"/>
                                )}
                            </button>
                            <span className={item.completed ? 'line-through' : ''}>{item.title}</span>
                        </CardTitle>
                    </div>
                </div>
                <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Resources:</p>
                    <div className="space-y-1">
                        {item.resources.map((resource, index) => (
                            <a
                                key={index}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                <ExternalLink className="h-3 w-3"/>
                                {resource.title}
                                {resource.free && (
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        Free
                                    </Badge>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}