"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number
  onChange: (value: number) => void
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  useEffect(() => {
    setDisplayValue(formatCurrency(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '')
    const numericValue = parseInt(input, 10)
    
    if (!isNaN(numericValue)) {
      onChange(numericValue)
    } else if (input === '') {
      onChange(0)
    }
  }

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(
        displayValue.indexOf(',') - 1,
        displayValue.indexOf(',') - 1
      )
    }
  }

  return (
    <Input
      {...props}
      ref={inputRef}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
}

