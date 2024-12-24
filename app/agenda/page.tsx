"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CareTypeButton } from "@/components/care-type-button";
import { Building2, Video, Home } from "lucide-react";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

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

export default function AgendaPage() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [interval, setInterval] = useState<number>(30);
  const [appointmentsPerHour, setAppointmentsPerHour] = useState<number>(2);
  const [slotsPerDay, setSlotsPerDay] = useState<number>(13);
  const [morningSlots, setMorningSlots] = useState<string[]>([]);
  const [afternoonSlots, setAfternoonSlots] = useState<string[]>([]);
  const [eveningSlots, setEveningSlots] = useState<string[]>([]);
  const [careType, setCareType] = useState<
    "clinica" | "teleconsulta" | "domicilio"
  >("clinica");

  const debouncedUpdateTimeSlots = debounce(() => {
    calculateTimeSlots();
  }, 300);

  const calculateTimeSlots = () => {
    const slots: string[] = [];
    const startTime = new Date(2023, 0, 1, 9, 0, 0); // 9:00 AM
    const endTime = new Date(2023, 0, 1, 20, 0, 0); // 8:00 PM

    while (startTime < endTime) {
      slots.push(
        startTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      startTime.setMinutes(startTime.getMinutes() + interval);
    }

    const morning = slots.filter((time) => {
      const hour = parseInt(time.split(":")[0]);
      return hour >= 9 && hour < 12;
    });
    const afternoon = slots.filter((time) => {
      const hour = parseInt(time.split(":")[0]);
      return hour >= 12 && hour < 18;
    });
    const evening = slots.filter((time) => {
      const hour = parseInt(time.split(":")[0]);
      return hour >= 18 && hour < 20;
    });

    setMorningSlots(morning);
    setAfternoonSlots(afternoon);
    setEveningSlots(evening);
  };

  useEffect(() => {
    calculateTimeSlots();
  }, [interval]);

  const handleIntervalChange = (value: number) => {
    const newInterval = Math.max(1, value);
    setInterval(newInterval);
    setAppointmentsPerHour(Math.floor(60 / newInterval));
    updateSlotsPerDay(Math.floor(60 / newInterval));
    debouncedUpdateTimeSlots();
  };

  const handleAppointmentsPerHourChange = (value: number) => {
    const newAppointmentsPerHour = Math.max(1, value);
    setAppointmentsPerHour(newAppointmentsPerHour);
    const newInterval = Math.floor(60 / newAppointmentsPerHour);
    setInterval(newInterval);
    updateSlotsPerDay(newAppointmentsPerHour);
    debouncedUpdateTimeSlots();
  };

  const handleSlotsPerDayChange = (value: number) => {
    const newSlotsPerDay = Math.max(1, value);
    setSlotsPerDay(newSlotsPerDay);
    const newAppointmentsPerHour = Math.floor(newSlotsPerDay / 11); // 11 hours from 9 AM to 8 PM
    setAppointmentsPerHour(newAppointmentsPerHour);
    setInterval(Math.floor(60 / newAppointmentsPerHour));
    debouncedUpdateTimeSlots();
  };

  const updateSlotsPerDay = (appointmentsPerHour: number) => {
    const hoursPerDay = 11; // 9 AM to 8 PM
    setSlotsPerDay(hoursPerDay * appointmentsPerHour);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleCreateAgenda = () => {
    router.push("/agenda/agendamentos");
  };

  return (
    <div className="mx-auto max-w-[1200px] p-6 space-y-12">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="text-[#0078FF] hover:text-blue-700">
          Home
        </Link>
        <span>/</span>
        <span>Agenda</span>
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
        <Button className="bg-[#0078FF] px-6 hover:bg-blue-600">
          Criar e Editar Agenda
        </Button>
        <Button
          variant="outline"
          className="border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
        >
          Agendamentos
        </Button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-medium text-black">
            Nome e Especialidade do Profissional
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 text-sm font-medium text-gray-700">
                Escolha o Profissional
              </Label>
              <Select defaultValue="carlos">
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carlos">Carlos Alberto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 text-sm font-medium text-gray-700">
                Selecione a Especialidade
              </Label>
              <Select defaultValue="cardio">
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio">Cardiologista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium text-black">
            Que tipo de atendimento será prestado?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CareTypeButton
              icon={<Building2 className="h-14 w-14" />}
              label="Na clínica"
              selected={careType === "clinica"}
              onClick={() => setCareType("clinica")}
            />
            <CareTypeButton
              icon={<Video className="h-14 w-14" />}
              label="Por Teleconsulta"
              selected={careType === "teleconsulta"}
              onClick={() => setCareType("teleconsulta")}
            />
            <CareTypeButton
              icon={<Home className="h-14 w-14" />}
              label="Atendimento domicílio do paciente"
              selected={careType === "domicilio"}
              onClick={() => setCareType("domicilio")}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium text-black">
            Escolha os dias de atendimento e horário
          </h3>
          <div className="border border-gray-200 rounded-lg p-6 space-y-8">
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <div>
                <Label className="mb-1.5 text-sm font-medium text-gray-700">
                  Intervalo entre atendimento (min)
                </Label>
                <Input
                  type="number"
                  value={interval.toString()}
                  onChange={(e) =>
                    handleIntervalChange(parseInt(e.target.value) || 1)
                  }
                  onFocus={(e) => e.target.select()}
                  min="1"
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label className="mb-1.5 text-sm font-medium text-gray-700">
                  Qtd de atendimento por hora
                </Label>
                <Input
                  type="number"
                  value={appointmentsPerHour.toString()}
                  onChange={(e) =>
                    handleAppointmentsPerHourChange(
                      parseInt(e.target.value) || 1
                    )
                  }
                  onFocus={(e) => e.target.select()}
                  min="1"
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label className="mb-1.5 text-sm font-medium text-gray-700">
                  Qtd de vagas por dia
                </Label>
                <Input
                  type="number"
                  value={slotsPerDay.toString()}
                  onChange={(e) =>
                    handleSlotsPerDayChange(parseInt(e.target.value) || 1)
                  }
                  onFocus={(e) => e.target.select()}
                  min="1"
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <svg
                  width="15"
                  height="17"
                  viewBox="0 0 15 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.1875 1.0625V2.125H1.59375C0.713867 2.125 0 2.83887 0 3.71875V5.3125H14.875V3.71875C14.875 2.83887 14.1611 2.125 13.2812 2.125H11.6875V1.0625C11.6875 0.474805 11.2127 0 10.625 0C10.0373 0 9.5625 0.474805 9.5625 1.0625V2.125H5.3125V1.0625C5.3125 0.474805 4.8377 0 4.25 0C3.6623 0 3.1875 0.474805 3.1875 1.0625ZM14.875 6.375H0V15.4062C0 16.2861 0.713867 17 1.59375 17H13.2812C14.1611 17 14.875 16.2861 14.875 15.4062V6.375Z"
                    fill="#0078FF"
                  />
                </svg>
                <Label className="text-base font-medium text-[#0078FF]">
                  Selecione os dias da semana
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Segunda",
                  "Terça",
                  "Quarta",
                  "Quinta",
                  "Sexta",
                  "Sábado",
                  "Domingo",
                ].map((day) => (
                  <Button
                    key={day}
                    variant="outline"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedDays.includes(day)
                        ? "bg-[#0078FF] text-white hover:bg-blue-600"
                        : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
                    }`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18C4.02891 18 0 13.9711 0 9C0 4.02891 4.02891 0 9 0C13.9711 0 18 4.02891 18 9C18 13.9711 13.9711 18 9 18ZM8.15625 4.21875V9C8.15625 9.28125 8.29688 9.54492 8.53242 9.70312L11.9074 11.9531C12.2941 12.2133 12.818 12.1078 13.0781 11.7176C13.3383 11.3273 13.2328 10.807 12.8426 10.5469L9.84375 8.55V4.21875C9.84375 3.75117 9.46758 3.375 9 3.375C8.53242 3.375 8.15625 3.75117 8.15625 4.21875Z"
                    fill="#0078FF"
                  />
                </svg>
                <Label className="text-base font-medium text-[#0078FF]">
                  Escolha os horários
                </Label>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="mb-3 text-base font-medium text-[#0078FF]">
                    Manhã
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {morningSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        onClick={() => toggleTime(time)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          selectedTimes.includes(time)
                            ? "bg-[#0078FF] text-white hover:bg-blue-600"
                            : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-base font-medium text-[#0078FF]">
                    Tarde
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {afternoonSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        onClick={() => toggleTime(time)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          selectedTimes.includes(time)
                            ? "bg-[#0078FF] text-white hover:bg-blue-600"
                            : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-base font-medium text-[#0078FF]">
                    Noite
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {eveningSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        onClick={() => toggleTime(time)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          selectedTimes.includes(time)
                            ? "bg-[#0078FF] text-white hover:bg-blue-600"
                            : "border-[#0078FF] text-[#0078FF] hover:bg-blue-50"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleCreateAgenda}
              className="bg-[#0078FF] px-8 py-2.5 text-base font-medium hover:bg-blue-600"
            >
              Criar Agenda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
