"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Stepper } from "@/components/stepper"
import Link from "next/link"
import { useRouter } from "next/navigation"

const DAYS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
]

interface TimeSlot {
  start: string
  end: string
}

interface DaySchedule {
  enabled: boolean
  slots: TimeSlot[]
}

export default function Horarios() {
  const router = useRouter()
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: {
        enabled: false,
        slots: [{ start: "", end: "" }]
      }
    }), {})
  )

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }))
  }

  const addTimeSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "", end: "" }]
      }
    }))
  }

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }))
  }

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }))
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/cadastro/pessoa-fisica/conclusao')
  }

  const handleBack = () => {
    router.push('/cadastro/pessoa-fisica/curriculo')
  }

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">Home</Link>
        <span>/</span>
        <Link href="/cadastro" className="hover:text-[#0078FF]">meu cadastro</Link>
        <span>/</span>
        <span className="text-gray-400">prestador de serviço</span>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-[#0078FF]">
        Meu Cadastro
      </h1>
      <h2 className="mb-8 text-lg text-gray-600">
        Cadastro do prestador de serviço
      </h2>

      {/* Progress Steps */}
      <div className="mb-12">
        <Stepper totalSteps={7} currentStep={7} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Horários de Atendimento
          </h3>
          <p className="mt-2 text-gray-600">
            Configure seus horários de atendimento para cada dia da semana
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-8">
          {DAYS.map((day) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={day}
                  checked={schedule[day].enabled}
                  onCheckedChange={() => toggleDay(day)}
                />
                <label
                  htmlFor={day}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day}
                </label>
              </div>

              {schedule[day].enabled && (
                <div className="ml-6 space-y-4">
                  {schedule[day].slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Início
                          </label>
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                            className="bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Fim
                          </label>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(day, index)}
                          className="mt-6"
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(day)}
                  >
                    Adicionar horário
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between">
            <Button 
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button 
              type="submit"
              className="bg-[#0078FF] px-8 hover:bg-blue-600"
            >
              Próximo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

