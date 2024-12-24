"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Pencil, Trash2 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

// Sample data - replace with actual data fetching
const TEAM_MEMBERS = [
  { id: 1, name: "Kleber de Alcantara", email: "kleberal@alesk.com.br", phone: "(11) 0000-0000" },
  { id: 2, name: "Kleber de Alcantara", email: "kleberal@alesk.com.br", phone: "(11) 0000-0000" },
  { id: 3, name: "Kleber de Alcantara", email: "kleberal@alesk.com.br", phone: "(11) 0000-0000" },
  { id: 4, name: "Kleber de Alcantara", email: "kleberal@alesk.com.br", phone: "(11) 0000-0000" },
  { id: 5, name: "Kleber de Alcantara", email: "kleberal@alesk.com.br", phone: "(11) 0000-0000" },
  { id: 6, name: "Kleber de Alcantara", email: "kleberal@alesk.com.br", phone: "(11) 0000-0000" },
]

export default function MinhaEquipe() {
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<'cadastrados' | 'excluidos'>('cadastrados')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null)

  const toggleMember = (id: number) => {
    const newSelected = new Set(selectedMembers)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedMembers(newSelected)
  }

  const toggleAllMembers = () => {
    if (selectedMembers.size === TEAM_MEMBERS.length) {
      setSelectedMembers(new Set())
    } else {
      setSelectedMembers(new Set(TEAM_MEMBERS.map(member => member.id)))
    }
  }

  const handleDeleteClick = (id: number) => {
    setMemberToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    // Implement actual delete logic here
    console.log(`Deleting member with id: ${memberToDelete}`)
    setDeleteModalOpen(false)
    setMemberToDelete(null)
  }

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">Home</Link>
        <span>/</span>
        <span className="text-gray-400">Membros de Equipe</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Membros de Equipe</h1>
        <Button asChild className="bg-[#0078FF] hover:bg-blue-600">
          <Link href="/minha-equipe/novo">
            Cadastrar Membro de Equipe
          </Link>
        </Button>
      </div>

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

      <div className="mb-6 flex items-end gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar Usuário"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-50"
          />
        </div>
        <div className="space-x-2">
          <span className="text-sm font-medium">Filtre por</span>
          <Button
            variant={activeFilter === 'cadastrados' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('cadastrados')}
            className={activeFilter === 'cadastrados' ? 'bg-[#0078FF] hover:bg-blue-600' : ''}
          >
            Cadastrados
          </Button>
          <Button
            variant={activeFilter === 'excluidos' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('excluidos')}
            className={activeFilter === 'excluidos' ? 'bg-[#0078FF] hover:bg-blue-600' : ''}
          >
            Excluídos
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-[#0078FF] text-white">
              <tr>
                <th className="w-[40px] p-4 text-left">
                  <Checkbox 
                    checked={selectedMembers.size === TEAM_MEMBERS.length}
                    onCheckedChange={toggleAllMembers}
                  />
                </th>
                <th className="p-4 text-left font-medium">Nome</th>
                <th className="p-4 text-left font-medium">E-mail</th>
                <th className="p-4 text-left font-medium">Celular</th>
                <th className="p-4 text-left font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {TEAM_MEMBERS.map((member) => (
                <tr 
                  key={member.id}
                  className={member.id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="p-4">
                    <Checkbox 
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                  </td>
                  <td className="p-4">{member.name}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">{member.phone}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este membro da equipe? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

