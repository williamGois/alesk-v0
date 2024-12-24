import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MeuCadastro() {
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">
        Meu Cadastro
      </h1>
      <Card className="relative overflow-hidden bg-white p-12">
        <div className="relative z-10 flex flex-row-reverse items-center justify-between">
          <div className="flex-1 max-w-xl ml-16">
            <h2 className="text-3xl font-bold text-[#0078FF] mb-4">
              Prestador de Serviços, Bem-vindo(a) ao Alesk!
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              Aqui no Alesk, suas informações são seguras e protegidas. Quanto
              mais detalhadas forem as informações que você fornecer, melhores
              serão suas oportunidades de ser encontrado por pacientes que
              precisam dos seus serviços.
            </p>
            <Link href="/tipo-conta">
              <Button className="bg-[#0078FF] text-white hover:bg-blue-600 px-6 py-3 text-lg">
                Iniciar Cadastro Completo
              </Button>
            </Link>
          </div>
          <div className="relative h-[500px] w-[500px]">
            <Image
              src=""
              alt="Profissional de saúde"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
