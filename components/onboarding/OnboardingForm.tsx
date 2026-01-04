'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Loader2} from 'lucide-react';
import {toast} from 'sonner';

const formSchema = z.object({
    current_role_title: z.string().min(2, 'Please enter your current role'),
    years_experience: z.string().min(1, 'Please select your experience level'),
    target_role_title: z.string().min(2, 'Please enter your target role'),
    location: z.string().min(2, 'Please enter your location'),
    skills: z.string().min(5, 'Please list at least a few skills'),
    education: z.string().optional(),
    industry: z.string().optional(),
    additional_info: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OnboardingForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_role_title: '',
            years_experience: '',
            target_role_title: '',
            location: '',
            skills: '',
            education: '',
            industry: '',
            additional_info: '',
        },
    });

    async function onSubmit(data: FormData) {
        setIsLoading(true);

        try {
            // Convert skills string to array
            const skillsArray = data.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);

            // Prepare profile data
            const profileData = {
                current_role_title: data.current_role_title,
                years_experience: parseInt(data.years_experience),
                target_role_title: data.target_role_title,
                location: data.location,
                background: {
                    skills: skillsArray,
                    education: data.education,
                    industry: data.industry,
                    additional_info: data.additional_info,
                },
            };

            // Call API to generate roadmap
            const response = await fetch('/api/roadmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error('Failed to generate roadmap');
            }

            const result = await response.json();

            // Redirect to dashboard with the roadmap ID
            toast.success('Your personalized roadmap is ready!');
            router.push(`/dashboard?roadmapId=${result.roadmapId}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Tell Us About Yourself</CardTitle>
                <CardDescription>
                    We'll use this information to create your personalized learning roadmap
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="current_role_title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Current Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Full Stack Developer" {...field} />
                                    </FormControl>
                                    <FormDescription>What do you do now?</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="years_experience"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Years of Experience</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your experience level"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Less than 1 year</SelectItem>
                                            <SelectItem value="2">1-2 years</SelectItem>
                                            <SelectItem value="3">3-4 years</SelectItem>
                                            <SelectItem value="5">5-7 years</SelectItem>
                                            <SelectItem value="8">8-10 years</SelectItem>
                                            <SelectItem value="11">10+ years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="target_role_title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Target Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., AI Engineer, Generative AI Developer" {...field} />
                                    </FormControl>
                                    <FormDescription>What role are you aiming for?</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Location (Canada)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your city"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Toronto, ON">Toronto, ON</SelectItem>
                                            <SelectItem value="Vancouver, BC">Vancouver, BC</SelectItem>
                                            <SelectItem value="Montreal, QC">Montreal, QC</SelectItem>
                                            <SelectItem value="Calgary, AB">Calgary, AB</SelectItem>
                                            <SelectItem value="Ottawa, ON">Ottawa, ON</SelectItem>
                                            <SelectItem value="Edmonton, AB">Edmonton, AB</SelectItem>
                                            <SelectItem value="Waterloo, ON">Waterloo, ON</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="skills"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Current Skills</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g., React, Next.js, Node.js, TypeScript, AWS, PostgreSQL"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        List your technical skills, separated by commas
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="education"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Education (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., B.S. Computer Science, Bootcamp Graduate" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="industry"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Industry Experience (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., E-commerce, FinTech, Healthcare" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="additional_info"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Additional Information (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Anything else we should know? Learning style preferences, time constraints, specific goals?"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Generating Your Roadmap...
                                </>
                            ) : (
                                'Generate My Roadmap'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}