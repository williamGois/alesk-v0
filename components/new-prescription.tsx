"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Trash2, Calendar, Search } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Medication {
  id: string
  name: string
  quantity: string
  unit: string
  posology: string
}

const UNITS = [
  "Ampola(s)",
  "Caixa(s)",
  "Comprimido(s)",
  "Frasco(s)",
  "Pacote(s)",
]

const MOCK_MEDICATIONS = [
  "Aciclovir 200mg",
  "Ceftriaxona Sódica 1g",
  "Amoxicilina 500mg",
  "Dipirona 500mg",
  "Ibuprofeno 600mg",
]

interface NewPrescriptionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientName: string
  patientAddress: string
}

export function NewPrescription({ open, onOpenChange, patientName, patientAddress }: NewPrescriptionProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [selectedMedication, setSelectedMedication] = useState<Medication>({
    id: "",
    name: "",
    quantity: "1",
    unit: "Caixa(s)",
    posology: ""
  })
  const [professional, setProfessional] = useState("")
  // const [openMedicationSelect, setOpenMedicationSelect] = useState(false)

  const handleAddMedication = () => {
    if (selectedMedication.name && selectedMedication.quantity && selectedMedication.unit) {
      setMedications([...medications, { ...selectedMedication, id: Date.now().toString() }])
      setSelectedMedication({
        id: "",
        name: "",
        quantity: "1",
        unit: "Caixa(s)",
        posology: ""
      })
      // setOpenMedicationSelect(false)
    }
  }

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id))
  }

  const handleSavePrescription = () => {
    onOpenChange(false)
    toast({
      title: "Receita salva com sucesso",
      className: "bg-green-500 text-white",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receituário</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Profissional *</Label>
                <Input 
                  placeholder="Digite o nome do profissional" 
                  value={professional}
                  onChange={(e) => setProfessional(e.target.value)}
                />
              </div>

              <div>
                <Label>Paciente</Label>
                <Input value={patientName} readOnly className="bg-gray-50" />
              </div>

              <div>
                <Label>Endereço</Label>
                <Input value={patientAddress} readOnly className="bg-gray-50" />
              </div>

              <div className="w-[200px]">
                <Label>Data</Label>
                <div className="relative">
                  <Input 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                </div>
              </div>
            </div>

            {/* Medications List */}
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="relative rounded-lg border border-green-500 bg-green-50 p-4">
                  <div className="grid gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Label>Medicamento</Label>
                        <Input value={med.name} readOnly className="bg-green-100" />
                      </div>
                      <div className="w-[100px]">
                        <Label>Qtd.</Label>
                        <Input value={med.quantity} readOnly className="bg-green-100" />
                      </div>
                      <div className="w-[150px]">
                        <Label>Medida</Label>
                        <Input value={med.unit} readOnly className="bg-green-100" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-8"
                        onClick={() => handleRemoveMedication(med.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label>Posologia</Label>
                      <Input value={med.posology} readOnly className="bg-green-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Medication */}
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Label>Medicamento</Label>
                  <Select
                    value={selectedMedication.name}
                    onValueChange={(value) => setSelectedMedication(prev => ({ ...prev, name: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_MEDICATIONS.map((med) => (
                        <SelectItem key={med} value={med}>
                          {med}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[100px]">
                  <Label>Qtd.</Label>
                  <Input
                    type="number"
                    value={selectedMedication.quantity}
                    onChange={(e) => setSelectedMedication(prev => ({ ...prev, quantity: e.target.value }))}
                    min="1"
                  />
                </div>
                <div className="w-[150px]">
                  <Label>Medida</Label>
                  <Select
                    value={selectedMedication.unit}
                    onValueChange={(value) => setSelectedMedication(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Posologia</Label>
                <Input
                  value={selectedMedication.posology}
                  onChange={(e) => setSelectedMedication(prev => ({ ...prev, posology: e.target.value }))}
                  placeholder="Ex: Tomar 2 comprimidos via oral de 12 em 12 horas por 5 dias"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddMedication} disabled={!selectedMedication.name}>
                  Adicionar Medicamento
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            FECHAR
          </Button>
          <Button onClick={handleSavePrescription}>
            SALVAR RECEITA
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

