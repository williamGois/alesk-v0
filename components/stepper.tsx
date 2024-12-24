interface StepperProps {
  totalSteps: number
  currentStep: number
}

export function Stepper({ totalSteps, currentStep }: StepperProps) {
  return (
    <div className="relative flex w-full justify-between">
      {/* Background Line */}
      <div className="absolute top-4 left-0 h-[2px] w-full bg-gray-200">
        <div 
          className="h-full bg-[#0078FF] transition-all duration-300" 
          style={{ 
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }} 
        />
      </div>

      {/* Steps */}
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className="relative flex flex-col items-center"
        >
          <div
            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
              ${
                step <= currentStep
                  ? "bg-[#0078FF] text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  )
}

