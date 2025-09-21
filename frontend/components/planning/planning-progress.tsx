"use client"

interface PlanningProgressProps {
  currentStep: number
  totalSteps: number
  maxAllowedStep?: number
  onStepClick?: (step: number) => void
}

const stepLabels = ["Basic Details", "Destination", "Travel Mode", "Hotels", "Essentials", "Itinerary"]

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

export function PlanningProgress({ currentStep, totalSteps, maxAllowedStep = totalSteps, onStepClick }: PlanningProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Plan Your Trip</h1>
        <span className="text-xs sm:text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Mobile: Simplified horizontal scroll layout */}
      <div className="block sm:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isUpcoming = stepNumber > currentStep
            const isAccessible = stepNumber <= maxAllowedStep
            const isDisabled = stepNumber > maxAllowedStep

            return (
              <div key={stepNumber} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center min-w-[4rem]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold step-smooth ${isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isDisabled
                            ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                            : "bg-muted text-muted-foreground"
                      } ${isAccessible && onStepClick ? "cursor-pointer hover:opacity-80" : ""}`}
                    onClick={() => isAccessible && onStepClick?.(stepNumber)}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                  </div>
                  <span
                    className={`text-[10px] mt-1 text-center leading-tight smooth-transition ${isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : isAccessible && onStepClick
                          ? "cursor-pointer hover:text-primary hover:font-medium active:scale-95"
                          : ""
                      }`}
                    onClick={() => isAccessible && onStepClick?.(stepNumber)}
                  >
                    {stepLabels[index]}
                  </span>
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`h-0.5 w-6 mx-1 smooth-transition flex-shrink-0 ${stepNumber < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden sm:flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep
          const isAccessible = stepNumber <= maxAllowedStep
          const isDisabled = stepNumber > maxAllowedStep

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold step-smooth ${isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isDisabled
                          ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                          : "bg-muted text-muted-foreground"
                    } ${isAccessible && onStepClick ? "cursor-pointer hover:opacity-80" : ""}`}
                  onClick={() => isAccessible && onStepClick?.(stepNumber)}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={`text-xs mt-2 text-center max-w-16 min-h-[2rem] flex items-center justify-center leading-tight smooth-transition ${isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : isAccessible && onStepClick
                        ? "cursor-pointer hover:text-primary hover:font-semibold"
                        : ""
                    }`}
                  onClick={() => isAccessible && onStepClick?.(stepNumber)}
                >
                  {stepLabels[index]}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-0.5 w-12 mx-2 smooth-transition ${stepNumber < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}