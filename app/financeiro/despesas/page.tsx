"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { format, addDays, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface Despesa {
  id: string
  data: Date
  descricao: string
  valor: number
  formaPagamento: string
  status: string
}

const MOCK_DESPESAS: Despesa[] = [
  { id: "1", data: subDays(new Date(), 30), descricao: "Aluguel do consultório", valor: 2000.00, formaPagamento: "Transferência", status: "Pago" },
  { id: "2", data: subDays(new Date(), 25), descricao: "Compra de insumos", valor: 500.00, formaPagamento: "Cartão", status: "Pendente" },
  { id: "3", data: subDays(new Date(), 20), descricao: "Salário funcionário", valor: 1500.00, formaPagamento: "Transferência", status: "Pago" },
  { id: "4", data: subDays(new Date(), 15), descricao: "Compra de equipamento", valor: 5000.00, formaPagamento: "Cartão", status: "Pago" },
  { id: "5", data: subDays(new Date(), 10), descricao: "Conta de luz", valor: 300.00, formaPagamento: "Boleto", status: "Pendente" },
]

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50]

const ITEMS_PER_PAGE = 10

export default function DespesasPage() {
  const [despesas, setDespesas] = useState<Despesa[]>(MOCK_DESPESAS)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showGraph, setShowGraph] = useState(false)
  const [showFutureDespesas, setShowFutureDespesas] = useState(false)
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 30), 'yyyy-MM-dd'))
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredDespesas = useMemo(() => {
    return despesas.filter(
      despesa => 
        (despesa.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        despesa.status.toLowerCase().includes(searchQuery.toLowerCase())) &&
        despesa.data >= new Date(startDate) && 
        despesa.data <= new Date(endDate) &&
        (statusFilter === "all" || despesa.status === statusFilter)
    )
  }, [despesas, searchQuery, startDate, endDate, statusFilter])

  const pageCount = Math.ceil(filteredDespesas.length / itemsPerPage)
  const paginatedDespesas = filteredDespesas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const chartData = useMemo(() => {
    const data = filteredDespesas
      .sort((a, b) => a.data.getTime() - b.data.getTime())
      .map(despesa => ({
        data: format(despesa.data, 'dd/MM/yyyy'),
        valor: despesa.valor,
        valorFormatted: despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        isFuture: despesa.data > new Date()
      }))

    let cumulativeValue = 0
    return data.map(item => {
      cumulativeValue += item.valor
      return { 
        ...item, 
        cumulativo: cumulativeValue,
        cumulativoFormatted: cumulativeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      }
    })
  }, [filteredDespesas])

  const pieChartData = useMemo(() => {
    const paymentMethods = filteredDespesas.reduce((acc, despesa) => {
      acc[despesa.formaPagamento] = (acc[despesa.formaPagamento] || 0) + despesa.valor
      return acc
    }, {} as Record<string, number>)

    return Object.entries(paymentMethods).map(([name, value]) => ({ name, value }))
  }, [filteredDespesas])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, startDate, endDate, statusFilter, itemsPerPage])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0078FF]">Despesas</h1>
        <Button asChild className="bg-[#0078FF] hover:bg-blue-600">
          <Link href="/financeiro/despesas/novo">
            <Plus className="mr-2 h-4 w-4" /> Nova Despesa
          </Link>
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
            <Input
              placeholder="Buscar despesa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="startDate">De:</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="endDate">Até:</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="statusFilter">Status da Despesa:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="statusFilter">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Button
          onClick={() => setShowGraph(!showGraph)}
          variant={showGraph ? "default" : "outline"}
          className="bg-[#0078FF] text-white hover:bg-blue-600"
        >
          {showGraph ? "Visualizar Lista" : "Visualizar Gráfico"}
        </Button>
        {showGraph && (
          <>
            <Button
              onClick={() => setShowFutureDespesas(false)}
              variant={!showFutureDespesas ? "default" : "outline"}
              className="bg-[#0078FF] text-white hover:bg-blue-600"
            >
              Todas as Despesas
            </Button>
            <Button
              onClick={() => setShowFutureDespesas(true)}
              variant={showFutureDespesas ? "default" : "outline"}
              className="bg-[#0078FF] text-white hover:bg-blue-600"
            >
              Apenas Despesas Futuras
            </Button>
          </>
        )}
      </div>

      {showGraph ? (
        <div className="space-y-8">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Evolução das Despesas</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis tickFormatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                  <Tooltip 
                    formatter={(value, name) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), name]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#0078FF"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    name="Valor"
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativo"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    name="Valor Cumulativo"
                  />
                  {showFutureDespesas && (
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke="#0078FF"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                      name="Valor Futuro"
                      data={chartData.filter(item => item.isFuture)}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Formas de Pagamento</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name} ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
                <TableHead className="text-white">Data</TableHead>
                <TableHead className="text-white">Descrição</TableHead>
                <TableHead className="text-white">Valor</TableHead>
                <TableHead className="text-white">Forma de Pagamento</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-right text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDespesas.map((despesa) => (
                <TableRow key={despesa.id}>
                  <TableCell>{format(despesa.data, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{despesa.descricao}</TableCell>
                  <TableCell>{despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{despesa.formaPagamento}</TableCell>
                  <TableCell>{despesa.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/financeiro/despesas/editar/${despesa.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredDespesas.length)} de {filteredDespesas.length} resultados
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
    </div>
  )
}

