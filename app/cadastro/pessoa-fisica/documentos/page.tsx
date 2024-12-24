"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Stepper } from "@/components/stepper"
import { Upload, X } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FileWithProgress {
  file: File
  progress: number
}

export default function Documentos() {
  const router = useRouter()
  const [documentFiles, setDocumentFiles] = useState<FileWithProgress[]>([])
  const [profileImage, setProfileImage] = useState<FileWithProgress | null>(null)
  const [isDraggingDocs, setIsDraggingDocs] = useState(false)
  const [isDraggingProfile, setIsDraggingProfile] = useState(false)

  const handleDragOver = (e: React.DragEvent, type: 'docs' | 'profile') => {
    e.preventDefault()
    if (type === 'docs') setIsDraggingDocs(true)
    else setIsDraggingProfile(true)
  }

  const handleDragLeave = (e: React.DragEvent, type: 'docs' | 'profile') => {
    e.preventDefault()
    if (type === 'docs') setIsDraggingDocs(false)
    else setIsDraggingProfile(false)
  }

  const handleDrop = async (e: React.DragEvent, type: 'docs' | 'profile') => {
    e.preventDefault()
    setIsDraggingDocs(false)
    setIsDraggingProfile(false)

    const files = Array.from(e.dataTransfer.files)
    
    if (type === 'docs') {
      files.forEach(file => simulateUpload(file, true))
    } else if (type === 'profile' && files[0]) {
      simulateUpload(files[0], false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'docs' | 'profile') => {
    const files = Array.from(e.target.files || [])
    
    if (type === 'docs') {
      files.forEach(file => simulateUpload(file, true))
    } else if (type === 'profile' && files[0]) {
      simulateUpload(files[0], false)
    }
  }

  const simulateUpload = (file: File, isDocument: boolean) => {
    const newFile = { file, progress: 0 }
    
    if (isDocument) {
      setDocumentFiles(prev => [...prev, newFile])
    } else {
      setProfileImage(newFile)
    }

    const interval = setInterval(() => {
      if (isDocument) {
        setDocumentFiles(prev => 
          prev.map(f => 
            f.file === file 
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        )
      } else {
        setProfileImage(prev => 
          prev?.file === file
            ? { ...prev, progress: Math.min(prev.progress + 10, 100) }
            : prev
        )
      }
    }, 500)

    setTimeout(() => clearInterval(interval), 5000)
  }

  const removeFile = (file: File, isDocument: boolean) => {
    if (isDocument) {
      setDocumentFiles(prev => prev.filter(f => f.file !== file))
    } else {
      setProfileImage(null)
    }
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/cadastro/pessoa-fisica/senha')
  }

  const handleBack = () => {
    router.push('/cadastro/pessoa-fisica/curriculo')
  }

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">Home</Link>
        <span>/</span>
        <Link href="/cadastro" className="hover:text-[#0078FF]">meu cadastro</Link>
        <span>/</span>
        <span className="text-gray-400">prestador de serviço</span>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-[#0078FF]">
        Meu Cadastro
      </h1>
      <h2 className="mb-8 text-lg text-gray-600">
        Cadastro do prestador de serviço
      </h2>

      {/* Progress Steps */}
      <div className="mb-12">
        <Stepper totalSteps={7} currentStep={6} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Documents Section */}
        <Card className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#0078FF]">
              Documentos Pessoais
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Anexa sua carteira do Conselho Profissional e em
              segui tire uma fotografia com sua carteira
              profissional, e insira no aplicativo
            </p>
          </div>

          <div className="space-y-6">
            <div
              onDragOver={(e) => handleDragOver(e, 'docs')}
              onDragLeave={(e) => handleDragLeave(e, 'docs')}
              onDrop={(e) => handleDrop(e, 'docs')}
              className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                isDraggingDocs
                  ? "border-[#0078FF] bg-blue-50"
                  : "border-gray-300 hover:border-[#0078FF]"
              }`}
            >
              <input
                type="file"
                onChange={(e) => handleFileSelect(e, 'docs')}
                className="absolute inset-0 cursor-pointer opacity-0"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Upload className="mb-2 h-8 w-8 text-[#0078FF]" />
              <p className="text-center text-sm text-gray-600">
                Anexe sua imagem aqui
              </p>
              <p className="text-center text-xs text-gray-500">
                Peso máximo aceito 2mg
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                <strong>Observação:</strong> esse documento NÃO será
                disponibilizado para terceiro, servindo apenas para
                fins de confirmação dos dados.
              </p>
              
              {documentFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Arquivos anexados</p>
                  {documentFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {file.file.name}
                          </span>
                          <button
                            onClick={() => removeFile(file.file, true)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full bg-[#0078FF] transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Image Section */}
        <Card className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#0078FF]">
              Insira sua foto ou logotipo
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Sua imagem deve ter no máximo 4 mg nos
              formatos, JPG, PDF ou PNG com a escala de 1:1
              (quadrada)
            </p>
          </div>

          <div className="space-y-6">
            <div
              onDragOver={(e) => handleDragOver(e, 'profile')}
              onDragLeave={(e) => handleDragLeave(e, 'profile')}
              onDrop={(e) => handleDrop(e, 'profile')}
              className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                isDraggingProfile
                  ? "border-[#0078FF] bg-blue-50"
                  : "border-gray-300 hover:border-[#0078FF]"
              }`}
            >
              <input
                type="file"
                onChange={(e) => handleFileSelect(e, 'profile')}
                className="absolute inset-0 cursor-pointer opacity-0"
                accept=".jpg,.jpeg,.png"
              />
              <Upload className="mb-2 h-8 w-8 text-[#0078FF]" />
              <p className="text-center text-sm text-gray-600">
                Anexe sua imagem aqui
              </p>
              <p className="text-center text-xs text-gray-500">
                Peso máximo aceito 4mg
              </p>
            </div>

            {profileImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Arquivos anexados</p>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {profileImage.file.name}
                      </span>
                      <button
                        onClick={() => removeFile(profileImage.file, false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-[#0078FF] transition-all duration-300"
                        style={{ width: `${profileImage.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-between">
        <Button 
          type="button"
          variant="outline"
          onClick={handleBack}
        >
          Voltar
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-[#0078FF] px-8 hover:bg-blue-600"
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

