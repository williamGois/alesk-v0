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
import { Stepper } from "@/components/stepper"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Lista de bancos mais comuns no Brasil
const BANKS = [
  { code: "001", name: "Banco do Brasil" },
  { code: "033", name: "Banco Santander" },
  { code: "104", name: "Caixa Econômica Federal" },
  { code: "237", name: "Banco Bradesco" },
  { code: "341", name: "Banco Itaú" },
  { code: "077", name: "Banco Inter" },
  { code: "260", name: "Nubank" },
  // Adicione mais bancos conforme necessário
]

export default function DadosBancarios() {
  const router = useRouter()
  const [bank, setBank] = useState("")

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/cadastro/pessoa-fisica/curriculo')
  }

  const handleBack = () => {
    router.push('/cadastro/pessoa-fisica/servicos')
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
        <Stepper totalSteps={7} currentStep={4} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Dados Bancários
          </h3>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Banco
              </label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {BANKS.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Código do Banco
                </label>
                <Input 
                  placeholder="Digite aqui"
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Agência
                </label>
                <Input 
                  placeholder="Digite aqui"
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Dígito
                </label>
                <Input 
                  placeholder="Digite aqui"
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Número da Conta
                </label>
                <Input 
                  placeholder="Digite aqui"
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Dígito
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

