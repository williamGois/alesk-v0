interface RadioOptionButtonProps {
  selected?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export function RadioOptionButton({ selected, onClick, children, className }: RadioOptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border border-[#0078FF] px-4 py-2 text-[#0078FF] transition-colors hover:bg-blue-50"
    >
      <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0078FF] ${
        selected ? "bg-[#0078FF]" : ""
      }`}>
        {selected && (
          <div className="h-2 w-2 rounded-full bg-white" />
        )}
      </div>
      <span className="text-base">{children}</span>
    </button>
  )
}

