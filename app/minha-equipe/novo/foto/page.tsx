"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Stepper } from "@/components/stepper"
import { Upload, X, ArrowLeft, Heart, MapPin, Star } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface FileWithProgress {
  file: File
  progress: number
  preview?: string
}

export default function NovoMembroEquipeFoto() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<FileWithProgress | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const newFile = { 
        file, 
        progress: 0,
        preview: reader.result as string
      }
      setUploadedFile(newFile)
      simulateUpload(newFile)
    }
    reader.readAsDataURL(file)
  }

  const simulateUpload = (fileInfo: FileWithProgress) => {
    const interval = setInterval(() => {
      setUploadedFile(prev => {
        if (prev && prev.progress < 100) {
          return { ...prev, progress: Math.min(prev.progress + 10, 100) }
        }
        clearInterval(interval)
        return prev
      })
    }, 500)
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadedFile) {
      toast({
        title: "Profissional cadastrado com sucesso",
        className: "bg-green-500 text-white"
      })
      router.push('/minha-equipe')
    }
  }

  const handleBack = () => {
    router.push('/minha-equipe/novo/curriculo')
  }

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">Home</Link>
        <span>/</span>
        <Link href="/minha-equipe" className="hover:text-[#0078FF]">minha equipe</Link>
        <span>/</span>
        <span className="text-gray-400">novo membro</span>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-[#0078FF]">
        Minha Equipe
      </h1>
      <p className="mb-8 text-gray-600">
        Insira as informações dos profissionais da saúde, que
        prestarão serviços na sua unidade, e que aparecerá no aplicativo.
      </p>

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

      {/* Progress Steps */}
      <div className="mb-12">
        <Stepper totalSteps={5} currentStep={5} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#0078FF]">
              Insira sua foto ou logotipo
            </h3>
            <p className="mt-2 text-gray-600">
              Sua imagem deve ter no máximo 2mg nos formatos, JPG, PDF ou PNG
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                isDragging
                  ? "border-[#0078FF] bg-blue-50"
                  : "border-gray-300 hover:border-[#0078FF]"
              }`}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <Upload className="mb-4 h-10 w-10 text-[#0078FF]" />
              <p className="text-center font-medium">
                Anexe sua imagem aqui
              </p>
              <p className="text-center text-sm text-gray-500">
                Peso máximo aceito 2mg
              </p>
            </div>

            {uploadedFile && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Arquivos anexados</p>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {uploadedFile.file.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-[#0078FF] transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-start">
              <Button 
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Voltar
              </Button>
            </div>
          </form>
        </Card>

        {/* Mobile Preview */}
        <div className="flex justify-center">
          <div className="w-[320px] overflow-hidden rounded-[40px] bg-white shadow-xl">
            <div className="relative bg-[#0078FF] pb-16 pt-4">
              <button className="ml-4 rounded-full bg-white/20 p-2">
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100">
                  {uploadedFile?.preview ? (
                    <Image
                      src={uploadedFile.preview}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                      <Upload className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 pb-6 pt-16">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>2km</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Avaliação</span>
                  <div className="flex items-center gap-1 text-[#0078FF]">
                    <Star className="h-4 w-4 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>

              <button className="mb-4 flex items-center gap-2 text-sm text-[#0078FF]">
                <Heart className="h-4 w-4" />
                <span>Favorite este perfil</span>
              </button>

              <h2 className="text-xl font-semibold">Dra. Paula Cintra</h2>
              <p className="mb-4 text-sm text-gray-600">Dermatologista - CRM 00000000</p>

              <div className="space-y-2 border-t pt-4">
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#0078FF]" />
                  <span>Avenida Paulista nº 1121 - São Paulo SP</span>
                </p>
                <p className="text-sm text-gray-600">CEP: 0000-000</p>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="mb-2 text-lg font-medium text-[#0078FF]">Biografia</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis, enim lobortis laoreet iaculis, augue
                </p>
                <button className="mt-1 text-sm text-[#0078FF]">
                  Saiba mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSubmit}
          className="bg-[#0078FF] px-8 hover:bg-blue-600"
          disabled={!uploadedFile}
        >
          Cadastrar Profissional
        </Button>
      </div>
    </div>
  )
}

