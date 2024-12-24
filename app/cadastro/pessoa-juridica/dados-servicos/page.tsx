"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InfoIcon } from 'lucide-react'
import { Stepper } from "@/components/stepper"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Constants for different specialties and options
const MEDICAL_SPECIALTIES = [
  "Oncologia", "Cirurgia cardiovascular", "Cirurgia pediatrica", "Cirurgia torácica",
  "Cirurgia vascular", "Coloproctologia", "Dermatologia", "Gastroenterologia",
  "Genética", "Geriatria", "Hematologia", "Homeopatia", "Infectologia", "Mastologia",
  "Nefrologia", "Neurologia", "Neurocirurgia", "Nutrologia", "Oftalmologia",
  "Ortopedia", "Otorrinologia", "Pneumologia", "Reumatologia", "Urologia",
  "Pediatria", "Clínica geral", "Cirurgia geral"
]

const DENTAL_SPECIALTIES = [
  "Clínica Geral", "Odontopediatria Infantil", "Radiologia", "Dentista",
  "Periodontia", "Prótese", "Ortodontia", "Implantodontia",
  "Cirurgia e traumatologia", "Prótese Buco maxilo Facial",
  "Disfunção têmpero mandibular", "Estomatologia", "Odontogeriatria",
  "Odontologia para pessoas especiais"
]

const PHYSIO_SPECIALTIES = [
  "Fisioterapia geral", "Acupuntura", "Cardiovascular", "Dermato Funcional",
  "Esportiva", "Do trabalho", "Neurofuncional", "Oncologia", "Respiratória",
  "Traumato Ortopédica", "Saúde da Mulher", "Aquática", "Terapia intensiva",
  "Osteopatia", "Quiropraxia", "Gerontologia"
]

const EXAM_CATEGORIES = [
  "Exames por imagens", "Exames clínicos", "Demais tipos de exames"
]

const CARE_METHODS = [
  "Teleconsulta", "Na clínica", "Atendimento domicílio do paciente"
]

const HOSPITAL_SERVICES = [
  "Inserção por procedimento", "Importação de arquivo XML ou XLS"
]

export default function DadosServicos() {
  const router = useRouter()
  const [category, setCategory] = useState<string>("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set())
  const [selectedMethods, setSelectedMethods] = useState<Set<string>>(new Set())

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/cadastro/pessoa-juridica/senha')
  }

  const handleBack = () => {
    router.push('/cadastro/pessoa-juridica/servicos')
  }

  const toggleSelection = (item: string, set: Set<string>, setFunction: (value: Set<string>) => void) => {
    const newSet = new Set(set)
    if (newSet.has(item)) {
      newSet.delete(item)
    } else {
      newSet.add(item)
    }
    setFunction(newSet)
  }

  const renderSpecialties = () => {
    let specialties: string[] = []
    let title = "Selecionar Especialidades"

    switch (category) {
      case "medico":
        specialties = MEDICAL_SPECIALTIES
        break
      case "dentista":
        specialties = DENTAL_SPECIALTIES
        break
      case "fisioterapeuta":
        specialties = PHYSIO_SPECIALTIES
        break
      case "empresa":
        specialties = EXAM_CATEGORIES
        title = "Categoria de Exames"
        break
      case "hospital":
        specialties = HOSPITAL_SERVICES
        title = "Serviços Hospitalares"
        break
      default:
        return null
    }

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => toggleSelection(specialty, selectedSpecialties, setSelectedSpecialties)}
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
    )
  }

  const renderAdditionalFields = () => {
    if (category === "medico" || category === "hospital") {
      return (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            {category === "hospital" 
              ? "Preencha os dados para procedimentos manuais"
              : "Outros serviços que prestam:"
            }
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Código na ANS do procedimento
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
          {category === "hospital" && (
            <>
              <p className="text-sm text-[#0078FF]">
                Para os dados automático é necessário importar a tabela
              </p>
              <Button variant="secondary" className="w-auto">
                Importar
              </Button>
            </>
          )}
        </div>
      )
    }
    return null
  }

  const renderCareMethods = () => {
    if (["empresa", "hospital"].includes(category)) {
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Meios de atendimentos dos pacientes</h4>
          <div className="flex flex-wrap gap-2">
            {CARE_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => toggleSelection(method, selectedMethods, setSelectedMethods)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors
                  ${
                    selectedMethods.has(method)
                      ? "border-[#0078FF] bg-[#0078FF] text-white"
                      : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
                  }`}
              >
                <div className={`flex h-4 w-4 items-center justify-center rounded-full border
                  ${
                    selectedMethods.has(method)
                      ? "border-white"
                      : "border-[#0078FF]"
                  }`}
                >
                  {selectedMethods.has(method) && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                {method}
              </button>
            ))}
          </div>
        </div>
      )
    }
    return null
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
        Cadastro de pessoa jurídica
      </h2>

      {/* Progress Steps */}
      <div className="mb-12">
        <Stepper totalSteps={7} currentStep={6} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Dados dos serviços prestados
          </h3>
        </div>

        <div className="mb-8 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-[#0078FF]">
            <InfoIcon className="h-5 w-5" />
            <span>Selecione abaixo as categorias a serem prestadas</span>
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Selecionar Categoria
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medico">Médico</SelectItem>
                <SelectItem value="dentista">Cirurgião Dentista</SelectItem>
                <SelectItem value="fisioterapeuta">Fisioterapeuta</SelectItem>
                <SelectItem value="empresa">Empresa</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderSpecialties()}
          {renderAdditionalFields()}
          {renderCareMethods()}

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

