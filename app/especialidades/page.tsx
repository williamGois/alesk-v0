"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Plus, Search, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from "next/image"
import { useDropzone } from 'react-dropzone'
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'

interface Specialty {
  id: string
  category: string
  name: string
  icon: string
}

const MOCK_SPECIALTIES: Specialty[] = [
  { id: "1", category: "Médica", name: "Cardiologia", icon: "/icons/heart.png" },
  { id: "2", category: "Odontológica", name: "Ortodontia", icon: "/icons/tooth.png" },
  { id: "3", category: "Fisioterapia", name: "Ortopédica", icon: "/icons/bone.png" },
  { id: "4", category: "Médica", name: "Neurologia", icon: "/icons/brain.png" },
  { id: "5", category: "Odontológica", name: "Endodontia", icon: "/icons/tooth-root.png" },
  { id: "6", category: "Fisioterapia", name: "Respiratória", icon: "/icons/lungs.png" },
  { id: "7", category: "Médica", name: "Dermatologia", icon: "/icons/skin.png" },
  { id: "8", category: "Odontológica", name: "Periodontia", icon: "/icons/gum.png" },
  { id: "9", category: "Fisioterapia", name: "Neurológica", icon: "/icons/nerve.png" },
  { id: "10", category: "Médica", name: "Oftalmologia", icon: "/icons/eye.png" },
  { id: "11", category: "Odontológica", name: "Implantodontia", icon: "/icons/implant.png" },
  { id: "12", category: "Fisioterapia", name: "Esportiva", icon: "/icons/athlete.png" },
]

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50]

export default function EspecialidadesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>(MOCK_SPECIALTIES)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null)
  const [editedSpecialty, setEditedSpecialty] = useState<Specialty | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const searchParams = useSearchParams()
  const activeSpecialty = searchParams.get('activeSpecialty')

  const handleEdit = (specialty: Specialty) => {
    setSelectedSpecialty(specialty)
    setEditedSpecialty({ ...specialty })
    setIsEditModalOpen(true)
  }

  const handleDelete = (specialty: Specialty) => {
    setSelectedSpecialty(specialty)
    setIsDeleteAlertOpen(true)
  }

  const handleSave = () => {
    if (editedSpecialty) {
      setSpecialties(specialties.map(s => s.id === editedSpecialty.id ? editedSpecialty : s))
      setIsEditModalOpen(false)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedSpecialty) {
      setSpecialties(specialties.filter(s => s.id !== selectedSpecialty.id))
      setIsDeleteAlertOpen(false)
    }
  }

  const filteredSpecialties = specialties.filter(
    specialty => 
      (specialty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialty.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "all" || specialty.category === categoryFilter || 
       (activeSpecialty && specialty.category === activeSpecialty))
  )

  const pageCount = Math.ceil(filteredSpecialties.length / itemsPerPage)
  const paginatedSpecialties = filteredSpecialties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
        if (editedSpecialty) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setEditedSpecialty(prev => ({ ...prev!, icon: e.target?.result as string }))
          }
          reader.readAsDataURL(file)
        }
      }
    }, 200)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, itemsPerPage])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0078FF]">Especialidades</h1>
        <Button asChild className="bg-[#0078FF] hover:bg-blue-600">
          <Link href={`/especialidades/cadastro?activeSpecialty=${categoryFilter}`}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Especialidade
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Buscar especialidade"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <Select value={activeSpecialty || categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="Médica">Médica</SelectItem>
            <SelectItem value="Odontológica">Odontológica</SelectItem>
            <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
          </SelectContent>
        </Select>
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
              <TableHead className="text-white">Categoria</TableHead>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Ícone</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSpecialties.map((specialty) => (
              <TableRow key={specialty.id}>
                <TableCell>{specialty.category}</TableCell>
                <TableCell>{specialty.name}</TableCell>
                <TableCell>
                  <Image src={specialty.icon} alt={specialty.name} width={24} height={24} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(specialty)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(specialty)}>
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
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredSpecialties.length)} de {filteredSpecialties.length} resultados
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Especialidade</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select
                value={editedSpecialty?.category}
                onValueChange={(value) => setEditedSpecialty(prev => ({ ...prev!, category: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Médica">Médica</SelectItem>
                  <SelectItem value="Odontológica">Odontológica</SelectItem>
                  <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editedSpecialty?.name}
                onChange={(e) => setEditedSpecialty(prev => ({ ...prev!, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Ícone
              </Label>
              <div className="col-span-3">
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-[#0078FF] hover:bg-blue-600">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a especialidade.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

