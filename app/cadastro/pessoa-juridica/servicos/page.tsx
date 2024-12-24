"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { InfoIcon } from 'lucide-react'
import { Stepper } from "@/components/stepper"
import { OptionButton } from "@/components/option-button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Servicos() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<'profissional' | 'juridica'>('profissional')

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/cadastro/pessoa-juridica/dados-servicos')
  }

  const handleBack = () => {
    router.push('/cadastro/pessoa-juridica/dados-bancarios')
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
        <Stepper totalSteps={7} currentStep={5} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Agendamento do serviços
          </h3>
        </div>

        <div className="mb-8 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-[#0078FF]">
            <InfoIcon className="h-5 w-5" />
            <span>Pessoa Jurídica: Em caso de hospitais, laboratórios, etc. Informar os serviços prestados</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-4 text-lg font-medium">Para quem será o agendamento</h4>
            <div className="space-y-4">
              <OptionButton
                type="button"
                selected={selectedOption === 'profissional'}
                onClick={() => setSelectedOption('profissional')}
              >
                Em nome de cada profissional
              </OptionButton>

              <OptionButton
                type="button"
                selected={selectedOption === 'juridica'}
                onClick={() => setSelectedOption('juridica')}
              >
                Apenas pela pessoa jurídica
              </OptionButton>
            </div>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Informe os serviços prestados
              </label>
              <Textarea 
                placeholder="Digite aqui"
                className="min-h-[120px] bg-gray-50"
              />
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
        </div>
      </Card>
    </div>
  )
}

