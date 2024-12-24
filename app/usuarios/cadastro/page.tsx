"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MaskedInput } from "@/components/MaskedInput"

export default function CadastroUsuario() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [userType, setUserType] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica real de salvamento
    toast({
      title: "Usuário cadastrado com sucesso!",
      description: "O novo usuário foi adicionado ao sistema.",
    })
    router.push('/usuarios')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">Cadastro de Usuário</h1>
      
      <Card className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                {avatar ? (
                  <AvatarImage src={URL.createObjectURL(avatar)} alt="Avatar do usuário" />
                ) : (
                  <AvatarFallback className="bg-[#0078FF] text-white text-4xl">
                    {name.charAt(0).toUpperCase()}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
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
              placeholder="Digite o e-mail"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <MaskedInput
              id="cpf"
              mask="999.999.999-99"
              value={cpf}
              onChange={setCpf}
              placeholder="000.000.000-00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuário</Label>
            <Select value={userType} onValueChange={setUserType}>
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

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.push('/usuarios')}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0078FF] hover:bg-blue-600">
              Cadastrar Usuário
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

