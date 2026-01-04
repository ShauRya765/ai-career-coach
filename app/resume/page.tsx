'use client';

import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Loader2, Upload, Sparkles, Copy, Check} from 'lucide-react';
import {toast} from 'sonner';

export default function ResumePage() {
    const [currentResume, setCurrentResume] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [optimizedResume, setOptimizedResume] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const fileType = file.type;
        if (fileType !== 'text/plain' && fileType !== 'application/pdf') {
            toast.error('Please upload a .txt or .pdf file');
            return;
        }

        try {
            if (fileType === 'text/plain') {
                const text = await file.text();
                setCurrentResume(text);
                toast.success('Resume uploaded successfully!');
            } else if (fileType === 'application/pdf') {
                // For PDF, we'll use a simple approach
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/parse-pdf', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Failed to parse PDF');

                const {text} = await response.json();
                setCurrentResume(text);
                toast.success('Resume uploaded and parsed!');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload resume');
        }
    };

    const optimizeResume = async () => {
        if (!currentResume.trim()) {
            toast.error('Please add your current resume first');
            return;
        }

        if (!jobDescription.trim()) {
            toast.error('Please add the job description');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/optimize-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentResume,
                    jobDescription,
                }),
            });

            if (!response.ok) throw new Error('Failed to optimize resume');

            const data = await response.json();
            setOptimizedResume(data.optimizedResume);
            toast.success('Resume optimized successfully! 🎉');
        } catch (error) {
            console.error('Error optimizing resume:', error);
            toast.error('Failed to optimize resume');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(optimizedResume);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy');
        }
    };

    const downloadResume = () => {
        const blob = new Blob([optimizedResume], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized-resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Resume downloaded!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        AI Resume Optimizer
                    </h1>
                    <p className="text-lg text-gray-600">
                        Tailor your resume to any job description with AI-powered optimization
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Current Resume */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Current Resume</CardTitle>
                            <CardDescription>
                                Upload a file or paste your resume text
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="resume-upload" className="cursor-pointer">
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2"/>
                                        <p className="text-sm text-gray-600">
                                            Click to upload .txt or .pdf file
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            or paste your resume below
                                        </p>
                                    </div>
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".txt,.pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <Textarea
                                placeholder="Paste your current resume here..."
                                value={currentResume}
                                onChange={(e) => setCurrentResume(e.target.value)}
                                className="min-h-[400px] font-mono text-sm"
                            />
                        </CardContent>
                    </Card>

                    {/* Job Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Description</CardTitle>
                            <CardDescription>
                                {`Paste the job posting you're applying for`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Paste the job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="min-h-[490px] text-sm"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Optimize Button */}
                <div className="flex justify-center mb-6">
                    <Button
                        onClick={optimizeResume}
                        disabled={isLoading || !currentResume.trim() || !jobDescription.trim()}
                        size="lg"
                        className="px-8"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                Optimizing with AI...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5"/>
                                Optimize Resume
                            </>
                        )}
                    </Button>
                </div>

                {/* Optimized Resume */}
                {optimizedResume && (
                    <Card className="border-2 border-blue-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-blue-600">
                                        ✨ Optimized Resume
                                    </CardTitle>
                                    <CardDescription>
                                        Tailored to match the job description
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                                        {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                    <Button onClick={downloadResume} variant="outline" size="sm">
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="formatted" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="formatted">Formatted View</TabsTrigger>
                                    <TabsTrigger value="raw">Raw Text</TabsTrigger>
                                </TabsList>

                                <TabsContent value="formatted" className="mt-4">
                                    <div className="prose max-w-none bg-white p-6 rounded-lg border">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: optimizedResume
                                                    .replace(/\n\n/g, '</p><p>')
                                                    .replace(/\n/g, '<br />')
                                                    .replace(/^/, '<p>')
                                                    .replace(/$/, '</p>')
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            }}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="raw" className="mt-4">
                                    <Textarea
                                        value={optimizedResume}
                                        onChange={(e) => setOptimizedResume(e.target.value)}
                                        className="min-h-[500px] font-mono text-sm"
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}

                {/* Tips Section */}
                <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-lg">💡 Tips for Best Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-gray-700">
                        <p>• <strong>Be specific:</strong> Include complete job descriptions with requirements and
                            responsibilities</p>
                        <p>• <strong>Include metrics:</strong> The AI will highlight and enhance quantifiable
                            achievements</p>
                        <p>• <strong>Review carefully:</strong> Always review and edit the optimized version before
                            using it</p>
                        <p>• <strong>Keep it
                            honest:</strong> {`The AI enhances your experience but doesn't fabricate qualifications`}
                        </p>
                        <p>• <strong>Use keywords:</strong> The AI will naturally incorporate relevant keywords from the
                            job posting</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}