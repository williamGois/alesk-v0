"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Stepper } from "@/components/stepper"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NovoMembroEquipeCurriculo() {
  const router = useRouter()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/minha-equipe/novo/foto')
  }

  const handleBack = () => {
    router.push('/minha-equipe/novo/servicos')
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
        <Stepper totalSteps={5} currentStep={4} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Currículo
          </h3>
          <p className="mt-2 text-gray-600">
            Insira as informações dos profissionais da saúde, que
            prestarão serviços na sua unidade, e que aparecerá no aplicativo.
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Resumo
            </label>
            <Textarea 
              placeholder="Digite aqui"
              className="min-h-[200px] bg-gray-50"
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
      </Card>
    </div>
  )
}

