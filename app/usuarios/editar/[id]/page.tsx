"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X } from 'lucide-react'
import Image from "next/image"
import { MaskedInput } from "@/components/MaskedInput"

interface User {
  id: string
  name: string
  email: string
  cpf: string
  type: string
  avatar?: string
  isActive: boolean
}

// Simulating fetching user data
const fetchUser = async (id: string): Promise<User> => {
  // This would be replaced with an actual API call
  return {
    id,
    name: "João Silva",
    email: "joao@example.com",
    cpf: "123.456.789-00",
    type: "admin",
    avatar: "/placeholder.svg",
    isActive: true
  }
}

export default function EditarUsuario({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchUser(params.id)
      setUser(userData)
    }
    loadUser()
  }, [params.id])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica real de atualização
    toast({
      title: "Usuário atualizado com sucesso!",
      description: "As informações do usuário foram atualizadas.",
    })
    router.push('/usuarios')
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">Editar Usuário</h1>
      
      <Card className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                {avatar ? (
                  <AvatarImage src={URL.createObjectURL(avatar)} alt="Avatar do usuário" />
                ) : user.avatar ? (
                  <AvatarImage src={user.avatar} alt="Avatar do usuário" />
                ) : (
                  <AvatarFallback className="bg-[#0078FF] text-white text-4xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                <Upload className="h-5 w-5 text-[#0078FF]" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Digite o e-mail"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <MaskedInput
              id="cpf"
              mask="999.999.999-99"
              value={user.cpf}
              onChange={(value) => setUser({ ...user, cpf: value })}
              placeholder="000.000.000-00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuário</Label>
            <Select value={user.type} onValueChange={(value) => setUser({ ...user, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="doctor">Médico</SelectItem>
                <SelectItem value="receptionist">Recepcionista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="user-active"
              checked={user.isActive}
              onCheckedChange={(checked) => setUser({ ...user, isActive: checked })}
            />
            <Label htmlFor="user-active">Usuário Ativo</Label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.push('/usuarios')}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0078FF] hover:bg-blue-600">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

