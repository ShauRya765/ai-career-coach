'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {Award, Target, TrendingUp} from 'lucide-react';

interface ProgressOverviewProps {
    totalItems: number;
    completedItems: number;
    totalWeeks: number;
}

export default function ProgressOverview({
                                             totalItems,
                                             completedItems,
                                             totalWeeks,
                                         }: ProgressOverviewProps) {
    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                    <Progress value={progressPercentage} className="mt-2"/>
                    <p className="text-xs text-muted-foreground mt-2">
                        {completedItems} of {totalItems} items completed
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Estimated Timeline</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalWeeks} weeks</div>
                    <p className="text-xs text-muted-foreground mt-2">
                        ~{Math.round(totalWeeks / 4)} months to complete
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedItems}</div>
                    <p className="text-xs text-muted-foreground mt-2">Skills mastered</p>
                </CardContent>
            </Card>
        </div>
    );
}