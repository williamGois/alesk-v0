import { Calendar, ChevronDown, CreditCard, FileText, Home, LogOut, MessageSquare, PieChart, Settings, Users, Bell, BookOpen, Table, Smartphone, Banknote } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function Sidebar({ currentPage }: { currentPage: string }) {
  const [isHomeExpanded, setIsHomeExpanded] = useState(true)
  const [isCadastroExpanded, setIsCadastroExpanded] = useState(false)
  const [isUsersExpanded, setIsUsersExpanded] = useState(false)
  const [isFinanceiroExpanded, setIsFinanceiroExpanded] = useState(false)
  const [isLayoutMobileExpanded, setIsLayoutMobileExpanded] = useState(false)

  return (
    <aside className="flex h-[calc(100vh-73px)] w-64 flex-col border-r bg-gray-50 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 border-b p-4">
          <Image
            src="/placeholder.svg"
            alt="Foto do perfil"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h2 className="font-semibold">Olá nome!</h2>
            <p className="text-sm text-muted-foreground">Vamos trabalhar!</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Painel do prestador de serviço
            </p>
            <nav className="space-y-2">
              {/* Home Menu with submenu */}
              <div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => setIsHomeExpanded(!isHomeExpanded)}
                >
                  <Home className="h-4 w-4" />
                  Home
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isHomeExpanded ? 'rotate-180' : ''}`} />
                </Button>
                {isHomeExpanded && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === '' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/">
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'dashboard-medico' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/dashboard-medico">
                        Dashboard Médico
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Meu Cadastro Menu with submenu */}
              <div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => setIsCadastroExpanded(!isCadastroExpanded)}
                >
                  <FileText className="h-4 w-4" />
                  Meu Cadastro
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isCadastroExpanded ? 'rotate-180' : ''}`} />
                </Button>
                {isCadastroExpanded && (
                  <div className="ml-4 mt-2">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'meu-cadastro' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/meu-cadastro">
                        Dados Cadastrais
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'especialidades' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/especialidades">
                        Especialidades
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'categorias' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/categorias">
                        Categorias
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'prestadores' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/meu-cadastro/prestadores">
                        Listar Prestadores
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Layout Mobile Menu with submenu */}
              <div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => setIsLayoutMobileExpanded(!isLayoutMobileExpanded)}
                >
                  <Smartphone className="h-4 w-4" />
                  Layout Mobile
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isLayoutMobileExpanded ? 'rotate-180' : ''}`} />
                </Button>
                {isLayoutMobileExpanded && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'layout-mobile/slides' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/layout-mobile/slides">
                        Slides
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'layout-mobile/blog' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/layout-mobile/blog">
                        Blog
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  currentPage === 'minha-equipe' ? 'bg-blue-50 text-[#0078FF]' : ''
                }`}
                asChild
              >
                <Link href="/minha-equipe">
                  <Users className="h-4 w-4" />
                  Minha Equipe
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  currentPage === 'agenda' ? 'bg-blue-50 text-[#0078FF]' : ''
                }`}
                asChild
              >
                <Link href="/agenda">
                  <Calendar className="h-4 w-4" />
                  Agenda
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Orçamentos
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  currentPage === 'chat' ? 'bg-blue-50 text-[#0078FF]' : ''
                }`}
                asChild
              >
                <Link href="/chat">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Bell className="h-4 w-4" />
                Alertas
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
              <div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => setIsUsersExpanded(!isUsersExpanded)}
                >
                  <Users className="h-4 w-4" />
                  Usuários
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isUsersExpanded ? 'rotate-180' : ''}`} />
                </Button>
                {isUsersExpanded && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'usuarios' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/usuarios">
                        Listar Usuários
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'usuarios/cadastro' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/usuarios/cadastro">
                        Cadastrar Usuário
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${
                        currentPage === 'usuarios/regras' ? 'bg-blue-50 text-[#0078FF]' : ''
                      }`}
                      asChild
                    >
                      <Link href="/usuarios/regras">
                        Regras
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => setIsFinanceiroExpanded(!isFinanceiroExpanded)}
                >
                  <PieChart className="h-4 w-4" />
                  Financeiro
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isFinanceiroExpanded ? 'rotate-180' : ''}`} />
                </Button>
                {isFinanceiroExpanded && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      asChild
                    >
                      <Link href="/financeiro/lancamentos">
                        Lançamentos
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      asChild
                    >
                      <Link href="/financeiro/despesas">
                        Despesas
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      asChild
                    >
                      <Link href="/financeiro/fluxo-de-caixa">
                        Fluxo de Caixa
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Consultas
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Prontuário Eletrônico
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  currentPage === 'tabela-precos' ? 'bg-blue-50 text-[#0078FF]' : ''
                }`}
                asChild
              >
                <Link href="/tabela-precos">
                  <Banknote className="h-4 w-4" />
                  Tabela de Preços
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Tutoriais
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
        <div className="border-t bg-white p-4">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  )
}

