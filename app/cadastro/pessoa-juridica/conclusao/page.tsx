import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ConclusaoPessoaJuridica() {
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <Card className="overflow-hidden bg-white p-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-12 text-2xl font-semibold text-[#0078FF]">
            Cadastro Concluído
          </h1>

          <div className="relative mb-8 h-[400px] w-[400px]">
            <Image
              src=""
              alt="Profissional de saúde fazendo gesto de coração"
              fill
              className="object-contain"
            />
          </div>

          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-[#0078FF]">
              Envio Concluído! Obrigado por cadastrar sua empresa no Alesk!
            </h2>

            <p className="text-gray-600">
              Os dados da sua empresa foram enviados para análise.
            </p>

            <p className="text-gray-600">
              Estamos ansiosos para ter sua organização como parte de nossa
              comunidade!
            </p>

            <p className="text-gray-600">
              Você receberá uma notificação por e-mail assim que o cadastro da
              sua empresa for analisado e, se tudo estiver conforme nossos
              critérios, o acesso será liberado.
            </p>

            <p className="mt-8 text-gray-600">
              Fique atento ao seu e-mail e, enquanto isso, sinta-se à vontade
              para explorar mais sobre como o Alesk pode ajudar sua empresa a
              crescer e se destacar no mercado de saúde.
            </p>

            <div className="pt-8">
              <Link
                href="/"
                className="inline-block rounded-md bg-[#0078FF] px-8 py-3 text-white transition-colors hover:bg-blue-600"
              >
                Voltar para Home
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
