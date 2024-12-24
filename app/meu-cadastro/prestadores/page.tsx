"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Prestador {
  id: string
  nome: string
  documento: string
  telefone: string
  email: string
  tipo: "Pessoa Física" | "Pessoa Jurídica"
  status: "Ativo" | "Inativo"
  assinatura: "Sim" | "Não"
  avatar: string
}

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateMockPrestadores = (count: number): Prestador[] => {
  const nomes = ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Souza", "Carlos Pereira", "Juliana Almeida", "Ricardo Fernandes", "Fernanda Lima", "Marcelo Castro", "Bruna Rodrigues"];
  const documentos = ["123.456.789-00", "987.654.321-11", "456.789.012-22", "789.012.345-33", "012.345.678-44", "345.678.901-55", "678.901.234-66", "901.234.567-77", "234.567.890-88", "567.890.123-99"];
  const telefones = ["(11) 99999-9999", "(11) 98888-8888", "(11) 97777-7777", "(11) 96666-6666", "(11) 95555-5555", "(11) 94444-4444", "(11) 93333-3333", "(11) 92222-2222", "(11) 91111-1111", "(11) 90000-0000"];
  const emails = ["joao@example.com", "maria@example.com", "pedro@example.com", "ana@example.com", "carlos@example.com", "juliana@example.com", "ricardo@example.com", "fernanda@example.com", "marcelo@example.com", "bruna@example.com"];
  const tipos = ["Pessoa Física", "Pessoa Jurídica"];
  const status = ["Ativo", "Inativo"];
  const assinaturas = ["Sim", "Não"];
  const avatares = ["/placeholder.svg?height=32&width=32"];

  return Array.from({ length: count }, (_, id) => ({
    id: (id + 1).toString(),
    nome: nomes[Math.floor(Math.random() * nomes.length)],
    documento: documentos[Math.floor(Math.random() * documentos.length)],
    telefone: telefones[Math.floor(Math.random() * telefones.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    tipo: tipos[Math.floor(Math.random() * tipos.length)] as "Pessoa Física" | "Pessoa Jurídica",
    status: status[Math.floor(Math.random() * status.length)] as "Ativo" | "Inativo",
    assinatura: assinaturas[Math.floor(Math.random() * assinaturas.length)] as "Sim" | "Não",
    avatar: avatares[Math.floor(Math.random() * avatares.length)],
  }));
}

const MOCK_PRESTADORES: Prestador[] = generateMockPrestadores(50)

const ITEMS_PER_PAGE = 10

export default function PrestadoresPage() {
  const [prestadores, setPrestadores] = useState<Prestador[]>(MOCK_PRESTADORES)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Ativo" | "Inativo">("all")
  const [assinaturaFilter, setAssinaturaFilter] = useState<"all" | "Sim" | "Não">("all")
  const [tipoFilter, setTipoFilter] = useState<"all" | "Pessoa Física" | "Pessoa Jurídica">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPrestadores = useMemo(() => {
    return prestadores.filter(prestador =>
      prestador.nome.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || prestador.status === statusFilter) &&
      (assinaturaFilter === "all" || prestador.assinatura === assinaturaFilter) &&
      (tipoFilter === "all" || prestador.tipo === tipoFilter)
    )
  }, [prestadores, searchQuery, statusFilter, assinaturaFilter, tipoFilter])

  const pageCount = Math.ceil(filteredPrestadores.length / ITEMS_PER_PAGE)
  const paginatedPrestadores = filteredPrestadores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <h1 className="mb-4 text-2xl font-semibold text-[#0078FF]">Prestadores</h1>

      <Card className="mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search" className="mb-2 block">Buscar por nome</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <Input
                id="search"
                placeholder="Buscar por nome"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status-filter" className="mb-2 block">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="assinatura-filter" className="mb-2 block">Assinatura</Label>
            <Select value={assinaturaFilter} onValueChange={setAssinaturaFilter}>
              <SelectTrigger id="assinatura-filter">
                <SelectValue placeholder="Assinatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tipo-filter" className="mb-2 block">Tipo de Pessoa</Label>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger id="tipo-filter">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
                <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
              <TableHead className="text-white">Avatar</TableHead>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Documento</TableHead>
              <TableHead className="text-white">Telefone</TableHead>
              <TableHead className="text-white">E-mail</TableHead>
              <TableHead className="text-white">Tipo</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Assinatura</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPrestadores.map((prestador) => (
              <TableRow key={prestador.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={prestador.avatar} alt={prestador.nome} />
                    <AvatarFallback>{prestador.nome.split(" ")[0][0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{prestador.nome}</TableCell>
                <TableCell>{prestador.documento}</TableCell>
                <TableCell>{prestador.telefone}</TableCell>
                <TableCell>{prestador.email}</TableCell>
                <TableCell>{prestador.tipo}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      prestador.status === "Ativo"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {prestador.status}
                  </Button>
                </TableCell>
                <TableCell>{prestador.assinatura}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/meu-cadastro/prestadores/editar/${prestador.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredPrestadores.length)} de {filteredPrestadores.length} resultados
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}
            disabled={currentPage === pageCount}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

