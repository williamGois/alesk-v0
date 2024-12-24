"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import {
  Bell,
  CalendarIcon,
  DollarSign,
  Mail,
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { Carousel } from "@/components/carousel";
import Link from "next/link";
import { WelcomeBanner } from "@/components/WelcomeBanner";

const performanceData = [
  { day: "01", value: 0.2 },
  { day: "03", value: 0.3 },
  { day: "06", value: 1.1 },
  { day: "09", value: 0.7 },
  { day: "12", value: 1.6 },
  { day: "15", value: 0.5 },
  { day: "18", value: 1.2 },
  { day: "21", value: 0.9 },
  { day: "24", value: 0.5 },
  { day: "27", value: 1.3 },
  { day: "30", value: 1.7 },
];

const appointmentsData = [
  { date: "03/02/2023", time: "09:00", patient: "José Claiton Alves" },
  { date: "03/02/2023", time: "10:00", patient: "José Claiton Alves" },
  { date: "03/02/2023", time: "11:00", patient: "José Claiton Alves" },
  { date: "03/02/2023", time: "14:00", patient: "José Claiton Alves" },
  { date: "03/02/2023", time: "15:00", patient: "José Claiton Alves" },
  { date: "03/02/2023", time: "16:00", patient: "José Claiton Alves" },
  { date: "03/02/2023", time: "17:00", patient: "José Claiton Alves" },
];

const images = [
  "",
  "", // New image
  "/placeholder.svg?height=200&width=300",
];

export default function DashboardMedico() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Welcome Banner */}
      <div className="mb-8 overflow-hidden rounded-lg bg-[#0078FF] p-8">
        <WelcomeBanner />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Mensagens</h2>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-[#0078FF]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mensagens Não Lidas</p>
              <p className="text-2xl font-bold">00</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Alertas</h2>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Bell className="h-6 w-6 text-[#0078FF]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Notificações Não Lidas</p>
              <p className="text-2xl font-bold">00</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Agendamentos */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-[#0078FF]">
          Agendamentos
        </h2>
        <div className="grid grid-cols-[1fr_400px] gap-4">
          {/* Appointments Table */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <Image
                src="/placeholder.svg"
                alt="Doctor profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">Dr. Carlos Alberto</p>
                <p className="text-sm text-gray-500">Cardiologista</p>
                <div className="flex gap-2">
                  <Link
                    href="/agenda/calendario"
                    className="text-blue-500 hover:underline"
                  >
                    Ver Perfil
                  </Link>
                  <span className="text-gray-400">&#183;</span>
                  <Link
                    href="/agenda/calendario"
                    className="text-blue-500 hover:underline"
                  >
                    Editar Perfil
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-b mb-4" />

            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 text-[#0078FF]">
                  <th className="p-2 text-left">
                    <Checkbox />
                  </th>
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Horário</th>
                  <th className="p-2 text-left">Nome do Paciente</th>
                  <th className="p-2 text-left">Dados do Paciente</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsData.map((appointment, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="p-2">
                      <Checkbox />
                    </td>
                    <td className="p-2">{appointment.date}</td>
                    <td className="p-2">{appointment.time}</td>
                    <td className="p-2">{appointment.patient}</td>
                    <td className="p-2">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex gap-2">
              <Button variant="link" size="sm" className="text-[#0078FF]">
                Ver Agenda Completa
              </Button>
              <Button
                size="sm"
                className="bg-[#0078FF] text-white hover:bg-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Agenda
              </Button>
            </div>
          </Card>

          {/* Calendar */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Selecione a data desejada
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                className="w-full"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-between pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  day_selected:
                    "bg-[#0078FF] text-white hover:bg-[#0078FF] hover:text-white focus:bg-[#0078FF] focus:text-white",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 rounded-lg border p-4">
                <CalendarIcon className="h-5 w-5 text-[#0078FF]" />
                <span className="text-sm">Agendamentos Hoje</span>
                <span className="ml-auto text-lg font-bold">00</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-4">
                <CalendarIcon className="h-5 w-5 text-[#0078FF]" />
                <span className="text-sm">Agendamentos do Mês</span>
                <span className="ml-auto text-lg font-bold">00</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Desempenho Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-[#0078FF]">
          Acompanhe o seu Desempenho
        </h2>
        <div className="grid grid-cols-[1fr_300px] gap-4">
          {/* Line Chart */}
          <Card className="p-6">
            <div className="mb-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 text-[#0078FF]"
              >
                Diário
              </Button>
              <Button variant="outline" size="sm">
                Semanal
              </Button>
              <Button variant="outline" size="sm">
                Mensal
              </Button>
              <Button variant="outline" size="sm">
                Anual
              </Button>
              <Button variant="outline" size="sm">
                Total
              </Button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666" }}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666" }}
                    domain={[0, 4]}
                    tickFormatter={(value) => (value * 1000).toFixed(0)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="none"
                    fill="#0078FF"
                    fillOpacity={0.1}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0078FF"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                    tension={0.3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Appointment Summary */}
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold">Agendamentos</h3>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">00</p>
                <p className="text-sm text-gray-500">Agendamentos neste mês</p>
              </div>
              <div className="h-[50px] w-[80px] bg-blue-50 rounded-lg" />
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Agendamentos</p>
              <p className="font-medium">+00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Do que o mês anterior</p>
              <p className="font-medium text-green-600">+12%</p>
            </div>
            <div className="border-t mt-4 pt-4 text-center">
              <p className="text-sm text-gray-500">Total de Agendamentos:</p>
              <p className="text-lg font-bold">000</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
