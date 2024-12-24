"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { User, Building2, Check, X, Eye, EyeOff } from "lucide-react";
import { MaskedInput } from "@/components/MaskedInput";

interface PasswordRequirement {
  regex: RegExp;
  text: string;
}

const passwordRequirements: PasswordRequirement[] = [
  { regex: /.{8,}/, text: "Pelo menos 8 caracteres" },
  { regex: /[A-Z]/, text: "Pelo menos uma letra maiúscula" },
  { regex: /[a-z]/, text: "Pelo menos uma letra minúscula" },
  { regex: /[0-9]/, text: "Pelo menos um número" },
  { regex: /[^A-Za-z0-9]/, text: "Pelo menos um caractere especial" },
];

export default function CadastroPage() {
  const [registrationType, setRegistrationType] = useState<
    "fisica" | "juridica"
  >("fisica");
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState<
    boolean[]
  >(new Array(passwordRequirements.length).fill(false));
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    const newRequirementsMet = passwordRequirements.map((req) =>
      req.regex.test(password)
    );
    setPasswordRequirementsMet(newRequirementsMet);
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
    console.log("Registration submitted", {
      registrationType,
      name,
      document,
      phone,
      email,
      password,
      acceptTerms,
    });
  };

  const allRequirementsMet = passwordRequirementsMet.every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== "";

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
            Crie sua conta
            <br />
            e comece a
            <br />
            transformar vidas
            <br />
            hoje mesmo!
          </h1>
          <p className="text-lg text-white/90">
            Junte-se à nossa plataforma e expanda seu alcance profissional
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
          <h2 className="mb-8 text-3xl font-medium text-[#0078FF]">Cadastro</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <Label className="mb-2 block">Tipo de Cadastro</Label>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer p-4 transition-all ${
                    registrationType === "fisica"
                      ? "border-[#0078FF] bg-blue-50"
                      : "border-gray-200 hover:border-[#0078FF]"
                  }`}
                  onClick={() => setRegistrationType("fisica")}
                >
                  <div className="flex flex-col items-center">
                    <User
                      className={`h-10 w-10 ${
                        registrationType === "fisica"
                          ? "text-[#0078FF]"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`mt-2 font-medium ${
                        registrationType === "fisica"
                          ? "text-[#0078FF]"
                          : "text-gray-600"
                      }`}
                    >
                      Pessoa Física
                    </span>
                  </div>
                </Card>
                <Card
                  className={`cursor-pointer p-4 transition-all ${
                    registrationType === "juridica"
                      ? "border-[#0078FF] bg-blue-50"
                      : "border-gray-200 hover:border-[#0078FF]"
                  }`}
                  onClick={() => setRegistrationType("juridica")}
                >
                  <div className="flex flex-col items-center">
                    <Building2
                      className={`h-10 w-10 ${
                        registrationType === "juridica"
                          ? "text-[#0078FF]"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`mt-2 font-medium ${
                        registrationType === "juridica"
                          ? "text-[#0078FF]"
                          : "text-gray-600"
                      }`}
                    >
                      Pessoa Jurídica
                    </span>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                {registrationType === "fisica"
                  ? "Nome Completo"
                  : "Razão Social"}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50"
                placeholder="Digite aqui"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">
                {registrationType === "fisica" ? "CPF" : "CNPJ"}
              </Label>
              <MaskedInput
                id="document"
                mask={
                  registrationType === "fisica"
                    ? "999.999.999-99"
                    : "99.999.999/9999-99"
                }
                value={document}
                onChange={setDocument}
                className="bg-gray-50"
                placeholder={
                  registrationType === "fisica"
                    ? "000.000.000-00"
                    : "00.000.000/0000-00"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Celular</Label>
              <MaskedInput
                id="phone"
                mask="(99) 99999-9999"
                value={phone}
                onChange={setPhone}
                className="bg-gray-50"
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50"
                placeholder="Digite aqui"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsPasswordFocused(true);
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  className="bg-gray-50 pr-10"
                  placeholder="Digite aqui"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {isPasswordFocused && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm">
                      {passwordRequirementsMet[index] ? (
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <X className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          passwordRequirementsMet[index]
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 pr-10"
                  placeholder="Digite aqui"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-2 flex items-center text-sm">
                  {passwordsMatch ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-green-500">
                        As senhas coincidem
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4 text-red-500" />
                      <span className="text-red-500">
                        As senhas não coincidem
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setAcceptTerms(checked as boolean)
                }
                required
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                Eu li e aceito os{" "}
                <button
                  type="button"
                  className="text-[#0078FF] hover:underline"
                  onClick={() => setIsTermsModalOpen(true)}
                >
                  termos de uso
                </button>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0078FF] hover:bg-blue-600"
              disabled={!allRequirementsMet || !passwordsMatch || !acceptTerms}
            >
              Criar Conta
            </Button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-[#0078FF] hover:underline">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Terms of Use Modal */}
      <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Termos de Uso</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              euismod, nisi vel consectetur interdum, nisl nunc egestas nunc,
              vitae tincidunt nisl nunc euismod nunc. Sed euismod, nisi vel
              consectetur interdum, nisl nunc egestas nunc, vitae tincidunt nisl
              nunc euismod nunc. Praesent vel lacus eget augue tincidunt
              ultrices. Vestibulum ante ipsum primis in faucibus orci luctus et
              ultrices posuere cubilia curae; Sed at nisi in velit bibendum
              malesuada. Fusce euismod, nunc vel tincidunt lacinia, nunc nunc
              tincidunt nunc, vitae tincidunt nunc nunc vel nunc. Nulla
              facilisi. Sed euismod, nisi vel consectetur interdum, nisl nunc
              egestas nunc, vitae tincidunt nisl nunc euismod nunc. Sed euismod,
              nisi vel consectetur interdum, nisl nunc egestas nunc, vitae
              tincidunt nisl nunc euismod nunc. Sed euismod, nisi vel
              consectetur interdum, nisl nunc egestas nunc, vitae tincidunt nisl
              nunc euismod nunc.
            </p>
            {/* Add more paragraphs as needed */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTermsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setAcceptTerms(true);
                setIsTermsModalOpen(false);
              }}
            >
              Aceitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
