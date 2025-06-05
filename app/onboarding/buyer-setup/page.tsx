// import { BuyerSetup } from "@/components/buyer-setup"
import { OnboardingProgress } from "@/components/onboarding-progress"

export default function BuyerSetupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-8">
        <OnboardingProgress currentStep={2} totalSteps={3} />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        {/* <BuyerSetup /> */}
      </div>
    </div>
  )
}

