"use client"

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
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export default function NovoMembroEquipeEndereco() {
  const router = useRouter()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/minha-equipe/novo/servicos')
  }

  const handleBack = () => {
    router.push('/minha-equipe/novo')
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
        <Stepper totalSteps={5} currentStep={2} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Endereço e Contato
          </h3>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          <div className="grid gap-6">
            <div className="w-[200px]">
              <label className="mb-2 block text-sm font-medium">
                CEP
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Endereço
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Número
                </label>
                <Input 
                  placeholder="Digite aqui" 
                  className="bg-gray-50"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Complemento
                </label>
                <Input 
                  placeholder="Digite aqui" 
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Bairro
              </label>
              <Input 
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className="mb-2 block text-sm font-medium">
                  Município
                </label>
                <Input 
                  placeholder="Digite aqui" 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  UF
                </label>
                <Select>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {UF_OPTIONS.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Telefone Comercial
                </label>
                <Input 
                  placeholder="(00) 0000-0000" 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Celular / Whatsapp
                </label>
                <Input 
                  placeholder="(00) 0000-0000" 
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                E-mail
              </label>
              <Input 
                type="email"
                placeholder="Digite aqui" 
                className="bg-gray-50"
              />
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

