"use client"

import { cn } from "@/lib/utils"

interface OptionButtonProps {
  selected?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export function OptionButton({ selected, onClick, children, className }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-full border-2 border-[#0078FF] px-6 py-3 text-[#0078FF] transition-colors hover:bg-blue-50",
        className
      )}
    >
      <div className={cn(
        "flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0078FF]",
        selected && "bg-[#0078FF]"
      )}>
        {selected && (
          <div className="h-2 w-2 rounded-full bg-white" />
        )}
      </div>
      <span className="text-base font-medium">{children}</span>
    </button>
  )
}

