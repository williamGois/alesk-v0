"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"

interface User {
  id: string
  name: string
  cpf: string
  email: string
  type: string
}

const MOCK_USERS: User[] = [
  { id: "1", name: "João Silva", cpf: "123.456.789-00", email: "joao@example.com", type: "Administrador" },
  { id: "2", name: "Maria Santos", cpf: "987.654.321-00", email: "maria@example.com", type: "Médico" },
  { id: "3", name: "Pedro Oliveira", cpf: "456.789.123-00", email: "pedro@example.com", type: "Recepcionista" },
]

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50]

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteAlertOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setIsDeleteAlertOpen(false)
    }
  }

  const filteredUsers = users.filter(
    user => (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             user.cpf.includes(searchQuery) ||
             user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
             user.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (typeFilter === "all" || user.type === typeFilter)
  )

  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0078FF]">Usuários</h1>
        <div className="flex items-center space-x-4">
          <Button asChild className="bg-[#0078FF] hover:bg-blue-600">
            <Link href="/usuarios/regras">
              Regras
            </Link>
          </Button>
          <Button asChild className="bg-[#0078FF] hover:bg-blue-600">
            <Link href="/usuarios/cadastro">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Usuário
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Buscar usuário"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="Administrador">Administrador</SelectItem>
            <SelectItem value="Médico">Médico</SelectItem>
            <SelectItem value="Recepcionista">Recepcionista</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">CPF</TableHead>
              <TableHead className="text-white">E-mail</TableHead>
              <TableHead className="text-white">Tipo</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/usuarios/editar/${user.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
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
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} resultados
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

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja remover este usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário será removido permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

