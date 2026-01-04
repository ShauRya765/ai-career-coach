import OnboardingForm from '@/components/onboarding/OnboardingForm';

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {`Let's Build Your Roadmap`}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {`This will take about 2 minutes`}
                    </p>
                </div>
                <OnboardingForm/>
            </div>
        </div>
    );
}