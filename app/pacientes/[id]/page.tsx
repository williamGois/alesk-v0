"use client"

import { useState } from "react"
import { ArrowLeft, Edit2, Plus, X, Check, MoreVertical, Printer, Calendar, Bold, List, ImageIcon, FileText, FileCheck, FileIcon as FileSparkles, FilePlus2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { NewPrescription } from "./components/new-prescription"

interface RadioOptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function RadioOptionButton({ selected, onClick, children, className }: RadioOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
        selected
          ? "border-[#0078FF] bg-[#0078FF] text-white"
          : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50",
        className
      )}
    >
      <div className={cn(
        "flex h-4 w-4 items-center justify-center rounded-full border-2",
        selected ? "border-white" : "border-[#0078FF]"
      )}>
        {selected && (
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        )}
      </div>
      <span>{children}</span>
    </button>
  )
}


interface PatientData {
  id: string
  name: string
  code: string
  patientNumber: string
  cpf: string
  birthDate: string
  age: number
  gender: string
  phone: string
  address: {
    street: string
    neighborhood: string
    zipCode: string
    city: string
    state: string
  }
}

interface Appointment {
  date: string
  time: string
  status: string
  doctor: string
}

interface Procedure {
  quantity: number
  name: string
  value: number
  code: string
}

interface Treatment {
  date: string
  description: string
  doctor: string
  signed: boolean
}

interface EditEvolutionData {
  professional: string
  date: string
  description: string
}

interface AnamnesesQuestion {
  question: string
  type: 'text' | 'radio'
  options?: string[]
  maxLength?: number
}

interface DocumentType {
  id: string
  title: string
  icon: React.ReactNode
  color: string
}

const MOCK_PATIENT: PatientData = {
  id: "1",
  name: "Lucas Pereira de Sousa",
  code: "652326",
  patientNumber: "15928",
  cpf: "022.283.301-75",
  birthDate: "13 de nov. de 1996",
  age: 28,
  gender: "Feminino",
  phone: "+55 62 99437 1834",
  address: {
    street: "Avenida Atlântida",
    neighborhood: "Independência",
    zipCode: "74967420",
    city: "Aparecida de Goiânia",
    state: "GO"
  }
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    date: "27/11/2024",
    time: "15:00",
    status: "Cancelada",
    doctor: "DR ALEXANDRE"
  },
  {
    date: "28/10/2024",
    time: "15:00",
    status: "Finalizada",
    doctor: "Rayssa"
  },
  {
    date: "24/10/2024",
    time: "14:30",
    status: "Cancelada",
    doctor: "Amanda"
  },
  {
    date: "21/10/2024",
    time: "15:00",
    status: "Cancelada",
    doctor: "Amanda"
  },
  {
    date: "21/10/2024",
    time: "13:00",
    status: "Falta",
    doctor: "Rayssa"
  }
]

const MOCK_TREATMENTS: Treatment[] = [
  {
    date: "28 de outubro de 2024",
    description: "Restauração em Resina fotopolimerizavel do dente 27 foi finalizado",
    doctor: "Dr(a). Rayssa",
    signed: false
  },
  {
    date: "16 de outubro de 2024",
    description: "Restauração em Resina Fotopolimerizável 1 face na oclusal/incisal do dente 45 foi finalizado",
    doctor: "Dr(a). Rayssa",
    signed: false
  },
  {
    date: "16 de outubro de 2024",
    description: "Restauração em Resina Fotopolimerizável 1 face na oclusal/incisal do dente 44 foi finalizado",
    doctor: "Dr(a). Rayssa",
    signed: false
  },
  {
    date: "14 de outubro de 2024",
    description: "Bloco de Resina do dente 15 foi finalizado",
    doctor: "Dr(a). Rayssa",
    signed: false
  },
  {
    date: "3 de outubro de 2024",
    description: "Tratamento Endodôntico Birradicular do dente 15 foi finalizado",
    doctor: "Dr(a). Rayssa",
    signed: false
  }
]

const ANAMNESES_QUESTIONS: AnamnesesQuestion[] = [
  {
    question: "Qual seria seu objetivo com seu tratamento?",
    type: "text",
    maxLength: 250
  },
  {
    question: "O que te incomoda hoje no seu sorriso?",
    type: "text",
    maxLength: 250
  },
  {
    question: "Há alguma informação médica que considere importante e deseja relatar?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Todo procedimento com uso de anestésicos envolve riscos, sendo assim está disposto a iniciar o tratamento?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui ou já contraiu Tuberculose?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui ou já contraiu HIV?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui ou já contraiu Hepatite?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Faz uso de medicamento para afinar o sangue, tipo ASS ou aspirina?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui alergia a alguma substância?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Teve reações adversas a anestésicos?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Teve hemorragia?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Faz uso de drogas ilícitas?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui ou já teve problemas renais?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui ou já teve algum tipo de Câncer?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui ou já contraiu Úlcera?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  },
  {
    question: "Possui ou já contraiu Gastrite?",
    type: "radio",
    options: ["Sim", "Não", "Não sei"]
  }
]

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'contract',
    title: 'Contrato',
    icon: <FileText className="h-8 w-8 text-white" />,
    color: 'bg-emerald-500'
  },
  {
    id: 'prescription',
    title: 'Receituário',
    icon: <FileCheck className="h-8 w-8 text-white" />,
    color: 'bg-[#0078FF]'
  },
  {
    id: 'certificate',
    title: 'Atestados',
    icon: <FileSparkles className="h-8 w-8 text-white" />,
    color: 'bg-green-500'
  },
  {
    id: 'custom',
    title: 'Personalizado',
    icon: <FilePlus2 className="h-8 w-8 text-white" />,
    color: 'bg-blue-900'
  }
]

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState("sobre")
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false)
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [newProcedure, setNewProcedure] = useState({
    code: '',
    name: '',
    quantity: ''
  })
  const [isEditEvolutionOpen, setIsEditEvolutionOpen] = useState(false)
  const [editingEvolution, setEditingEvolution] = useState<EditEvolutionData>({
    professional: '',
    date: '',
    description: ''
  })
  const [isNewAnamnesesOpen, setIsNewAnamnesesOpen] = useState(false)
  const [anamnesesResponses, setAnamnesesResponses] = useState<Record<string, string>>({})
  const [fillType, setFillType] = useState<'professional' | 'patient'>('professional')
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showNewPrescription, setShowNewPrescription] = useState(false)
  const patient = MOCK_PATIENT

  const handleAddProcedure = () => {
    if (newProcedure.code && newProcedure.name && newProcedure.quantity) {
      setProcedures([
        ...procedures,
        {
          code: newProcedure.code,
          name: newProcedure.name,
          quantity: parseInt(newProcedure.quantity),
          value: 0 // This would be calculated based on your business logic
        }
      ])
      setNewProcedure({ code: '', name: '', quantity: '' })
    }
  }

  const handleSubmitQuote = () => {
    setIsNewQuoteOpen(false)
    toast({
      className: "bg-[#4CAF50] text-white",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Orçamento enviado com sucesso
        </div>
      )
    })
  }

  const handleEditEvolution = (treatment: Treatment) => {
    setEditingEvolution({
      professional: treatment.doctor.replace('Dr(a). ', ''),
      date: treatment.date,
      description: treatment.description
    })
    setIsEditEvolutionOpen(true)
  }

  const handleSaveEvolution = () => {
    // Here you would implement the actual save logic
    setIsEditEvolutionOpen(false)
    toast({
      className: "bg-[#4CAF50] text-white",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Evolução atualizada com sucesso
        </div>
      )
    })
  }

  const handleAnamnesesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the submission of the anamneses
    setIsNewAnamnesesOpen(false)
    toast({
      className: "bg-[#4CAF50] text-white",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Anamnese salva com sucesso
        </div>
      )
    })
  }

  const totalAmount = procedures.reduce((sum, proc) => sum + proc.value, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex items-center gap-4 p-4">
          <Link href="/agenda/calendario" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-4">
            <Image
              src="/placeholder.svg"
              alt="Foto do perfil"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-xl font-medium">{patient.name}</h1>
              <p className="text-sm text-gray-500">{patient.phone} - CPF: {patient.cpf}</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="outline" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="h-[48px] w-full justify-start gap-4 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="sobre"
              className="h-[48px] rounded-none border-b-2 border-transparent px-0 pb-1 pt-0 font-medium text-gray-500 data-[state=active]:border-[#0078FF] data-[state=active]:text-[#0078FF]"
            >
              SOBRE
            </TabsTrigger>
            <TabsTrigger
              value="orcamentos"
              className="h-[48px] rounded-none border-b-2 border-transparent px-0 pb-1 pt-0 font-medium text-gray-500 data-[state=active]:border-[#0078FF] data-[state=active]:text-[#0078FF]"
            >
              ORÇAMENTOS
            </TabsTrigger>
            <TabsTrigger
              value="tratamentos"
              className="h-[48px] rounded-none border-b-2 border-transparent px-0 pb-1 pt-0 font-medium text-gray-500 data-[state=active]:border-[#0078FF] data-[state=active]:text-[#0078FF]"
            >
              TRATAMENTOS
            </TabsTrigger>
            <TabsTrigger
              value="anamnese"
              className="h-[48px] rounded-none border-b-2 border-transparent px-0 pb-1 pt-0 font-medium text-gray-500 data-[state=active]:border-[#0078FF] data-[state=active]:text-[#0078FF]"
            >
              ANAMNESE
            </TabsTrigger>
            <TabsTrigger
              value="imagens"
              className="h-[48px] rounded-none border-b-2 border-transparent px-0 pb-1 pt-0 font-medium text-gray-500 data-[state=active]:border-[#0078FF] data-[state=active]:text-[#0078FF]"
            >
              IMAGENS
            </TabsTrigger>
            <TabsTrigger
              value="documentos"
              className="h-[48px] rounded-none border-b-2 border-transparent px-0 pb-1 pt-0 font-medium text-gray-500 data-[state=active]:border-[#0078FF] data-[state=active]:text-[#0078FF]"
            >
              DOCUMENTOS
            </TabsTrigger>
            <TabsTrigger
              value="debitos"
              className="h-[48px] rounded-none border-b-2 border-transparent px-0 pb-1 pt-0 font-medium text-gray-500 data-[state=active]:border-[#0078FF] data-[state=active]:text-[#0078FF]"
            >
              DÉBITOS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sobre" className="mt-6">
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              {/* Personal Data */}
              <div className="space-y-6 rounded-lg bg-white p-6 shadow">
                <h2 className="text-lg font-medium text-gray-900">Dados pessoais</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">Código do paciente</p>
                      <p>{patient.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Número paciente</p>
                      <p>{patient.patientNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">CPF do paciente</p>
                      <p>{patient.cpf}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data de nascimento</p>
                      <p>{patient.birthDate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">Idade do paciente</p>
                      <p>{patient.age} anos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sexo</p>
                      <p>{patient.gender}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">Celular</p>
                      <p>{patient.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">Endereço</p>
                      <p>{patient.address.street}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">Bairro</p>
                      <p>{patient.address.neighborhood}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">CEP</p>
                      <p>{patient.address.zipCode}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b py-2">
                    <div>
                      <p className="text-sm text-gray-500">Cidade</p>
                      <p>{patient.address.city}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div>
                      <p className="text-sm text-gray-500">UF</p>
                      <p>{patient.address.state}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Latest Update */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">Última evolução</h2>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Restauração em Resina fotopolimerizada do dente 27 foi finalizado
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Rayssa</span>
                      <span>28/10/2024</span>
                    </div>
                  </div>
                </div>

                {/* Appointments */}
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">Consultas</h2>
                  <div className="space-y-4">
                    {MOCK_APPOINTMENTS.map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <p className="font-medium">{appointment.date} {appointment.time}</p>
                          <p className="text-sm text-gray-500">{appointment.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.doctor}</p>
                          <Button variant="link" className="h-auto p-0 text-[#0078FF]">
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="link" className="mt-4 h-auto p-0 text-[#0078FF]">
                    VER TODAS AS CONSULTAS
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="orcamentos" className="mt-6">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-8 flex justify-center">
                <Button 
                  className="bg-[#0078FF] hover:bg-blue-600"
                  onClick={() => setIsNewQuoteOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  NOVO ORÇAMENTO
                </Button>
              </div>

              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow">
                <Image
                  src="/placeholder.svg"
                  alt="Empty state illustration"
                  width={200}
                  height={150}
                  className="mb-6"
                />
                <h2 className="mb-2 text-xl font-medium text-[#0078FF]">
                  Crie o primeiro orçamento
                </h2>
                <p className="mb-2 text-lg text-[#0078FF]">
                  para este paciente
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tratamentos" className="mt-6">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Evoluções</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_TREATMENTS.map((treatment, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline dot and line */}
                    <div className="absolute left-0 top-0 flex h-full w-8 items-start justify-center">
                      <div className="absolute h-full w-px bg-gray-200" />
                      <div className="relative z-10 mt-2.5 h-3 w-3 rounded-full border-2 border-[#0078FF] bg-white" />
                    </div>

                    {/* Date */}
                    <div className="mb-2 text-sm text-gray-500">
                      {treatment.date}
                    </div>

                    {/* Treatment Card */}
                    <div className="rounded-lg border bg-white p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="text-sm text-gray-500">
                          Sem assinatura
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem onClick={() => handleEditEvolution(treatment)}>
                              Editar evolução
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Assinar evolução
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="mb-2">{treatment.description}</p>
                      <p className="text-sm text-gray-500">{treatment.doctor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="anamnese" className="mt-6">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-8 flex justify-center">
                <Button 
                  className="bg-[#0078FF] hover:bg-blue-600"
                  onClick={() => setIsNewAnamnesesOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  NOVA ANAMNESE
                </Button>
              </div>

              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow">
                <Image
                  src="/placeholder.svg"
                  alt="Empty state illustration"
                  width={200}
                  height={150}
                  className="mb-6"
                />
                <h2 className="mb-2 text-xl font-medium text-[#0078FF]">
                  Paciente sem anamnese
                </h2>
                <p className="mb-2 text-lg text-[#0078FF]">
                  preenchida
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="imagens" className="mt-6">
            <div className="mx-auto flex max-w-[1200px] justify-center">
              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow">
                <Image
                  src="/placeholder.svg"
                  alt="Empty state illustration"
                  width={200}
                  height={150}
                  className="mb-6"
                />
                <h2 className="mb-2 text-xl font-medium text-[#0078FF]">
                  Em breve
                </h2>
                <p className="mb-2 text-lg text-[#0078FF]">
                  funcionalidade
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="documentos" className="mt-6">
            <div className="mx-auto max-w-[1200px]">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {DOCUMENT_TYPES.map((doc) => (
                  <div key={doc.id} className="rounded-lg bg-white p-6 shadow">
                    <div className="flex flex-col items-center space-y-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${doc.color}`}>
                        {doc.icon}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{doc.title}</h3>
                      <div className="flex w-full gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedDocument(doc.id)
                            setShowHistory(true)
                          }}
                        >
                          HISTÓRICO
                        </Button>
                        <Button 
                          className="flex-1 bg-[#0078FF] hover:bg-blue-600"
                          onClick={() => {
                            if (doc.id === 'prescription') {
                              setShowNewPrescription(true)
                            }
                          }}
                        >
                          NOVO
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="debitos" className="mt-6">
            <div className="mx-auto flex max-w-[1200px] justify-center">
              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow">
                <Image
                  src="/placeholder.svg"
                  alt="Empty state illustration"
                  width={200}
                  height={150}
                  className="mb-6"
                />
                <h2 className="mb-2 text-xl font-medium text-[#0078FF]">
                  Em breve
                </h2>
                <p className="mb-2 text-lg text-[#0078FF]">
                  funcionalidade
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </header>
      <Dialog open={isNewQuoteOpen} onOpenChange={setIsNewQuoteOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Proposta de procedimento</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Nome do paciente</Label>
                <Input value={patient.name} readOnly className="bg-gray-50" />
              </div>

              <div>
                <Label>CPF</Label>
                <Input value={patient.cpf} readOnly className="bg-gray-50" />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Inserir Serviços</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Código ANS</Label>
                    <Input 
                      value={newProcedure.code}
                      onChange={(e) => setNewProcedure({ ...newProcedure, code: e.target.value })}
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <Label>Nome do procedimento</Label>
                    <Input 
                      value={newProcedure.name}
                      onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
                      placeholder="Digite o nome do procedimento"
                    />
                  </div>
                </div>
                
                <div className="flex items-end gap-4">
                  <div className="w-[200px]">
                    <Label>Quantidade</Label>
                    <Input                       type="number"
                      value={newProcedure.quantity}
                      onChange={(e) => setNewProcedure({ ...newProcedure, quantity: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddProcedure}
                    className="bg-[#0078FF] hover:bg-blue-600"
                  >
                    Inserir
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Relação de procedimentos inseridos</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="w-[100px]">Quant.</TableHead>
                      <TableHead>Procedimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procedures.map((procedure, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{procedure.quantity}</TableCell>
                        <TableCell>{procedure.name}</TableCell>
                        <TableCell className="text-right">
                          R$ {procedure.value.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex justify-end border-t pt-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total do prestador de serviço</p>
                  <p className="text-lg font-medium">
                    R$ {totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitQuote}
                className="bg-[#0078FF] hover:bg-blue-600"
              >
                Enviar Orçamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Evolution Dialog */}
      <Dialog open={isEditEvolutionOpen} onOpenChange={setIsEditEvolutionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar evolução</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Profissional *</Label>
                <div className="relative">
                  <Input 
                    value={editingEvolution.professional}
                    onChange={(e) => setEditingEvolution({ 
                      ...editingEvolution, 
                      professional: e.target.value 
                    })}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setEditingEvolution({ 
                      ...editingEvolution, 
                      professional: '' 
                    })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Data *</Label>
                <Input 
                  type="date"
                  value={editingEvolution.date}
                  onChange={(e) => setEditingEvolution({ 
                    ...editingEvolution, 
                    date: e.target.value 
                  })}
                />
              </div>
            </div>

            <div>
              <Label>Evolução</Label>
              <div className="mb-2 flex gap-2">
                <Button variant="outline" size="sm">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Textarea 
                value={editingEvolution.description}
                onChange={(e) => setEditingEvolution({ 
                  ...editingEvolution, 
                  description: e.target.value 
                })}
                className="min-h-[200px]"
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                66 CARACTERES DISTRIBUÍDO POR TINY
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Imagens (0/6)</Label>
              <Button variant="outline" className="w-full gap-2">
                <ImageIcon className="h-4 w-4" />
                ADICIONAR IMAGEM
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditEvolutionOpen(false)}>
                CANCELAR
              </Button>
              <Button 
                onClick={handleSaveEvolution}
                className="bg-[#4CAF50] text-white hover:bg-[#43a047]"
              >
                SALVAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Anamneses Dialog */}
      <Dialog open={isNewAnamnesesOpen} onOpenChange={setIsNewAnamnesesOpen}>
        <DialogContent className="flex h-[90vh] max-w-[900px] flex-col p-0" onClick={(e) => e.stopPropagation()}>
          <DialogHeader className="flex-none p-6 pb-4">
            <DialogTitle>Nova Anamnese</DialogTitle>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <Label>Modelo de anamnese *</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">ANAMNESE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data *</Label>
                <Input type="date" value={new Date().toISOString().split('T')[0]} readOnly />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <RadioOptionButton
                selected={fillType === 'professional'}
                onClick={() => setFillType('professional')}
              >
                Preenchimento pelo profissional
              </RadioOptionButton>
              <RadioOptionButton
                selected={fillType === 'patient'}
                onClick={() => setFillType('patient')}
              >
                Preenchimento pelo paciente
              </RadioOptionButton>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto border-y px-6 py-4" onClick={(e) => e.stopPropagation()}>
            <form id="anamnesesForm" onSubmit={handleAnamnesesSubmit} className="space-y-6">
              {ANAMNESES_QUESTIONS.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label>{question.question}</Label>
                  {question.type === 'text' ? (
                    <div>
                      <Textarea 
                        value={anamnesesResponses[index.toString()] || ''}
                        onChange={(e) => setAnamnesesResponses(prev => ({
                          ...prev,
                          [index.toString()]: e.target.value
                        }))}
                        maxLength={question.maxLength}
                      />
                      <div className="mt-1 text-right text-xs text-gray-500">
                        {(anamnesesResponses[index.toString()] || '').length} / {question.maxLength}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {question.options?.map((option) => (
                        <RadioOptionButton
                          key={option}
                          selected={anamnesesResponses[index.toString()] === option}
                          onClick={() => setAnamnesesResponses(prev => ({
                            ...prev,
                            [index.toString()]: option
                          }))}
                        >
                          {option}
                        </RadioOptionButton>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </form>
          </div>

          <div className="flex flex-none items-center justify-end gap-2 p-6 pt-4">
            <Button variant="outline" onClick={() => setIsNewAnamnesesOpen(false)}>
              FECHAR
            </Button>
            <Button variant="outline" onClick={() => setIsNewAnamnesesOpen(false)}>
              EMITIR ANAMNESE
            </Button>
            <Button 
              type="submit"
              form="anamnesesForm"
              className="bg-[#0078FF] text-white hover:bg-blue-600"
            >
              SALVAR ANAMNESE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <NewPrescription 
        open={showNewPrescription}
        onOpenChange={setShowNewPrescription}
        patientName={patient.name}
        patientAddress={`${patient.address.street} - ${patient.address.neighborhood} - ${patient.address.city} - ${patient.address.state} - ${patient.address.zipCode}`}
      />
    </div>
  )
}

