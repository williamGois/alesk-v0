import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function TipoConta() {
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">
        Selecione o tipo de Conta que deseja Cadastrar
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col items-center p-8 text-center">
          <div className="mb-6">
            <DoctorIcon />
          </div>
          <h2 className="mb-4 text-xl font-semibold">
            É um profissional autônomo que não possui CNPJ?
          </h2>
          <p className="mb-8 text-gray-600">
            Opte por Pessoa Física para registrar-se individualmente e gerenciar
            seu próprio perfil e agendamentos.
          </p>
          <Button asChild className="w-full bg-[#0078FF] hover:bg-blue-600">
            <Link href="/cadastro/pessoa-fisica">
              Cadastrar Pessoa Física
            </Link>
          </Button>
        </Card>

        <Card className="flex flex-col items-center p-8 text-center">
          <div className="mb-6">
            <HospitalIcon />
          </div>
          <h2 className="mb-4 text-xl font-semibold">
            Está abrindo uma conta para uma empresa?
          </h2>
          <p className="mb-8 text-gray-600">
            Escolha Pessoa Jurídica. Ideal para clínicas, hospitais e outras
            organizações que desejam gerenciar múltiplos profissionais sob uma
            única identidade corporativa.
          </p>
          <Button asChild className="w-full bg-[#0078FF] hover:bg-blue-600">
            <Link href="/cadastro/pessoa-juridica">
              Cadastrar Pessoa Jurídica
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}

function DoctorIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
        stroke="#0078FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 40C37.5228 40 42 35.5228 42 30C42 24.4772 37.5228 20 32 20C26.4772 20 22 24.4772 22 30C22 35.5228 26.4772 40 32 40Z"
        stroke="#0078FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.4 49.6C19.9316 47.0763 22.0714 44.9557 24.6788 43.4459C27.2862 41.936 30.2724 41.0845 33.3333 40.9688C36.3942 40.8531 39.4352 41.4767 42.1575 42.7798C44.8797 44.0829 47.1901 46.0227 48.9333 48.4533"
        stroke="#0078FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HospitalIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M53.3333 26.6667H10.6667C9.19391 26.6667 8 27.8606 8 29.3333V50.6667C8 52.1394 9.19391 53.3333 10.6667 53.3333H53.3333C54.8061 53.3333 56 52.1394 56 50.6667V29.3333C56 27.8606 54.8061 26.6667 53.3333 26.6667Z"
        stroke="#0078FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.6667 26.6667V16C42.6667 15.2928 42.3857 14.6145 41.8856 14.1144C41.3855 13.6143 40.7072 13.3333 40 13.3333H24C23.2928 13.3333 22.6145 13.6143 22.1144 14.1144C21.6143 14.6145 21.3333 15.2928 21.3333 16V26.6667"
        stroke="#0078FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.3333 34.6667H34.6666"
        stroke="#0078FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 32V37.3333"
        stroke="#0078FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

