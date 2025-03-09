import { UserTypeSelection } from "@/components/user-type-selection"
import { OnboardingProgress } from "@/components/onboarding-progress"

export default function UserTypePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-8">
        <OnboardingProgress currentStep={1} totalSteps={5} />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <UserTypeSelection />
      </div>
    </div>
  )
}

