'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
    roadmapId: string;
}

export default function ShareButton({ roadmapId }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/dashboard?roadmapId=${roadmapId}`
        : '';

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const shareOnTwitter = () => {
        const text = encodeURIComponent('Just created my AI career transition roadmap! 🚀');
        const url = encodeURIComponent(shareUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        const url = encodeURIComponent(shareUrl);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Roadmap
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Your Roadmap</DialogTitle>
                    <DialogDescription>
                        Share your personalized learning journey with others or save it for later
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-50"
                        />
                        <Button onClick={copyToClipboard} variant="outline" size="sm">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={shareOnLinkedIn} variant="outline" className="w-full">
                            Share on LinkedIn
                        </Button>
                        <Button onClick={shareOnTwitter} variant="outline" className="w-full">
                            Share on Twitter
                        </Button>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">💡 Pro Tip:</p>
                        <p className="text-sm text-gray-500">
                            Bookmark this link to access your roadmap anytime. Consider sharing your progress
                            on LinkedIn to connect with others in the AI community!
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}