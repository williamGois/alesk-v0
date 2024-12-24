"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Stepper } from "@/components/stepper"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DadosPessoais() {
  const router = useRouter()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/cadastro/pessoa-fisica/endereco')
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
        <Stepper totalSteps={7} currentStep={1} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Dados Pessoais
          </h3>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nome Completo
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Nacionalidade
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Estado Civil
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Profissão
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                CPF
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                RG
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="flex justify-end">
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

