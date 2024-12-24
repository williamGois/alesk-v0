import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CareTypeButtonProps {
  icon: React.ReactElement
  label: string
  selected: boolean
  onClick: () => void
}

export function CareTypeButton({ icon, label, selected, onClick }: CareTypeButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex flex-col items-center justify-center h-20 w-full gap-1 rounded-lg transition-colors",
        selected
          ? "bg-[#0078FF] text-white hover:bg-blue-600"
          : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
      )}
      onClick={onClick}
    >
      {React.cloneElement(icon, { className: "h-16 w-16" })}
      <span className="text-xs font-medium text-center">{label}</span>
    </Button>
  )
}

