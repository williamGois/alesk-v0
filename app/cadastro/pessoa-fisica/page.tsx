"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OptionButton } from "@/components/option-button"
import { useRouter } from "next/navigation"

export default function CadastroPessoaFisica() {
  const [selectedOption, setSelectedOption] = useState<'individual' | 'clinic'>('individual')
  const router = useRouter()

  const handleNext = () => {
    router.push('/cadastro/pessoa-fisica/dados-pessoais')
  }

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">
        Cadastro Pessoa Física
      </h1>

      <Card className="p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">
            Defina como os Agendamentos serão Exibidos nas Buscas
          </h2>
        </div>

        <div className="space-y-4">
          <OptionButton
            selected={selectedOption === 'individual'}
            onClick={() => setSelectedOption('individual')}
          >
            Em Nome de Cada Profissional
          </OptionButton>

          <OptionButton
            selected={selectedOption === 'clinic'}
            onClick={() => setSelectedOption('clinic')}
          >
            Apenas pela Pessoa Jurídica
          </OptionButton>
        </div>

        {selectedOption === 'individual' && (
          <div className="mt-6 rounded-lg bg-blue-50 p-6">
            <p className="text-gray-600">
              Selecione esta opção se deseja que o nome de cada profissional
              seja exibido individualmente nos resultados de busca. Esta opção
              é ideal para destacar as competências e a disponibilidade de cada
              membro da sua equipe, permitindo que os pacientes escolham
              diretamente o profissional com quem desejam agendar.
            </p>
          </div>
        )}

        {selectedOption === 'clinic' && (
          <div className="mt-6 rounded-lg bg-blue-50 p-6">
            <p className="text-gray-600">
              Selecione esta opção se prefere que os agendamentos sejam
              listados sob o nome da clínica ou instituição. Esta alternativa é
              adequada para fortalecer a identidade da sua marca e simplificar
              o processo de agendamento, quando os detalhes individuais dos
              profissionais não são essenciais.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleNext}
            className="bg-[#0078FF] px-8 hover:bg-blue-600"
          >
            Avançar
          </Button>
        </div>
      </Card>
    </div>
  )
}

