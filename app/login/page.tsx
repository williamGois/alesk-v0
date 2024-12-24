"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    router.push("/meu-cadastro");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="relative hidden w-1/2 bg-[#0078FF] lg:block">
        <div className="relative z-10 flex h-full flex-col justify-center p-12">
          <Image
            src=""
            alt="Alesk Logo"
            width={180}
            height={72}
            className="mb-8"
          />
          <h1 className="mb-6 text-6xl font-light leading-tight text-white">
            Seja bem vindo
            <br />
            ao painel do
            <br />
            Prestador de
            <br />
            Serviço
          </h1>
          <p className="text-lg text-white/90">
            Gerencie, organize e execute rápido e fácil suas tarefas
          </p>
        </div>

        {/* Background Pattern */}
        <Image
          src=""
          alt="Background pattern"
          fill
          className="object-cover opacity-10"
        />
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-[500px] px-8">
          <h2 className="mb-8 text-3xl font-medium text-[#0078FF]">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Qual é o seu usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50"
                placeholder="Digite aqui"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Digite sua senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50"
                placeholder="Digite aqui"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0078FF] hover:bg-blue-600"
            >
              Entrar
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Lembrar minha senha
                </Label>
              </div>

              <Link
                href="/esqueci-senha"
                className="text-sm text-[#0078FF] hover:underline"
              >
                Esquece a senha? Clique aqui
              </Link>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ainda não tem uma conta?{" "}
                <Link
                  href="/cadastro"
                  className="text-[#0078FF] hover:underline"
                >
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
