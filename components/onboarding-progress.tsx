import { Progress } from "@/components/ui/progress"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Setting up your profile</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  )
}

