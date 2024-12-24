"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, Paperclip, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

interface TimeSlot {
  time: string;
  status: "available" | "booked" | "unavailable";
  patient?: string;
  procedure?: string;
  attachments?: number;
}

export default function AgendamentosPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const timeSlots: TimeSlot[] = [
    {
      time: "10:00 às 11:00",
      status: "available",
      procedure: "Procedimento: Cardiologista",
    },
    {
      time: "11:00 às 12:00",
      status: "booked",
      patient: "José Oliveira",
      procedure: "Procedimento: Cardiologista",
      attachments: 2,
    },
    {
      time: "12:00 às 13:00",
      status: "unavailable",
    },
  ];

  const handleReschedule = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    // Handle the rescheduling logic here
    setRescheduleModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">
          Home
        </Link>
        <span>/</span>
        <Link href="/agenda" className="hover:text-[#0078FF]">
          Agenda
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-semibold text-[#0078FF]">Agenda</h1>

      <div className="mb-6 flex items-start gap-4">
        <div className="flex items-center gap-4">
          <Image
            src=""
            alt="Hospital logo"
            width={48}
            height={48}
            className="rounded-full bg-[#0078FF]"
          />
          <div>
            <h2 className="text-lg font-medium text-[#0078FF]">
              Hospital Israelita Albert Einsten
            </h2>
            <p className="text-sm text-gray-600">Tipo: Hospital</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-3">
        <Button
          variant="outline"
          className="border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
          asChild
        >
          <Link href="/agenda/calendario">Criar e Editar Agenda</Link>
        </Button>
        <Button className="bg-[#0078FF] px-6 hover:bg-blue-600">
          Agendamentos
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Agendamento para:</h3>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <Image
                src=""
                alt="Dr. Carlos Alberto"
                width={40}
                height={40}
                className="rounded-full bg-[#0078FF]"
              />
              <div>
                <h4 className="font-medium">Dr. Carlos Alberto</h4>
                <p className="text-sm text-gray-600">Cardiologista</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">
              Selecione a data desejada
            </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd MMM, yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                  className="rounded-md border"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-lg font-medium text-[#0078FF]",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-muted-foreground rounded-md w-9 font-normal text-sm",
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
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">01 de Fevereiro</h3>
            <Tabs defaultValue="procedimento">
              <TabsList className="mb-4">
                <TabsTrigger value="procedimento">Procedimento</TabsTrigger>
                <TabsTrigger value="propostas">Propostas</TabsTrigger>
              </TabsList>
              <TabsContent value="procedimento" className="space-y-4">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 ${
                      slot.status === "available"
                        ? "bg-[#0078FF] text-white"
                        : slot.status === "booked"
                        ? "border-2 border-[#0078FF] text-[#0078FF]"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="text-lg">{slot.time}</span>
                        </div>
                        {slot.status === "available" && (
                          <>
                            <h4 className="text-xl font-medium">
                              Horário Disponível
                            </h4>
                            <p className="text-white/90">{slot.procedure}</p>
                          </>
                        )}
                        {slot.status === "booked" && (
                          <>
                            <h4 className="text-xl font-medium text-[#0078FF]">
                              {slot.patient}
                            </h4>
                            <p className="text-[#0078FF]/90">
                              {slot.procedure}
                            </p>
                          </>
                        )}
                        {slot.status === "unavailable" && (
                          <p className="text-gray-500">Horário Indisponível</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {slot.attachments && (
                          <div className="flex items-center gap-2 text-[#0078FF]/90">
                            <Paperclip className="h-4 w-4" />
                            <span>{slot.attachments} anexos</span>
                          </div>
                        )}
                        {slot.status === "available" && (
                          <Button
                            className="bg-white text-[#0078FF] hover:bg-white/90"
                            asChild
                          >
                            <Link href="/agenda/calendario">Agendar</Link>
                          </Button>
                        )}
                        {slot.status === "booked" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
                            >
                              Cancelar Consulta
                            </Button>
                            <Button
                              className="bg-[#0078FF] text-white hover:bg-blue-600"
                              onClick={() => handleReschedule(slot)}
                            >
                              Reagendar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Ações em bloco</h3>
            <div className="rounded-lg border p-4">
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reagendar" id="reagendar" />
                  <Label htmlFor="reagendar">Reagendar todos os horários</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="indisponivel" id="indisponivel" />
                  <Label htmlFor="indisponivel">
                    Tornar indisponível todos os horários
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disponivel" id="disponivel" />
                  <Label htmlFor="disponivel">
                    Tornar disponível todos os horários
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-medium">Informações da agenda</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Tipo de Atendimento:
                </h4>
                <p>Clínica</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Dias de Atendimento:
                </h4>
                <p>De Segunda à Sexta</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Horários:</h4>
                <p>9:40 às 11:00 e 13:00 às 16:00</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Intervalo entre consultas:
                </h4>
                <p>30 minutos</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Atendimento por hora:
                </h4>
                <p>2 pacientes</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Vagas por dia
                </h4>
                <p>11 vagas</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Confirmação de reagendamento
            </h2>
            <Button
              variant="ghost"
              className="h-6 w-6 rounded-full p-0"
              onClick={() => setRescheduleModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Você está preste reagendar um procedimento do usuário{" "}
              <span className="font-medium text-[#0078FF]">
                {selectedSlot?.patient}
              </span>{" "}
              com o{" "}
              <span className="font-medium text-[#0078FF]">
                Dr. Carlos Alberto
              </span>
              .
              <br />
              Você confirma a solicitação de reagendamento?
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setRescheduleModalOpen(false)}
            >
              Desistir
            </Button>
            <Button
              className="bg-[#0078FF] hover:bg-blue-600"
              onClick={handleConfirmReschedule}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
