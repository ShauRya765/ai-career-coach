export interface UserProfile {
    id?: string;
    current_role_title: string;
    years_experience: number;
    target_role_title: string;
    location: string;
    background: {
        skills: string[];
        education?: string;
        industry?: string;
        additional_info?: string;
    };
}

export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    category: 'foundation' | 'technical' | 'practical' | 'career';
    priority: 'high' | 'medium' | 'low';
    estimatedWeeks: number;
    resources: Resource[];
    completed?: boolean;
}

export interface Resource {
    title: string;
    url: string;
    type: 'course' | 'article' | 'video' | 'book' | 'tool';
    free: boolean;
}

export interface Roadmap {
    id?: string;
    user_id?: string;
    created_at?: string;
    summary: string;
    totalWeeks: number;
    phases: Phase[];
    items: RoadmapItem[];
    progress?: number;
    completed_items?: string[];
}

export interface Phase {
    name: string;
    duration: string;
    focus: string;
}