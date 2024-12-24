"use client";

import React, { useState, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InfoIcon, Trash2, Upload, X } from "lucide-react";

// Biblioteca para ler Excel
import XLSX from "xlsx";

import { Stepper } from "@/components/stepper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import CurrencyInput from "react-currency-input-field";

// ------------------------------------------------
// TIPOS
// ------------------------------------------------
interface Specialty {
  id: string;
  name: string;
  startPrice: number | null;
  premiumPrice: number | null;
}

interface Category {
  id: string;
  name: string;
  specialties?: Specialty[]; // nas categorias “normais”
  premiumOptions?: number[];
  isFixedPremium?: boolean;
  requiresFile?: boolean;
}

// Para simular upload (barra de progresso)
interface FileWithProgress {
  file: File;
  progress: number;
}

// ------------------------------------------------
// CONFIGURAÇÃO DAS CATEGORIAS
// (Retiramos specialties da categoria "procedimentos-clinicos-hospitalares")
// ------------------------------------------------
const CATEGORIES: Category[] = [
  {
    id: "consultas-cirurgias-procedimentos",
    name: "Consultas / Cirurgias / Procedimentos",
    specialties: [
      {
        id: "consulta-medica",
        name: "Consulta Médica",
        startPrice: 0,
        premiumPrice: 0,
      },
      {
        id: "cirurgia-geral",
        name: "Cirurgia Geral",
        startPrice: 0,
        premiumPrice: 0,
      },
      {
        id: "procedimento-geral",
        name: "Procedimento Geral",
        startPrice: 0,
        premiumPrice: 0,
      },
    ],
    premiumOptions: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    specialties: [
      {
        id: "sessao-fisio",
        name: "Sessão de Fisioterapia",
        startPrice: 0,
        premiumPrice: 0,
      },
    ],
    premiumOptions: [20, 30, 40, 50, 60, 80],
  },
  {
    id: "psicologia",
    name: "Psicologia",
    specialties: [
      {
        id: "sessao-psicologia",
        name: "Sessão de Psicologia",
        startPrice: 0,
        premiumPrice: 0,
      },
    ],
    premiumOptions: [25, 35, 50, 60, 80],
  },
  {
    id: "nutricao",
    name: "Nutrição",
    specialties: [
      {
        id: "consulta-nutricao",
        name: "Consulta Nutricional",
        startPrice: 0,
        premiumPrice: 0,
      },
    ],
    premiumOptions: [25, 35, 50, 60, 80],
  },
  {
    id: "fonoaudiologia",
    name: "Fonoaudiologia",
    specialties: [
      {
        id: "sessao-fono",
        name: "Sessão de Fonoaudiologia",
        startPrice: 0,
        premiumPrice: 0,
      },
    ],
    premiumOptions: [25, 35, 50, 60, 80],
  },
  {
    id: "exames-procedimentos-odontologicos",
    name: "Exames e procedimentos odontológicos",
    specialties: [
      {
        id: "raio-x-odonto",
        name: "Raio-X Odontológico",
        startPrice: 0,
        premiumPrice: 0,
      },
      {
        id: "limpeza-odonto",
        name: "Limpeza Odontológica",
        startPrice: 0,
        premiumPrice: 0,
      },
    ],
    isFixedPremium: true,
  },
  {
    id: "procedimentos-clinicos-hospitalares",
    name: "Procedimentos clínicos e hospitalares",
    // NÃO definimos specialties, pois elas virão do arquivo Excel
    requiresFile: true,
    premiumOptions: [50, 100, 150],
  },
];

// ------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------
export default function Servicos() {
  const router = useRouter();

  // Categorias expandidas
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  // Armazena as especialidades selecionadas/geradas por cada categoria
  const [categoriesSelection, setCategoriesSelection] = useState<{
    [categoryId: string]: {
      name: string;
      specialties: Specialty[];
    };
  }>({});

  // -------------------------
  // ESTADOS PARA DRAG & DROP
  // -------------------------
  // Caso a categoria "procedimentos-clinicos-hospitalares" esteja no modo "drag"
  const [isDraggingProcedimentos, setIsDraggingProcedimentos] = useState(false);

  // Armazena o(s) arquivo(s) que estão sendo simulados para upload
  const [procedureFiles, setProcedureFiles] = useState<FileWithProgress[]>([]);

  // ------------------------------------
  // NAVEGAÇÃO
  // ------------------------------------
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("categoriesSelection:", categoriesSelection);
    router.push("/cadastro/pessoa-fisica/dados-bancarios");
  };

  const handleBack = () => {
    router.push("/cadastro/pessoa-fisica/endereco");
  };

  // ------------------------------------
  // EXPANDIR / RETRAIR CATEGORIAS
  // ------------------------------------
  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // ------------------------------------
  // SELEÇÃO DE ESPECIALIDADES (exceto "procedimentos-clinicos-hospitalares")
  // ------------------------------------
  const isSpecialtySelected = (categoryId: string, specialtyId: string) => {
    const cat = categoriesSelection[categoryId];
    if (!cat) return false;
    return cat.specialties.some((s) => s.id === specialtyId);
  };

  const handleSpecialtyToggle = (category: Category, specialty: Specialty) => {
    setCategoriesSelection((prev) => {
      const currentCat = prev[category.id] || {
        name: category.name,
        specialties: [],
      };
      const alreadySelected = currentCat.specialties.some(
        (s) => s.id === specialty.id
      );

      let updatedSpecialties: Specialty[];
      if (alreadySelected) {
        // Remove
        updatedSpecialties = currentCat.specialties.filter(
          (s) => s.id !== specialty.id
        );
      } else {
        // Adiciona
        updatedSpecialties = [...currentCat.specialties, { ...specialty }];
      }

      // Se ficou vazio, remove a categoria
      if (updatedSpecialties.length === 0) {
        const copy = { ...prev };
        delete copy[category.id];
        return copy;
      }

      return {
        ...prev,
        [category.id]: {
          ...currentCat,
          specialties: updatedSpecialties,
        },
      };
    });
  };

  // ------------------------------------
  // MANIPULAÇÃO DE PREÇOS (START/PREMIUM)
  // ------------------------------------
  const handleStartPriceChange = (
    categoryId: string,
    specialtyId: string,
    inputValue: string | undefined
  ) => {
    // Convertemos string em número
    const numericValue = parseFloat(
      (inputValue || "0").replace(/\./g, "").replace(",", ".")
    );

    setCategoriesSelection((prev) => {
      const categoryData = prev[categoryId];
      if (!categoryData) return prev;
      const updatedSpecialties = categoryData.specialties.map((spec) =>
        spec.id === specialtyId ? { ...spec, startPrice: numericValue } : spec
      );
      return {
        ...prev,
        [categoryId]: {
          ...categoryData,
          specialties: updatedSpecialties,
        },
      };
    });
  };

  const handlePremiumPriceChange = (
    categoryId: string,
    specialtyId: string,
    value: number
  ) => {
    setCategoriesSelection((prev) => {
      const categoryData = prev[categoryId];
      if (!categoryData) return prev;
      const updatedSpecialties = categoryData.specialties.map((spec) =>
        spec.id === specialtyId ? { ...spec, premiumPrice: value } : spec
      );
      return {
        ...prev,
        [categoryId]: {
          ...categoryData,
          specialties: updatedSpecialties,
        },
      };
    });
  };

  // ------------------------------------
  // REMOVER ESPECIALIDADE (ÍCONE LIXEIRA)
  // ------------------------------------
  const handleRemoveSpecialty = (categoryId: string, specialtyId: string) => {
    setCategoriesSelection((prev) => {
      const categoryData = prev[categoryId];
      if (!categoryData) return prev;
      const updated = categoryData.specialties.filter(
        (s) => s.id !== specialtyId
      );
      if (updated.length === 0) {
        const copy = { ...prev };
        delete copy[categoryId];
        return copy;
      }
      return {
        ...prev,
        [categoryId]: {
          ...categoryData,
          specialties: updated,
        },
      };
    });
  };

  // ====================================
  // DRAG & DROP PARA "procedimentos-clinicos-hospitalares" (Excel)
  // ====================================
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingProcedimentos(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingProcedimentos(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingProcedimentos(false);

    const files = Array.from(e.dataTransfer.files || []);
    files.forEach((file) => simulateUpload(file));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => simulateUpload(file));
  };

  /**
   * Simula o upload com progress bar e, ao final, lê o conteúdo (Excel),
   * parseia e adiciona as especialidades em "procedimentos-clinicos-hospitalares".
   */
  const simulateUpload = (file: File) => {
    const newFile = { file, progress: 0 };
    setProcedureFiles((prev) => [...prev, newFile]);

    // Exemplo de "animação" de upload
    const interval = setInterval(() => {
      setProcedureFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, progress: Math.min(f.progress + 20, 100) }
            : f
        )
      );
    }, 500);

    // Em ~2.5s, encerramos o "upload"
    setTimeout(() => {
      clearInterval(interval);
      // Forçar progress = 100
      setProcedureFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, progress: 100 } : f))
      );
      // Agora parse do Excel
      parseExcelAndAddSpecialties(file, "procedimentos-clinicos-hospitalares");
    }, 2500);
  };

  // Remove file da lista de procedureFiles
  const removeProcedureFile = (file: File) => {
    setProcedureFiles((prev) => prev.filter((f) => f.file !== file));
  };

  /**
   * Lê a primeira planilha do Excel e converte para JSON usando XLSX.
   * Exemplo: TISS ou outro.
   * Espera-se que cada linha contenha algo como:
   * {
   *   "Codigo": "01010100",
   *   "Descricao": "Procedimento TISS X",
   *   "ValorStart": 100,
   *   "ValorPremium": 150
   * }
   * Ajuste conforme as colunas do seu Excel.
   */
  const parseExcelAndAddSpecialties = async (
    file: File,
    categoryId: string
  ) => {
    try {
      // Ler como ArrayBuffer
      const data = await file.arrayBuffer();
      // Fazer parse do workbook
      const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

      // Pegar a primeira planilha
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Converte em array de objetos
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 0 });

      // rows agora é algo como:
      // [
      //   { Codigo: '01010100', Descricao: 'Procedimento TISS X', ValorStart: 100, ValorPremium: 150 },
      //   ...
      // ]

      // Convertê-los em Specialty
      const parsedSpecialties: Specialty[] = (rows as any[]).map((row, i) => {
        // Ajuste aqui conforme o nome das colunas do seu Excel TISS
        const id = row["Codigo"] || `row-${i}`; // fallback
        const name = row["Descricao"] || `Procedimento sem nome #${i}`;
        const start = row["ValorStart"] ? Number(row["ValorStart"]) : 0;
        const premium = row["ValorPremium"] ? Number(row["ValorPremium"]) : 0;

        return {
          id: String(id),
          name: String(name),
          startPrice: start,
          premiumPrice: premium,
        };
      });

      // Agora adicionamos ao estado de categoriesSelection
      setCategoriesSelection((prev) => {
        const currentCat = prev[categoryId] || {
          name: "Procedimentos clínicos e hospitalares",
          specialties: [],
        };

        return {
          ...prev,
          [categoryId]: {
            ...currentCat,
            specialties: [...currentCat.specialties, ...parsedSpecialties],
          },
        };
      });
    } catch (err) {
      console.error("Erro ao ler Excel:", err);
      alert(
        "Não foi possível ler o arquivo Excel. Verifique se o formato está correto."
      );
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">
          Home
        </Link>
        <span>/</span>
        <Link href="/cadastro" className="hover:text-[#0078FF]">
          meu cadastro
        </Link>
        <span>/</span>
        <span className="text-gray-400">prestador de serviço</span>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-[#0078FF]">
        Meu Cadastro
      </h1>
      <h2 className="mb-8 text-lg text-gray-600">
        Cadastro do prestador de serviço
      </h2>

      {/* Passos de progresso */}
      <div className="mb-12">
        <Stepper totalSteps={7} currentStep={3} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Dados dos serviços prestados
          </h3>
        </div>

        {/* Informação ao usuário */}
        <div className="mb-8 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-[#0078FF]">
            <InfoIcon className="h-5 w-5" />
            <span>
              Selecione abaixo as categorias e especialidades prestadas
            </span>
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {/* Botões para cada categoria */}
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map((category) => {
              const isExpanded = expandedCategories[category.id] || false;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategoryExpand(category.id)}
                  className={`
                    px-4 py-2 rounded font-medium transition
                    ${
                      isExpanded
                        ? "bg-[#0078FF] text-white hover:bg-[#0078FF]/90"
                        : "bg-gray-200 hover:bg-gray-300"
                    }
                  `}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Para cada categoria expandida */}
          {CATEGORIES.map((category) => {
            if (!expandedCategories[category.id]) return null;

            const requiresFile = category.requiresFile;

            return (
              <div key={category.id} className="mt-6 space-y-4 border-b pb-6">
                <h4 className="text-lg font-semibold text-gray-700">
                  {category.name}
                </h4>

                {/* Se essa categoria exigir upload (procedimentos clínicos e hospitalares) */}
                {requiresFile && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Arraste e solte seu arquivo Excel (TISS) ou clique para
                      selecionar:
                    </p>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`
                        relative flex cursor-pointer flex-col items-center justify-center
                        rounded-lg border-2 border-dashed p-6 transition-colors 
                        ${
                          isDraggingProcedimentos
                            ? "border-[#0078FF] bg-blue-50"
                            : "border-gray-300 hover:border-[#0078FF]"
                        }
                      `}
                    >
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        accept=".xlsx,.xls,.csv"
                      />
                      <Upload className="mb-2 h-8 w-8 text-[#0078FF]" />
                      <p className="text-center text-sm text-gray-600">
                        Anexe seu arquivo TISS (Excel)
                      </p>
                      <p className="text-center text-xs text-gray-500">
                        .xlsx, .xls ou .csv
                      </p>
                    </div>

                    {/* Lista de arquivos que estamos subindo com barra de progresso */}
                    {procedureFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Uploads:</p>
                        {procedureFiles.map((fileObj, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg border p-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  {fileObj.file.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeProcedureFile(fileObj.file)
                                  }
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full bg-[#0078FF] transition-all duration-300"
                                  style={{ width: `${fileObj.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Se não exige arquivo, exibimos botões para as specialties padrão */}
                {!requiresFile && category.specialties && (
                  <div className="flex flex-wrap gap-3">
                    {category.specialties.map((specialty) => {
                      const selected = isSpecialtySelected(
                        category.id,
                        specialty.id
                      );
                      return (
                        <button
                          key={specialty.id}
                          type="button"
                          onClick={() =>
                            handleSpecialtyToggle(category, specialty)
                          }
                          className={`
                            px-3 py-2 rounded-full border border-[#0078FF] transition
                            ${
                              selected
                                ? "bg-blue-500 text-white hover:bg-blue-400"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }
                          `}
                        >
                          {specialty.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Renderiza uma TABELA para cada categoria que tenha specialties selecionadas */}
          {Object.keys(categoriesSelection).map((categoryId) => {
            const categoryData = categoriesSelection[categoryId];
            if (!categoryData || categoryData.specialties.length === 0)
              return null;

            const catConfig = CATEGORIES.find((c) => c.id === categoryId);
            const isFixed = catConfig?.isFixedPremium;
            const premiumOpts = catConfig?.premiumOptions || [];

            return (
              <div key={categoryId} className="mt-8 space-y-4">
                <h4 className="text-lg font-medium">{categoryData.name}</h4>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
                      <TableHead className="text-white">
                        Especialidade
                      </TableHead>
                      <TableHead className="text-white">Valor Start</TableHead>
                      <TableHead className="text-white">
                        Valor Premium
                      </TableHead>
                      <TableHead className="text-right text-white">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.specialties.map((spec) => (
                      <TableRow key={spec.id} className="hover:bg-gray-100">
                        <TableCell>{spec.name}</TableCell>

                        {/* Plano Start => input currency */}
                        <TableCell>
                          <CurrencyInput
                            id={`startPrice-${categoryId}-${spec.id}`}
                            name="planoStart"
                            placeholder="R$ 0,00"
                            className="border rounded px-2 py-1 w-24"
                            allowDecimals
                            decimalSeparator=","
                            groupSeparator="."
                            decimalsLimit={2}
                            prefix="R$ "
                            defaultValue={spec.startPrice ?? 0}
                            onValueChange={(value) =>
                              handleStartPriceChange(categoryId, spec.id, value)
                            }
                          />
                        </TableCell>

                        {/* Plano Premium => select ou fixo */}
                        <TableCell>
                          {isFixed ? (
                            <span className="text-gray-700 font-medium">
                              Valor fixo
                            </span>
                          ) : (
                            <Select
                              value={
                                spec.premiumPrice
                                  ? spec.premiumPrice.toString()
                                  : ""
                              }
                              onValueChange={(v) =>
                                handlePremiumPriceChange(
                                  categoryId,
                                  spec.id,
                                  Number(v)
                                )
                              }
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Premium" />
                              </SelectTrigger>
                              <SelectContent>
                                {premiumOpts.map((price) => (
                                  <SelectItem
                                    key={price}
                                    value={price.toString()}
                                  >
                                    {formatCurrency(price)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveSpecialty(categoryId, spec.id)
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}

          {/* Botões "Voltar" e "Próximo" */}
          <div className="flex justify-between pt-4 mt-4 border-t">
            <Button type="button" variant="outline" onClick={handleBack}>
              Voltar
            </Button>
            <Button
              type="submit"
              className="bg-[#0078FF] px-8 hover:bg-blue-600"
            >
              Próximo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ------------------------------------------------
// FUNÇÃO DE FORMATAÇÃO DE MOEDA
// ------------------------------------------------
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
