"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string
  value: string
  onChange: (value: string) => void
}

export function MaskedInput({ mask, value, onChange, ...props }: MaskedInputProps) {
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    const input = document.getElementById(props.id as string) as HTMLInputElement
    if (input) {
      input.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [value, cursorPosition, props.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const unmaskedValue = value.replace(/[^\d]/g, '')
    let maskedValue = ''
    let i = 0
    let j = 0

    while (i < mask.length && j < unmaskedValue.length) {
      if (mask[i] === '9') {
        maskedValue += unmaskedValue[j]
        j++
      } else {
        maskedValue += mask[i]
      }
      i++
    }

    onChange(maskedValue)
    setCursorPosition(maskedValue.length)
  }

  return (
    <Input
      {...props}
      value={value}
      onChange={handleChange}
      onKeyDown={(e) => {
        if (e.key === 'Backspace') {
          e.preventDefault()
          const newValue = value.slice(0, -1)
          onChange(newValue)
          setCursorPosition(newValue.length)
        }
      }}
    />
  )
}

