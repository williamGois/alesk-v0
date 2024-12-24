import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Doctor {
  id: number
  name: string
  appointmentsPerHour: number
  appointmentDuration: number
  workingHours: {
    start: string;
    end: string;
  }
}

interface DoctorConfigProps {
  doctor: Doctor
  onSave: (updatedDoctor: Doctor) => void
  isOpen: boolean
  onClose: () => void
}

const calculateAppointmentsPerDay = (doctor: Doctor) => {
  const [startHour, startMinute] = doctor.workingHours.start.split(':').map(Number)
  const [endHour, endMinute] = doctor.workingHours.end.split(':').map(Number)
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
  return Math.floor(totalMinutes / doctor.appointmentDuration) * doctor.appointmentsPerHour
}

export function DoctorConfig({ doctor, onSave, isOpen, onClose }: DoctorConfigProps) {
  const [editedDoctor, setEditedDoctor] = React.useState<Doctor>({
    ...doctor,
    appointmentsPerHour: doctor.appointmentsPerHour || 1,
    appointmentDuration: doctor.appointmentDuration || 60
  })

  const [appointmentsPerDay, setAppointmentsPerDay] = React.useState(
    calculateAppointmentsPerDay(doctor)
  )

  const handleInputChange = (field: keyof Doctor, value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    let updatedDoctor = { ...editedDoctor, [field]: numValue }

    if (field === 'appointmentDuration') {
      updatedDoctor.appointmentsPerHour = Math.floor(60 / numValue)
    } else if (field === 'appointmentsPerHour') {
      updatedDoctor.appointmentDuration = Math.floor(60 / numValue)
    }

    setEditedDoctor(updatedDoctor)
    setAppointmentsPerDay(calculateAppointmentsPerDay(updatedDoctor))
  }

  const handleSave = () => {
    onSave({ ...editedDoctor, appointmentsPerDay })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Agenda do Médico</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={editedDoctor.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointmentsPerHour" className="text-right">
              Consultas por Hora
            </Label>
            <Input
              id="appointmentsPerHour"
              type="number"
              value={editedDoctor.appointmentsPerHour.toString()}
              onChange={(e) => handleInputChange('appointmentsPerHour', parseInt(e.target.value) || 1)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointmentDuration" className="text-right">
              Duração da Consulta (min)
            </Label>
            <Input
              id="appointmentDuration"
              type="number"
              value={editedDoctor.appointmentDuration.toString()}
              onChange={(e) => handleInputChange('appointmentDuration', parseInt(e.target.value) || 60)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointmentsPerDay" className="text-right">
              Vagas por Dia
            </Label>
            <Input
              id="appointmentsPerDay"
              type="number"
              value={appointmentsPerDay.toString()}
              readOnly
              className="col-span-3 bg-gray-100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

