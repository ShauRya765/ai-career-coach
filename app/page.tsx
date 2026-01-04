import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Users, FileText } from 'lucide-react';

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-600">AI Career Coach</h2>
            <Link href="/resume">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Resume Optimizer
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your AI-Powered Career Transition Coach
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get a personalized roadmap to break into AI and tech roles in Canada.
              Built by someone going through the same journey.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="text-lg px-8">
                  Start Your Journey <ArrowRight className="ml-2" />
                </Button>
              </Link>
              {/*<Link href="/resume">*/}
              {/*  <Button size="lg" variant="outline" className="text-lg px-8">*/}
              {/*    <FileText className="mr-2 h-5 w-5" />*/}
              {/*    Optimize Resume*/}
              {/*  </Button>*/}
              {/*</Link>*/}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Roadmap</h3>
              <p className="text-gray-600">
                AI analyzes your background and creates a custom learning path tailored to your experience
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning journey with milestones and celebrate achievements
              </p>
            </div>

            {/*<div className="text-center">*/}
            {/*  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">*/}
            {/*    <FileText className="w-8 h-8 text-purple-600" />*/}
            {/*  </div>*/}
            {/*  <h3 className="text-xl font-semibold mb-2">Resume Optimizer</h3>*/}
            {/*  <p className="text-gray-600">*/}
            {/*    AI-powered resume tailoring to match any job description perfectly*/}
            {/*  </p>*/}
            {/*</div>*/}

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Canadian Market Focus</h3>
              <p className="text-gray-600">
                Resources and advice specific to the Canadian tech and AI job market
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}