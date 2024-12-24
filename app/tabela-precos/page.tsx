"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Plus, Search, ImageIcon, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from "next/image"
import { CurrencyInput } from "@/components/CurrencyInput"
import { useDropzone } from 'react-dropzone'
import Link from 'next/link';


interface PriceItem {
  id: string
  categoryName: string
  categoryIcon: string
  specialtyName: string
  specialtyIcon: string
  startPrice: number
  premiumPrice: number
}


const MOCK_CATEGORIES = [
  { name: "Médica", icon: "/icons/medical.png" },
  { name: "Odontológica", icon: "/icons/dental.png" },
  { name: "Fisioterapia", icon: "/icons/physiotherapy.png" },
]

const MOCK_SPECIALTIES = [
  { category: "Médica", name: "Cardiologia", icon: "/icons/heart.png" },
  { category: "Odontológica", name: "Ortodontia", icon: "/icons/tooth.png" },
  { category: "Fisioterapia", name: "Ortopédica", icon: "/icons/bone.png" },
]

const INITIAL_PRICE_ITEMS: PriceItem[] = [
  {
    id: "1",
    categoryName: "Médica",
    categoryIcon: "/icons/medical.png",
    specialtyName: "Cardiologia",
    specialtyIcon: "/icons/heart.png",
    startPrice: 200,
    premiumPrice: 260,
  },
  {
    id: "2",
    categoryName: "Odontológica",
    categoryIcon: "/icons/dental.png",
    specialtyName: "Ortodontia",
    specialtyIcon: "/icons/tooth.png",
    startPrice: 150,
    premiumPrice: 195,
  },
]


export default function TabelaPrecosPage() {
  const [priceItems, setPriceItems] = useState<PriceItem[]>(INITIAL_PRICE_ITEMS)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [newItem, setNewItem] = useState<Partial<PriceItem>>({})
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<PriceItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [categories] = useState(MOCK_CATEGORIES)
  const [specialties] = useState(MOCK_SPECIALTIES)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, specialtyFilter, itemsPerPage])

  useEffect(() => {
    if (newItem.categoryName) {
      setNewItem(prev => ({
        ...prev,
        specialtyName: "",
      }))
    }
  }, [newItem.categoryName])

  const filteredItems = priceItems.filter(
    item =>
      (item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.specialtyName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "all" || item.categoryName === categoryFilter) &&
      (specialtyFilter === "all" || item.specialtyName === specialtyFilter)
  )

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddItem = () => {
    if (newItem.categoryName && newItem.specialtyName && newItem.startPrice) {
      const startPrice = newItem.startPrice;
      const premiumPrice = Math.round(startPrice * 1.3);
      const newPriceItem: PriceItem = {
        id: Date.now().toString(),
        categoryName: newItem.categoryName as string,
        categoryIcon: categories.find(cat => cat.name === newItem.categoryName)?.icon || "/icons/default.png",
        specialtyName: newItem.specialtyName as string,
        specialtyIcon: specialties.find(spec => spec.name === newItem.specialtyName)?.icon || "/icons/default.png",
        startPrice: startPrice,
        premiumPrice: premiumPrice,
      }
      setPriceItems([...priceItems, newPriceItem])
      setIsAddModalOpen(false)
      setNewItem({})
    }
  }

  const handleEditItem = () => {
    if (editingItem && newItem.categoryName && newItem.specialtyName && newItem.startPrice) {
      const startPrice = newItem.startPrice;
      const premiumPrice = Math.round(startPrice * 1.3);
      const updatedItem: PriceItem = {
        ...editingItem,
        categoryName: newItem.categoryName as string,
        categoryIcon: categories.find(cat => cat.name === newItem.categoryName)?.icon || "/icons/default.png",
        specialtyName: newItem.specialtyName as string,
        specialtyIcon: specialties.find(spec => spec.name === newItem.specialtyName)?.icon || "/icons/default.png",
        startPrice: startPrice,
        premiumPrice: premiumPrice,
      }
      setPriceItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
      setIsEditModalOpen(false)
      setEditingItem(null)
      setNewItem({})
    }
  }

  const handleDeleteItem = () => {
    if (itemToDelete) {
      setPriceItems(prev => prev.filter(item => item.id !== itemToDelete.id))
      setItemToDelete(null)
      setIsDeleteAlertOpen(false)
    }
  }

  const handleEdit = (item: PriceItem) => {
    setEditingItem(item)
    setNewItem({
      categoryName: item.categoryName,
      specialtyName: item.specialtyName,
      startPrice: item.startPrice,
      premiumPrice: item.premiumPrice,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (item: PriceItem) => {
    setItemToDelete(item)
    setIsDeleteAlertOpen(true)
  }

  const getSpecialtiesForCategory = (categoryName: string) => {
    return specialties
      .filter(specialty => specialty.category === categoryName)
      .map(specialty => ({
        value: specialty.name,
        label: (
          <div className="flex items-center">
            <Image src={specialty.icon} alt={specialty.name} width={20} height={20} className="mr-2" />
            {specialty.name}
          </div>
        )
      }))
  }

  const onDropCSV = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Handle CSV import here
      console.log("Importing CSV:", file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop: onDropCSV, accept: '.csv' })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0078FF]">Tabela de Preços</h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0078FF] hover:bg-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Preço
          </Button>
          <Button 
            onClick={() => setIsImportModalOpen(true)} 
            className="bg-green-600 hover:bg-green-700"
          >
            Importar Valores
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Buscar por categoria ou especialidade"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                <div className="flex items-center gap-2">
                  <Image src={category.icon} alt={category.name} width={20} height={20} />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por especialidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categoryFilter === "all"
              ? specialties.map((specialty) => (
                  <SelectItem key={specialty.name} value={specialty.name}>
                    <div className="flex items-center gap-2">
                      <Image src={specialty.icon} alt={specialty.name} width={20} height={20} />
                      {specialty.name}
                    </div>
                  </SelectItem>
                ))
              : getSpecialtiesForCategory(categoryFilter).map((specialty) => (
                <SelectItem key={specialty.value} value={specialty.value}>
                  {specialty.label}
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
              <TableHead className="text-white">Especialidade</TableHead>
              <TableHead className="text-white">Plano Start</TableHead>
              <TableHead className="text-white">Plano Premium</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Image src={item.categoryIcon} alt={item.categoryName} width={24} height={24} className="mr-2" />
                    {item.categoryName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Image src={item.specialtyIcon} alt={item.specialtyName} width={24} height={24} className="mr-2" />
                    {item.specialtyName}
                  </div>
                </TableCell>
                <TableCell>{item.startPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell>
                  {item.premiumPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  <span className="ml-2 text-xs text-green-600">(+30%)</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} até {Math.min(currentPage * itemsPerPage, filteredItems.length)} de {filteredItems.length} resultados
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Itens por página</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {currentPage} de {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
              disabled={currentPage === pageCount}
            >
              <span className="sr-only">Próxima página</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Preço</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Categoria
              </Label>
              <Select
                value={newItem.categoryName || ""}
                onValueChange={(value) => setNewItem({ ...newItem, categoryName: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center gap-2">
                        <Image src={category.icon} alt={category.name} width={20} height={20} />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialtyName" className="text-right">
                Especialidade
              </Label>
              <Select
                value={newItem.specialtyName || ""}
                onValueChange={(value) => setNewItem({ ...newItem, specialtyName: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {getSpecialtiesForCategory(newItem.categoryName as string).map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startPrice" className="text-right">
                Preço Start
              </Label>
              <CurrencyInput
                id="startPrice"
                value={newItem.startPrice || 0}
                onChange={(value) => setNewItem({ ...newItem, startPrice: value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="premiumPrice" className="text-right">
                Preço Premium
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="premiumPrice"
                  value={newItem.startPrice ? `R$ ${(newItem.startPrice * 1.3).toFixed(2)}` : 'R$ 0,00'}
                  readOnly
                  className="bg-gray-100"
                />
                <span className="ml-2 text-sm text-green-600">(+30%)</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddItem} className="bg-[#0078FF] hover:bg-blue-600" disabled={!newItem.categoryName || !newItem.specialtyName || !newItem.startPrice}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Preço</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Categoria
              </Label>
              <Select
                value={newItem.categoryName || ""}
                onValueChange={(value) => setNewItem({ ...newItem, categoryName: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center gap-2">
                        <Image src={category.icon} alt={category.name} width={20} height={20} />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialtyName" className="text-right">
                Especialidade
              </Label>
              <Select
                value={newItem.specialtyName || ""}
                onValueChange={(value) => setNewItem({ ...newItem, specialtyName: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {getSpecialtiesForCategory(newItem.categoryName as string).map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startPrice" className="text-right">
                Preço Start
              </Label>
              <CurrencyInput
                id="startPrice"
                value={newItem.startPrice || 0}
                onChange={(value) => setNewItem({ ...newItem, startPrice: value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="premiumPrice" className="text-right">
                Preço Premium
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="premiumPrice"
                  value={newItem.startPrice ? `R$ ${(newItem.startPrice * 1.3).toFixed(2)}` : 'R$ 0,00'}
                  readOnly
                  className="bg-gray-100"
                />
                <span className="ml-2 text-sm text-green-600">(+30%)</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditItem} className="bg-[#0078FF] hover:bg-blue-600" disabled={!newItem.categoryName || !newItem.specialtyName || !newItem.startPrice}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Preço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este preço? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Tabela de Preços</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div {...getRootProps()} className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer">
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Arraste e solte um arquivo CSV aqui, ou clique para selecionar</p>
            </div>
            <Link
              href="/example.csv"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Exemplo de CSV
            </Link>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsImportModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-4 text-sm text-gray-600">
        <p>* O Plano Premium tem um acréscimo de 30% sobre o valor do Plano Start.</p>
      </div>
    </div>
  )
}

