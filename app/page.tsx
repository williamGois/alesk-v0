"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { Bell, CalendarIcon, DollarSign, Mail } from "lucide-react";
import { useState } from "react";
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

const performanceData = [
  { day: "01", value: 12 },
  { day: "03", value: 15 },
  { day: "06", value: 25 },
  { day: "09", value: 18 },
  { day: "12", value: 30 },
  { day: "15", value: 15 },
  { day: "18", value: 25 },
  { day: "21", value: 20 },
  { day: "24", value: 28 },
  { day: "27", value: 22 },
  { day: "30", value: 30 },
];

export default function Home() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Welcome Banner */}
      <div className="mb-8 overflow-hidden rounded-lg bg-[#0078FF] p-8">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-white opacity-50" />
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="h-2 w-2 rounded-full bg-white opacity-50" />
              </div>
              <h1 className="mb-4 text-3xl font-bold text-white">
                Prestador de Serviços,
                <br />
                Bem-vindo(a) ao Alesk!
              </h1>
            </div>
            <div className="relative h-[200px] w-[300px]">
              <Image src="" alt="Doctor" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <Card className="p-6">
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
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <DollarSign className="h-6 w-6 text-[#0078FF]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Orçamentos Sem Resposta</p>
              <p className="text-2xl font-bold">00</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Appointments and Billing Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-[#0078FF]">
          Agendamentos e Faturamento
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <CalendarIcon className="h-6 w-6 text-[#0078FF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Agendamentos Hoje</p>
                <p className="text-2xl font-bold">00</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <CalendarIcon className="h-6 w-6 text-[#0078FF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Agendamentos do Mês</p>
                <p className="text-2xl font-bold">00</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="h-6 w-6 text-[#0078FF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Faturamento Mensal</p>
                <p className="text-2xl font-bold">R$0.000,00</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="h-6 w-6 text-[#0078FF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Faturamento total</p>
                <p className="text-2xl font-bold">R$0.000,00</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Account Extract Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-[#0078FF]">
          Extrato da Conta
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="relative flex aspect-square items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full rounded-full border-8 border-blue-100">
                  <div
                    className="h-full w-full rounded-full border-8 border-[#0078FF]"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 80%)",
                    }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#0078FF]">80%</p>
                <p className="text-sm text-gray-500">Saldo em Conta</p>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6">
            <p className="text-2xl font-bold text-[#0078FF]">R$ 0000,00</p>
            <p className="text-sm text-gray-500">Saldo em Conta</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6">
            <p className="text-2xl font-bold text-green-500">R$ 0000,00</p>
            <p className="text-sm text-gray-500">Recebido</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6">
            <p className="text-2xl font-bold text-yellow-500">R$ 0000,00</p>
            <p className="text-sm text-gray-500">A Receber</p>
          </Card>
        </div>
      </div>

      {/* Performance Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-[#0078FF]">
          Acompanhe o seu Desempenho
        </h2>
        <div className="grid grid-cols-[1fr_300px] gap-4">
          <Card className="p-6">
            <div className="mb-4 flex gap-2">
              <Button variant="outline" size="sm">
                Diário
              </Button>
              <Button variant="outline" size="sm">
                Semanal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 text-[#0078FF]"
              >
                Mensal
              </Button>
              <Button variant="outline" size="sm">
                Anual
              </Button>
              <Button variant="outline" size="sm">
                Total
              </Button>
            </div>
            <div className="h-[300px] w-full rounded-lg shadow-md overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666" }}
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
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">00</p>
                <p className="text-sm text-gray-500">Agendamentos neste mês</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-500">+1.2%</p>
                <p className="text-xs text-gray-500">Do que o mês anterior</p>
              </div>
            </div>
            <div className="h-[200px] w-full bg-gray-50" />
          </Card>
        </div>
      </div>

      {/* Agenda Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-[#0078FF]">Agenda</h2>
        <div className="grid grid-cols-[1fr_300px] gap-4">
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
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#0078FF] text-white">
                  <th className="p-2 text-left">
                    <Checkbox />
                  </th>
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Horário</th>
                  <th className="p-2 text-left">Nome do Cliente</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="p-2">
                      <Checkbox />
                    </td>
                    <td className="p-2">03/02/2023</td>
                    <td className="p-2">09:00</td>
                    <td className="p-2">José Cláton Alves</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card className="p-6 w-[320px]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
