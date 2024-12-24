"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
// Removido: import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string;
  name: string;
  icon: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Médica", icon: "/icons/medical.png" },
  { id: "2", name: "Odontológica", icon: "/icons/dental.png" },
  { id: "3", name: "Fisioterapia", icon: "/icons/physiotherapy.png" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Removido: const { toast } = useToast()

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      simulateUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: false,
  });

  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        if (editedCategory) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setEditedCategory((prev) => ({
              ...prev!,
              icon: e.target?.result as string,
            }));
          };
          reader.readAsDataURL(file);
        }
      }
    }, 200);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditedCategory({ ...category });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedCategory) {
      setCategories(
        categories.map((c) => (c.id === editedCategory.id ? editedCategory : c))
      );
      setIsEditModalOpen(false);
      // Removido:
      // toast({
      //   title: "Categoria editada com sucesso!",
      //   description: "As alterações foram salvas.",
      // })
      alert("Categoria editada com sucesso! As alterações foram salvas.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0078FF]">Categorias</h1>
        <Button asChild className="bg-[#0078FF] hover:bg-blue-600">
          <Link href="/categorias/cadastro">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Buscar categoria"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
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
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Ícone</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={24}
                    height={24}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
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
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
          {Math.min(currentPage * itemsPerPage, filteredCategories.length)} de{" "}
          {filteredCategories.length} resultados
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
            onClick={() =>
              setCurrentPage((page) => Math.min(pageCount, page + 1))
            }
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
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editedCategory?.name}
                onChange={(e) =>
                  setEditedCategory((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
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
                    isDragActive
                      ? "border-[#0078FF] bg-blue-50"
                      : "border-gray-300"
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
                          e.stopPropagation();
                          setUploadedFile(null);
                          setUploadProgress(0);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p>
                        Arraste e solte um arquivo de imagem aqui, ou clique
                        para selecionar
                      </p>
                      <p className="text-sm text-gray-500">
                        (Apenas PNG, JPG, JPEG)
                      </p>
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
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#0078FF] hover:bg-blue-600"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
