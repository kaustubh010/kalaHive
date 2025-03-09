import ArtistSetup from "@/components/artist-setup"
import { OnboardingProgress } from "@/components/onboarding-progress"

export default function ArtistSetupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-8">
        <OnboardingProgress currentStep={2} totalSteps={5} />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <ArtistSetup />
      </div>
    </div>
  )
}

