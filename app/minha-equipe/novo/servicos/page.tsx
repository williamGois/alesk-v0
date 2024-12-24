"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InfoIcon } from 'lucide-react'
import { Stepper } from "@/components/stepper"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const MEDICAL_SPECIALTIES = [
  "Oncologia", "Cirurgia cardiovascular", "Cirurgia pediatrica", "Cirurgia torácica",
  "Cirurgia vascular", "Coloproctologia", "Dermatologia", "Gastroenterologia",
  "Genética", "Geriatria", "Hematologia", "Homeopatia", "Infectologia", "Mastologia",
  "Nefrologia", "Neurologia", "Neurocirurgia", "Nutrologia", "Oftalmologia",
  "Ortopedia", "Otorrinologia", "Pneumologia", "Reumatologia", "Urologia",
  "Pediatria", "Clínica geral", "Cirurgia geral"
]

export default function NovoMembroEquipeServicos() {
  const router = useRouter()
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set())

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/minha-equipe/novo/curriculo')
  }

  const handleBack = () => {
    router.push('/minha-equipe/novo/endereco')
  }

  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = new Set(selectedSpecialties)
    if (newSpecialties.has(specialty)) {
      newSpecialties.delete(specialty)
    } else {
      newSpecialties.add(specialty)
    }
    setSelectedSpecialties(newSpecialties)
  }

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">Home</Link>
        <span>/</span>
        <Link href="/minha-equipe" className="hover:text-[#0078FF]">minha equipe</Link>
        <span>/</span>
        <span className="text-gray-400">novo membro</span>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-[#0078FF]">
        Minha Equipe
      </h1>
      <p className="mb-8 text-gray-600">
        Insira as informações dos profissionais da saúde, que
        prestarão serviços na sua unidade, e que aparecerá no aplicativo.
      </p>

      <Card className="mb-8 p-6">
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/placeholder.svg"
                alt="Hospital logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[#0078FF]">Hospital Israelita Albert Einsten</h2>
              <p className="text-sm text-gray-600">Tipo: Hospital</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Steps */}
      <div className="mb-12">
        <Stepper totalSteps={5} currentStep={3} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Tipos de Serviços
          </h3>
        </div>

        <div className="mb-8 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-[#0078FF]">
            <InfoIcon className="h-5 w-5" />
            <span>Se for médico, informar a especialidade:</span>
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <h4 className="mb-4 text-lg font-medium">Selecionar Especialidades</h4>
            <div className="flex flex-wrap gap-2">
              {MEDICAL_SPECIALTIES.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => toggleSpecialty(specialty)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors
                    ${
                      selectedSpecialties.has(specialty)
                        ? "border-[#0078FF] bg-[#0078FF] text-white"
                        : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
                    }`}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full border
                    ${
                      selectedSpecialties.has(specialty)
                        ? "border-white"
                        : "border-[#0078FF]"
                    }`}
                  >
                    {selectedSpecialties.has(specialty) && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium">Outros Serviços que prestam:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Inseria o código na ANS
                </label>
                <Input 
                  placeholder="Digite aqui"
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nome do Procedimento
                </label>
                <Input 
                  placeholder="Digite aqui"
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

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

