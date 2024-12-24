"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, Plus, Settings, Bell, Copy, Edit2, X, Clock, AlertTriangle, Search, Calendar } from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO, addMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"
import { DoctorConfig } from '@/components/DoctorConfig'

interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  doctorName: string
  time: string
  endTime: string
  status: 'confirmado' | 'aguardando' | 'cancelado'
  date: string
  duration: number
  observation?: string
  returnVisit?: string
  sendReminder?: boolean
}

interface Doctor {
  id: number
  name: string
  appointmentsPerHour: number
  appointmentDuration: number
  workingHours: {
    start: string
    end: string
  }
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8:00 to 20:00

const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Carlos Alberto", appointmentsPerHour: 2, appointmentDuration: 30, workingHours: { start: "08:00", end: "20:00" } },
  { id: 2, name: "Dra. Maria Silva", appointmentsPerHour: 3, appointmentDuration: 20, workingHours: { start: "08:00", end: "20:00" } },
  { id: 3, name: "Dr. João Santos", appointmentsPerHour: 1, appointmentDuration: 60, workingHours: { start: "08:00", end: "20:00" } },
  { id: 4, name: "Dra. Ana Oliveira", appointmentsPerHour: 4, appointmentDuration: 15, workingHours: { start: "08:00", end: "20:00" } },
]

// Sample appointments data
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientName: "João Paulo",
    patientPhone: "+55 11 99999-9999",
    doctorName: "Dr. Carlos Alberto",
    time: "10:00",
    endTime: "11:00",
    status: "confirmado",
    date: "2024-12-16",
    duration: 60
  },
  {
    id: "2",
    patientName: "Maria Silva",
    patientPhone: "+55 11 88888-8888",
    time: "14:00",
    endTime: "15:00",
    doctorName: "Dra. Ana Oliveira",
    status: "aguardando",
    date: "2024-12-16",
    duration: 60
  }
]

const calculateAppointmentsPerDay = (doctor: Doctor) => {
  const [startHour, startMinute] = doctor.workingHours.start.split(':').map(Number)
  const [endHour, endMinute] = doctor.workingHours.end.split(':').map(Number)
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
  return Math.floor(totalMinutes / doctor.appointmentDuration)
}

const updateAgendaWithDoctorSettings = (doctor: Doctor) => {
  // Additional logic to update the agenda display would go here.  This is highly dependent on the structure of your application.
};

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"week" | "day">("week")
  const [selectedDoctor, setSelectedDoctor] = useState<string>(DOCTORS[0].id.toString())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientName: '',
    time: '',
    date: format(new Date(), "yyyy-MM-dd"),
    duration: 60,
    status: 'aguardando' as const
  })
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [activeTab, setActiveTab] = useState<'consulta' | 'compromisso'>('consulta')
  const [currentTime, setCurrentTime] = useState(new Date())
  const timeIndicatorRef = useRef<HTMLDivElement>(null)
  const [doctors, setDoctors] = useState(DOCTORS)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const saoPauloTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
      saoPauloTime.setHours(saoPauloTime.getHours() - 1); // Subtract one hour
      setCurrentTime(saoPauloTime);
      
      if (timeIndicatorRef.current) {
        const startHour = 8;
        const endHour = 20;
        const totalHours = endHour - startHour;
        const currentHour = saoPauloTime.getHours();
        const currentMinute = saoPauloTime.getMinutes();
        
        if (currentHour >= startHour && currentHour < endHour) {
          const percentage = ((currentHour - startHour + currentMinute / 60) / totalHours) * 100;
          timeIndicatorRef.current.style.top = `${percentage}%`;
          timeIndicatorRef.current.style.display = 'block';
        } else {
          timeIndicatorRef.current.style.display = 'none';
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [])

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const navigateToToday = () => setCurrentDate(new Date())
  const navigatePrevious = () => setCurrentDate(date => subWeeks(date, 1))
  const navigateNext = () => setCurrentDate(date => addWeeks(date, 1))

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => 
      apt.date === format(date, "yyyy-MM-dd") && 
      apt.doctorName === doctors.find(d => d.id.toString() === selectedDoctor)?.name
    )
  }

  const getAppointmentForTimeSlot = (date: Date, hour: number, minute: number) => {
    const appointments = getAppointmentsForDay(date)
    return appointments.find(apt => {
      const [aptHour, aptMinute] = apt.time.split(":").map(Number)
      return aptHour === hour && aptMinute === minute
    })
  }

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setSelectedAppointment(null)
    setIsEditModalOpen(true)
  }

  const handleInputChange = (field: keyof Appointment, value: string | boolean | number) => {
    if (editingAppointment) {
      setEditingAppointment({ ...editingAppointment, [field]: value })
    }
  }

  const clearField = (field: keyof Appointment) => {
    if (editingAppointment) {
      setEditingAppointment({ ...editingAppointment, [field]: '' })
    }
  }

  const handleNewAppointmentClick = (date: Date, hour: number, minute: number) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    const selectedDoctorName = doctors.find(d => d.id.toString() === selectedDoctor)?.name || ''
    setNewAppointment({
      date: formattedDate,
      time: formattedTime,
      endTime: format(addMinutes(new Date(date.setHours(hour, minute)), 60), "HH:mm"),
      doctorName: selectedDoctorName,
      duration: 60,
      status: 'aguardando'
    })
    setIsNewAppointmentModalOpen(true)
  }

  const handleNewAppointmentChange = (field: keyof Appointment, value: string | number) => {
    setNewAppointment(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'time' || field === 'duration') {
        const [hour, minute] = (updated.time as string).split(':').map(Number)
        const startTime = new Date().setHours(hour, minute)
        updated.endTime = format(addMinutes(startTime, updated.duration as number), "HH:mm")
      }
      return updated
    })
  }

  const handleCreateAppointment = () => {
    const newAppointmentWithId = {
      ...newAppointment,
      id: Date.now().toString(),
    } as Appointment
    setAppointments(prev => [...prev, newAppointmentWithId])
    setIsNewAppointmentModalOpen(false)
    setNewAppointment({})
  }

  const handleUpdateAppointment = () => {
    if (editingAppointment) {
      setAppointments(prev => prev.map(apt => apt.id === editingAppointment.id ? editingAppointment : apt))
      setIsEditModalOpen(false)
      setEditingAppointment(null)
    }
  }

  const handleDeleteAppointment = () => {
    if (editingAppointment) {
      setAppointments(prev => prev.filter(apt => apt.id !== editingAppointment.id))
      setIsEditModalOpen(false)
      setEditingAppointment(null)
    }
  }

  const handleDuplicateAppointment = (appointment: Appointment) => {
    const duplicatedAppointment = {
      ...appointment,
      id: Date.now().toString(),
      status: 'aguardando' as const
    }
    setAppointments(prev => [...prev, duplicatedAppointment])
  }

  const filteredAppointments = appointments.filter(apt => 
    (apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) &&
    apt.doctorName === doctors.find(d => d.id.toString() === selectedDoctor)?.name
  )

  const isCurrentTime = (hour: number, minute: number) => {
    return currentTime.getHours() === hour && 
           currentTime.getMinutes() >= minute && 
           currentTime.getMinutes() < minute + 30
  };

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    const selectedDoctorConfig = doctors.find(d => d.id.toString() === doctorId);
    if (selectedDoctorConfig) {
      updateAgendaWithDoctorSettings(selectedDoctorConfig);
    }
  };

  const handleSaveDoctorConfig = (updatedDoctor: Doctor) => {
    const appointmentsPerHour = Math.floor(60 / updatedDoctor.appointmentDuration)
    const appointmentsPerDay = calculateAppointmentsPerDay(updatedDoctor)
    
    const newDoctor = {
      ...updatedDoctor,
      appointmentsPerHour,
      appointmentDuration: updatedDoctor.appointmentDuration,
    }
    
    setDoctors(prev => prev.map(doc => doc.id === newDoctor.id ? newDoctor : doc))
  }

  return (
    <div className="flex h-screen flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-2">
  <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Selecione um médico" />
    </SelectTrigger>
    <SelectContent>
      {doctors.map((doctor) => (
        <SelectItem key={doctor.id} value={doctor.id.toString()}>
          {doctor.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <div className="flex items-center gap-4">
    <Button 
      variant="outline" 
      size="sm"
      onClick={navigateToToday}
    >
      HOJE
    </Button>
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={navigatePrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={navigateNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        {format(currentDate, "MMMM yyyy", { locale: ptBR })}
      </span>
    </div>
    <Select value={view} onValueChange={(value: "week" | "day") => setView(value)}>
      <SelectTrigger className="w-[100px]">
        <SelectValue>
          {view === "week" ? "Semana" : "Dia"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Semana</SelectItem>
        <SelectItem value="day">Dia</SelectItem>
      </SelectContent>
    </Select>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          1
        </span>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setIsSearchModalOpen(true)}>
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  </div>
</header>

      {/* Calendar Grid */}
      <div className="flex flex-1 relative">
      {currentTime.getHours() >= 8 && currentTime.getHours() < 20 && (
        <div 
          ref={timeIndicatorRef}
          className="absolute left-0 right-0 z-10 flex items-center"
          style={{
            top: `${((currentTime.getHours() - 8 + currentTime.getMinutes() / 60) / 12) * 100}%`,
          }}
        >
          <div className="h-3 w-3 rounded-full bg-[#0078FF] ml-[-6px]"></div>
          <div className="flex-grow border-t-2 border-[#0078FF]"></div>
        </div>
      )}
        {/* Time Column */}
        <div className="flex w-20 flex-col border-r">
          <div className="h-12 border-b">
            <Button 
              className="h-full w-full rounded-none bg-[#0078FF] text-white hover:bg-blue-600"
              onClick={() => handleNewAppointmentClick(new Date(), 8, 0)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1">
            {HOURS.map((hour) => (
              <div 
                key={hour} 
                className="h-28 border-b px-2 text-right text-sm text-gray-500"
              >
                <span className="sticky top-0">
                  {hour.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Days Columns */}
        <div className="flex flex-1">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="flex w-full min-w-[150px] flex-col border-r">
              {/* Day Header */}
              <div className="sticky top-0 z-10 flex h-12 flex-col items-center justify-center border-b bg-gray-50 py-1">
                <div className="text-sm text-gray-600">
                  {format(day, "EEE", { locale: ptBR })}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-medium">
                    {format(day, "d")}
                  </span>
                  <span className="text-xs text-gray-500">
                    /{format(day, "MM")}
                  </span>
                </div>
              </div>
              {/* Time Slots */}
              <div className="flex-1">
                {HOURS.map((hour) => (
                  <div key={hour} className="relative h-28 border-b">
                    {[0, 30].map((minute) => {
                      const appointment = getAppointmentForTimeSlot(day, hour, minute)
                      const slotTime = new Date(day).setHours(hour, minute)
                      const isNow = isCurrentTime(hour, minute)
                      return (
                        <div
                          key={`${hour}:${minute}`}
                          className={`absolute inset-x-0 top-0 h-14 hover:bg-blue-50`}
                          style={{ top: minute === 0 ? '0' : '50%' }}
                          onClick={() => !appointment && handleNewAppointmentClick(day, hour, minute)}
                        >
                          {appointment && (
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className={`absolute inset-0 flex flex-col justify-center p-2 text-left ${
                                appointment.status === 'confirmado' ? 'bg-green-100' :
                                appointment.status === 'aguardando' ? 'bg-yellow-100' :
                                'bg-red-100'
                              }`}
                            >
                              <span className="text-[#0078FF] font-medium text-sm truncate">
                                {appointment.patientName}
                              </span>
                              <span className="text-xs text-gray-600 truncate">
                                {appointment.doctorName}
                              </span>
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Appointment Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-between bg-[#0078FF] -mx-6 -mt-6 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <Image
                  src="/placeholder.svg"
                  alt="Patient"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedAppointment?.patientName}</h3>
                <p className="text-sm text-white/90">{selectedAppointment?.patientPhone}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedAppointment(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#0078FF] text-white flex items-center justify-center text-xs">
                {selectedAppointment?.doctorName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium">{selectedAppointment?.doctorName}</p>
                <p className="text-xs text-gray-500">Dr(a)</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {selectedAppointment?.time} - {selectedAppointment?.endTime}
                </span>
              </div>
              <Select 
                value={selectedAppointment?.status} 
                onValueChange={(value) => {
                  if (selectedAppointment) {
                    const updatedAppointment = { ...selectedAppointment, status: value as Appointment['status'] };
                    setSelectedAppointment(updatedAppointment);
                    setAppointments(prev => prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => handleDuplicateAppointment(selectedAppointment!)}
              >
                <Copy className="h-4 w-4" />
                Duplicar
              </Button>
              <Button 
                className="flex-1 gap-2 bg-[#0078FF] hover:bg-blue-600"
                onClick={() => handleEditClick(selectedAppointment!)}
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Editar Consulta</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Alert className="bg-yellow-50 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Esta consulta está fora do horário de atendimento de {editingAppointment?.doctorName}.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label>Paciente *</Label>
                <div className="flex gap-2">
                  <Input 
                    value={editingAppointment?.patientName || ''} 
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => clearField('patientName')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="link" 
                  className="mt-1 h-auto p-0 text-[#0078FF]"
                  asChild
                >
                  <Link href="/pacientes/1">
                    Abrir ficha do paciente
                  </Link>
                </Button>
              </div>

              <div>
                <Label>Celular do paciente</Label>
                <div className="flex gap-2">
                  <Input 
                    value={editingAppointment?.patientPhone || ''}
                    onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="link" className="text-[#0078FF]">
                    Alterar número
                  </Button>
                </div>
              </div>

              <div>
                <Label>Profissional *</Label>
                <div className="flex gap-2">
                  <Input 
                    value={editingAppointment?.doctorName || ''}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => clearField('doctorName')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Data da consulta *</Label>
                  <Input 
                    type="date"
                    value={editingAppointment?.date || format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Hora de início *</Label>
                  <Input 
                    type="time"
                    value={editingAppointment?.time || ''}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Duração da consulta (min) *</Label>
                  <Input 
                    type="number"
                    value={editingAppointment?.duration?.toString() || '60'}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Button variant="link" className="h-auto p-0 text-[#0078FF]">
                Encontrar horário livre
              </Button>

              <div>
                <Label>Observação</Label>
                <Textarea 
                  value={editingAppointment?.observation || ''}
                  onChange={(e) => handleInputChange('observation', e.target.value)}
                  className="h-[100px]"
                />
              </div>

              <div>
                <Label>Status da consulta</Label>
                <Select 
                  value={editingAppointment?.status || ''}
                  onValueChange={(value) => handleInputChange('status', value as Appointment['status'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="cancelado">Cancelado pelo paciente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Retornar em</Label>
                <Select 
                  value={editingAppointment?.returnVisit || 'sem-retorno'}
                  onValueChange={(value) => handleInputChange('returnVisit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem-retorno">Sem retorno</SelectItem>
                    <SelectItem value="7-dias">7 dias</SelectItem>
                    <SelectItem value="15-dias">15 dias</SelectItem>
                    <SelectItem value="30-dias">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="reminder" 
                  checked={editingAppointment?.sendReminder || false}
                  onCheckedChange={(checked) => handleInputChange('sendReminder', checked)}
                />
                <Label htmlFor="reminder">Enviar lembrete de consulta automático</Label>
              </div>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  A clínica está sem saldo de WhatsApp. A mensagem pode não ser enviada.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                FECHAR
              </Button>
              <Button variant="destructive" onClick={handleDeleteAppointment}>
                EXCLUIR
              </Button>
              <Button className="bg-[#0078FF] hover:bg-blue-600" onClick={handleUpdateAppointment}>
                SALVAR
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Appointment Dialog */}
      <Dialog open={isNewAppointmentModalOpen} onOpenChange={setIsNewAppointmentModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="border-b pb-4">
            <div className="flex gap-4">
              <Button
                variant={activeTab === 'consulta' ? 'default' : 'ghost'}
                className={activeTab === 'consulta' ? 'bg-[#0078FF]' : ''}
                onClick={() => setActiveTab('consulta')}
              >
                Consulta
              </Button>
              <Button
                variant={activeTab === 'compromisso' ? 'default' : 'ghost'}
                className={activeTab === 'compromisso' ? 'bg-[#0078FF]' : ''}
                onClick={() => setActiveTab('compromisso')}
              >
                Compromisso
              </Button>
            </div>
          </div>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Paciente <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newAppointment.patientName || ''}
                onChange={(e) => handleNewAppointmentChange('patientName', e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-red-500">Este campo é obrigatório</p>
            </div>

            <div className="space-y-2">
              <Label>
                Profissional <span className="text-red-500">*</span>
              </Label>
              <Input value={newAppointment.doctorName || ''} readOnly className="bg-gray-50" />
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Clock className="h-4 w-4" />
              Encontrar horário livre
            </Button>

            <div>
              <Label>
                Duração da consulta (min) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={newAppointment.duration?.toString() || '60'}
                onChange={(e) => handleNewAppointmentChange('duration', parseInt(e.target.value) || 60)}
              />
            </div>

            <div>
              <Label>Observação</Label>
              <Textarea
                value={newAppointment.observation || ''}
                onChange={(e) => handleNewAppointmentChange('observation', e.target.value)}
                maxLength={500}
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                {(newAppointment.observation?.length || 0)} / 500
              </div>
            </div>

            <div>
              <Label>Retornar em</Label>
              <Select
                value={newAppointment.returnVisit || 'sem-retorno'}
                onValueChange={(value) => handleNewAppointmentChange('returnVisit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem-retorno">Sem retorno</SelectItem>
                  <SelectItem value="7-dias">7 dias</SelectItem>
                  <SelectItem value="15-dias">15 dias</SelectItem>
                  <SelectItem value="30-dias">30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="reminder"
                checked={newAppointment.sendReminder || false}
                onCheckedChange={(checked) => handleNewAppointmentChange('sendReminder', checked)}
              />
              <Label htmlFor="reminder">Enviar lembrete de consulta automático</Label>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                A clínica está sem saldo de WhatsApp. A mensagem pode não serenviada.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex items-center justify-between border-t pt-4">
            <Select defaultValue="">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione um rótulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="retorno">Retorno</SelectItem>
                <SelectItem value="primeira-consulta">Primeira Consulta</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsNewAppointmentModalOpen(false)}>
                FECHAR
              </Button>
              <Button onClick={handleCreateAppointment} className="bg-[#0078FF] hover:bg-blue-600">
                MARCAR
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Buscar Consultas</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Buscar por paciente ou médico"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-[300px] overflow-y-auto">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="mb-2 rounded border p-2">
                  <p className="font-medium">{apt.patientName}</p>
                  <p className="text-sm text-gray-500">{apt.doctorName}</p>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(apt.date), "dd/MM/yyyy")} - {apt.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <DoctorConfig
        doctor={doctors.find(d => d.id.toString() === selectedDoctor) || doctors[0]}
        onSave={handleSaveDoctorConfig}
        isOpen={false}
        onClose={() => {}}
      />
      <div className="mt-8 mb-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Alesk. Todos os direitos reservados.
      </div>
    </div>
  )
}

