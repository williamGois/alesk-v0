"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from 'react-dropzone'
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CadastroEspecialidade() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      simulateUpload(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: false
  })

  const simulateUpload = (file: File) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 200)
  }

  const handleSave = () => {
    // Aqui você implementaria a lógica real de salvamento
    // Por enquanto, vamos apenas simular um salvamento bem-sucedido
    toast({
      title: "Especialidade salva com sucesso!",
      description: "A nova especialidade foi adicionada à lista.",
    })
    router.push('/especialidades')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">Cadastro de Especialidade</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Especialidade</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome da especialidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Médica">Médica</SelectItem>
              <SelectItem value="Odontológica">Odontológica</SelectItem>
              <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ícone da Especialidade</Label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
              isDragActive ? 'border-[#0078FF] bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {uploadedFile ? (
              <div className="flex items-center justify-center">
                <Image
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Uploaded icon"
                  width={48}
                  height={48}
                  className="mr-2"
                />
                <span>{uploadedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setUploadedFile(null)
                    setUploadProgress(0)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p>Arraste e solte um arquivo de imagem aqui, ou clique para selecionar</p>
                <p className="text-sm text-gray-500">(Apenas PNG, JPG, JPEG)</p>
              </div>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress value={uploadProgress} className="mt-2" />
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push('/especialidades')}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#0078FF] hover:bg-blue-600">
            Salvar Especialidade
          </Button>
        </div>
      </div>
    </div>
  )
}

