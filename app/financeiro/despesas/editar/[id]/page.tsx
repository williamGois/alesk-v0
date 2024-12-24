"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"

interface Despesa {
  id: string
  data: Date
  categoria: string
  descricao: string
  valor: number
  status: string
  isRecorrente: boolean
  periodicidade?: 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual'
  dataInicial?: Date
  dataFinal?: Date | null
}

// Simulating fetching despesa data
const fetchDespesa = async (id: string): Promise<Despesa> => {
  // This would be replaced with an actual API call
  return {
    id,
    data: new Date(),
    categoria: "Infraestrutura",
    descricao: "Aluguel do consultório - Junho",
    valor: 2000.00,
    status: "Pago",
    isRecorrente: true,
    periodicidade: "mensal",
    dataInicial: new Date(),
    dataFinal: null
  }
}

export default function EditarDespesa({ params }: { params: { id: string } }) {
  const [despesa, setDespesa] = useState<Despesa | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadDespesa = async () => {
      const despesaData = await fetchDespesa(params.id)
      setDespesa(despesaData)
    }
    loadDespesa()
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica real de atualização
    toast({
      title: "Despesa atualizada com sucesso!",
      description: "As informações da despesa foram atualizadas.",
    })
    router.push('/financeiro/despesas')
  }

  if (!despesa) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">Editar Despesa</h1>

      <Card className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="data">Data*</Label>
            <Input
              id="data"
              type="date"
              value={format(despesa.data, 'yyyy-MM-dd')}
              onChange={(e) => setDespesa({ ...despesa, data: new Date(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria*</Label>
            <Select
              value={despesa.categoria}
              onValueChange={(value) => setDespesa({ ...despesa, categoria: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                <SelectItem value="Equipamento">Equipamento</SelectItem>
                <SelectItem value="Material de Consumo">Material de Consumo</SelectItem>
                <SelectItem value="Folha de Pagamento">Folha de Pagamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição*</Label>
            <Input
              id="descricao"
              value={despesa.descricao}
              onChange={(e) => setDespesa({ ...despesa, descricao: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor*</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={despesa.valor}
              onChange={(e) => setDespesa({ ...despesa, valor: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status*</Label>
            <Select
              value={despesa.status}
              onValueChange={(value) => setDespesa({ ...despesa, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Parcelado">Parcelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isRecorrente">É recorrente?</Label>
            <Checkbox
              id="isRecorrente"
              checked={despesa.isRecorrente}
              onCheckedChange={(checked) =>
                setDespesa({ ...despesa, isRecorrente: checked as boolean })
              }
            />
          </div>

          {despesa.isRecorrente && (
            <>
              <div className="space-y-2">
                <Label htmlFor="periodicidade">Periodicidade</Label>
                <Select
                  value={despesa.periodicidade}
                  onValueChange={(value) => setDespesa({ ...despesa, periodicidade: value as Despesa['periodicidade'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="bimestral">Bimestral</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataInicial">Data Inicial</Label>
                <Input
                  id="dataInicial"
                  type="date"
                  value={despesa.dataInicial ? format(despesa.dataInicial, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDespesa({ ...despesa, dataInicial: new Date(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFinal">Data Final (opcional)</Label>
                <Input
                  id="dataFinal"
                  type="date"
                  value={despesa.dataFinal ? format(despesa.dataFinal, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDespesa({ ...despesa, dataFinal: e.target.value ? new Date(e.target.value) : null })}
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.push('/financeiro/despesas')}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0078FF] hover:bg-blue-600">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

