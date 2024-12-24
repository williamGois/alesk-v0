"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { format, addDays, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Lancamento {
  id: string
  data: Date
  descricao: string
  valor: number
  formaPagamento: string
  status: string
  isRecorrente: boolean
  periodicidade?: 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual'
  dataInicial?: Date
  dataFinal?: Date | null
}

const MOCK_LANCAMENTOS: Lancamento[] = [
  { id: "1", data: subDays(new Date(), 30), descricao: "Consulta clínica - Paciente X", valor: 150.00, formaPagamento: "Cartão", status: "Pago", isRecorrente: false },
  { id: "2", data: subDays(new Date(), 25), descricao: "Exame Laboratorial", valor: 200.00, formaPagamento: "Dinheiro", status: "Pendente", isRecorrente: false },
  { id: "3", data: subDays(new Date(), 20), descricao: "Consulta de retorno - Paciente Y", valor: 100.00, formaPagamento: "Pix", status: "Pago", isRecorrente: false },
  { id: "4", data: subDays(new Date(), 15), descricao: "Procedimento cirúrgico", valor: 1500.00, formaPagamento: "Convênio", status: "Pago", isRecorrente: false },
  { id: "5", data: subDays(new Date(), 10), descricao: "Consulta online", valor: 120.00, formaPagamento: "Cartão", status: "Pago", isRecorrente: false },
  { id: "6", data: subDays(new Date(), 5), descricao: "Venda de medicamentos", valor: 80.00, formaPagamento: "Dinheiro", status: "Pago", isRecorrente: false },
  { id: "7", data: new Date(), descricao: "Aluguel de equipamento", valor: 300.00, formaPagamento: "Transferência", status: "Pendente", isRecorrente: true, periodicidade: 'mensal' },
  { id: "8", data: addDays(new Date(), 5), descricao: "Consulta agendada - Paciente Z", valor: 180.00, formaPagamento: "Cartão", status: "Agendado", isRecorrente: false },
  { id: "9", data: addDays(new Date(), 10), descricao: "Exame de imagem", valor: 250.00, formaPagamento: "Convênio", status: "Agendado", isRecorrente: false },
  { id: "10", data: addDays(new Date(), 15), descricao: "Curso de atualização", valor: 500.00, formaPagamento: "Transferência", status: "Agendado", isRecorrente: false },
]

const ITEMS_PER_PAGE = 10

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function LancamentosPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(MOCK_LANCAMENTOS)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showGraph, setShowGraph] = useState(false)
  const [showFutureLancamentos, setShowFutureLancamentos] = useState(false)
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 30), 'yyyy-MM-dd'))
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredLancamentos = useMemo(() => {
    return lancamentos.filter(
      lancamento => 
        (lancamento.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lancamento.status.toLowerCase().includes(searchQuery.toLowerCase())) &&
        lancamento.data >= new Date(startDate) && 
        lancamento.data <= new Date(endDate) &&
        (statusFilter === "all" || lancamento.status === statusFilter)
    )
  }, [lancamentos, searchQuery, startDate, endDate, statusFilter])

  const pageCount = Math.ceil(filteredLancamentos.length / ITEMS_PER_PAGE)
  const paginatedLancamentos = filteredLancamentos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const chartData = useMemo(() => {
    const data = filteredLancamentos
      .sort((a, b) => a.data.getTime() - b.data.getTime())
      .map(lancamento => ({
        data: format(lancamento.data, 'dd/MM/yyyy'),
        valor: lancamento.valor,
        valorFormatted: lancamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        isFuture: lancamento.data > new Date()
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
  }, [filteredLancamentos])

  const pieChartData = useMemo(() => {
    const paymentMethods = filteredLancamentos.reduce((acc, lancamento) => {
      acc[lancamento.formaPagamento] = (acc[lancamento.formaPagamento] || 0) + lancamento.valor
      return acc
    }, {} as Record<string, number>)

    return Object.entries(paymentMethods).map(([name, value]) => ({ name, value }))
  }, [filteredLancamentos])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0078FF]">Lançamentos</h1>
        <Button asChild className="bg-[#0078FF] hover:bg-blue-600">
          <Link href="/financeiro/lancamentos/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
          </Link>
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
            <Input
              placeholder="Buscar lançamento"
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
          <Label htmlFor="statusFilter">Status do Lançamento:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="statusFilter">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Agendado">Agendado</SelectItem>
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
              onClick={() => setShowFutureLancamentos(false)}
              variant={!showFutureLancamentos ? "default" : "outline"}
              className="bg-[#0078FF] text-white hover:bg-blue-600"
            >
              Todos os Lançamentos
            </Button>
            <Button
              onClick={() => setShowFutureLancamentos(true)}
              variant={showFutureLancamentos ? "default" : "outline"}
              className="bg-[#0078FF] text-white hover:bg-blue-600"
            >
              Apenas Lançamentos Futuros
            </Button>
          </>
        )}
      </div>

      {showGraph ? (
        <div className="space-y-8">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Evolução dos Lançamentos</h3>
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
                  {showFutureLancamentos && (
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
              {paginatedLancamentos.map((lancamento) => (
                <TableRow key={lancamento.id}>
                  <TableCell>{format(lancamento.data, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{lancamento.descricao}</TableCell>
                  <TableCell>{lancamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{lancamento.formaPagamento}</TableCell>
                  <TableCell>{lancamento.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/financeiro/lancamentos/editar/${lancamento.id}`}>
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
          Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredLancamentos.length)} de {filteredLancamentos.length} resultados
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

