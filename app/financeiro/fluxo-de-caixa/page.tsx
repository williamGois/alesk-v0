"use client"

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { format, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

interface FluxoDeCaixa {
  id: string;
  dataConsulta: string;
  dataPagamento: string;
  categoria: string;
  especialidade: string;
  plano: 'Start' | 'Premium';
  formaPagamento: string;
  medico: {
    id: string;
    nome: string;
    avatar: string;
  };
  paciente: {
    id: string;
    nome: string;
    avatar: string;
  };
  valor: number;
}


const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


const generateMockData = (count: number): FluxoDeCaixa[] => {
  const categories = ["Consulta", "Exame", "Procedimento", "Cirurgia", "Retorno", "Emergência"];
  const specialties = ["Cardiologia", "Radiologia", "Pediatria", "Odontologia", "Dermatologia", "Ortopedia", "Oftalmologia", "Neurologia", "Ginecologia", "Urologia"];
  const planos = ["Start", "Premium"];
  const formasPagamento = ["Cartão de Crédito", "Dinheiro", "Plano de Saúde", "Pix", "Cartão de Débito", "Boleto", "Transferência Bancária"];
  const medicos = [
    "Dr. Carlos Silva", "Dra. Ana Oliveira", "Dr. Marcos Souza", "Dra. Juliana Costa", 
    "Dr. Ricardo Ferreira", "Dra. Beatriz Mendes", "Dr. Fernando Gomes", "Dra. Camila Rodrigues",
    "Dr. Luiz Henrique", "Dra. Patricia Almeida", "Dr. Roberto Santos", "Dra. Luciana Martins"
  ];
  const pacientes = [
    "Maria Santos", "João Pereira", "Ana Clara", "Pedro Alves", "Mariana Lima", "Carlos Eduardo", 
    "Luciana Martins", "Roberto Alves", "Fernanda Costa", "Gabriel Oliveira", "Isabela Souza", 
    "Rodrigo Ferreira", "Camila Rodrigues", "Lucas Mendes", "Juliana Gomes", "Marcelo Almeida"
  ];

  const startDate = new Date(2023, 0, 1); // 1st January 2023
  const endDate = new Date(); // Today

  return Array.from({ length: count }, (_, id) => {
    const consultaDate = generateRandomDate(startDate, endDate);
    const pagamentoDate = new Date(consultaDate);
    pagamentoDate.setDate(pagamentoDate.getDate() + Math.floor(Math.random() * 30)); // Payment up to 30 days after consultation

    const categoria = categories[Math.floor(Math.random() * categories.length)];
    const plano = planos[Math.floor(Math.random() * planos.length)];
    
    // Adjust valor based on categoria and plano
    let baseValor = 0;
    switch (categoria) {
      case "Consulta": baseValor = 150; break;
      case "Exame": baseValor = 200; break;
      case "Procedimento": baseValor = 300; break;
      case "Cirurgia": baseValor = 1000; break;
      case "Retorno": baseValor = 100; break;
      case "Emergência": baseValor = 250; break;
      default: baseValor = 150;
    }
    
    if (plano === "Premium") {
      baseValor *= 1.3; // 30% increase for Premium plan
    }

    // Add some randomness to the valor
    const valor = baseValor + (Math.random() * 50 - 25);

    return {
      id: (id + 1).toString(),
      dataConsulta: format(consultaDate, 'yyyy-MM-dd'),
      dataPagamento: format(pagamentoDate, 'yyyy-MM-dd'),
      categoria,
      especialidade: specialties[Math.floor(Math.random() * specialties.length)],
      plano,
      formaPagamento: formasPagamento[Math.floor(Math.random() * formasPagamento.length)],
      medico: {
        id: `m${Math.floor(Math.random() * medicos.length) + 1}`,
        nome: medicos[Math.floor(Math.random() * medicos.length)],
        avatar: "/placeholder.svg?height=32&width=32",
      },
      paciente: {
        id: `p${Math.floor(Math.random() * pacientes.length) + 1}`,
        nome: pacientes[Math.floor(Math.random() * pacientes.length)],
        avatar: "/placeholder.svg?height=32&width=32",
      },
      valor: parseFloat(valor.toFixed(2)),
    };
  });
}

const MOCK_FLUXO_DE_CAIXA: FluxoDeCaixa[] = generateMockData(200)

const ITEMS_PER_PAGE = 20
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function FluxoDeCaixaPage() {
  const [fluxoDeCaixa, setFluxoDeCaixa] = useState<FluxoDeCaixa[]>(MOCK_FLUXO_DE_CAIXA)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [planoFilter, setPlanoFilter] = useState<string>("all")

  const filteredFluxoDeCaixa = useMemo(() => {
    return fluxoDeCaixa.filter(item => 
      (item.paciente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.medico.nome.toLowerCase().includes(searchQuery.toLowerCase())) &&
      new Date(item.dataConsulta) >= new Date(startDate) &&
      new Date(item.dataConsulta) <= new Date(endDate) &&
      (planoFilter === "all" || item.plano === planoFilter)
    )
  }, [fluxoDeCaixa, searchQuery, startDate, endDate, planoFilter])

  const pageCount = Math.ceil(filteredFluxoDeCaixa.length / ITEMS_PER_PAGE)
  const paginatedFluxoDeCaixa = filteredFluxoDeCaixa.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    filteredFluxoDeCaixa.forEach(item => {
      const month = format(parseISO(item.dataConsulta), 'MMM yyyy', { locale: ptBR });
      monthlyData[month] = (monthlyData[month] || 0) + item.valor;
    });
    return Object.entries(monthlyData).map(([name, value]) => ({ name, value }));
  }, [filteredFluxoDeCaixa]);

  const pieChartData = useMemo(() => {
    const categoryValues = filteredFluxoDeCaixa.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryValues)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  }, [filteredFluxoDeCaixa]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-[#0078FF]">Fluxo de Caixa</h1>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Total Faturado</h3>
            <p className="text-2xl font-bold text-[#0078FF]">
              {filteredFluxoDeCaixa.reduce((sum, item) => sum + item.valor, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Número de Atendimentos</h3>
            <p className="text-2xl font-bold text-[#0078FF]">{filteredFluxoDeCaixa.length}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ticket Médio</h3>
            <p className="text-2xl font-bold text-[#0078FF]">
              {(filteredFluxoDeCaixa.reduce((sum, item) => sum + item.valor, 0) / filteredFluxoDeCaixa.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Período</h3>
            <p className="text-2xl font-bold text-[#0078FF]">
              {`${format(parseISO(startDate), 'dd/MM/yyyy')} - ${format(parseISO(endDate), 'dd/MM/yyyy')}`}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Buscar por nome</Label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                id="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="start-date">Data Inicial</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end-date">Data Final</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="plano-filter">Plano</Label>
            <Select value={planoFilter} onValueChange={setPlanoFilter}>
              <SelectTrigger id="plano-filter">
                <SelectValue placeholder="Filtrar por plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Start">Start</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
              <TableHead className="text-white">Data da Consulta</TableHead>
              <TableHead className="text-white">Data do Pagamento</TableHead>
              <TableHead className="text-white">Categoria</TableHead>
              <TableHead className="text-white">Especialidade</TableHead>
              <TableHead className="text-white">Plano</TableHead>
              <TableHead className="text-white">Forma de Pagamento</TableHead>
              <TableHead className="text-white">Médico</TableHead>
              <TableHead className="text-white">Paciente</TableHead>
              <TableHead className="text-white">Valor</TableHead>
              <TableHead className="text-right text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFluxoDeCaixa.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{format(parseISO(item.dataConsulta), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{format(parseISO(item.dataPagamento), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>{item.especialidade}</TableCell>
                <TableCell>{item.plano}</TableCell>
                <TableCell>{item.formaPagamento}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.medico.avatar} alt={item.medico.nome} />
                      <AvatarFallback>{item.medico.nome[0]}</AvatarFallback>
                    </Avatar>
                    <span>{item.medico.nome}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.paciente.avatar} alt={item.paciente.nome} />
                      <AvatarFallback>{item.paciente.nome[0]}</AvatarFallback>
                    </Avatar>
                    <span>{item.paciente.nome}</span>
                  </div>
                </TableCell>
                <TableCell>{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/financeiro/fluxo-de-caixa/${item.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredFluxoDeCaixa.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Line Chart */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Faturamento Mensal</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                <Legend />
                <Line type="monotone" dataKey="value" name="Faturamento" stroke="#0078FF" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria (Top 5)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredFluxoDeCaixa.length)} de {filteredFluxoDeCaixa.length} resultados
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

