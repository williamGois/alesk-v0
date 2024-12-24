"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { format, addMonths, addYears, isBefore } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Lancamento {
  id: string
  data: Date
  descricao: string
  valor: string // Change this to string
  formaPagamento: string
  status: string
  isRecorrente: boolean
  periodicidade?: 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual'
  dataInicial?: Date
  dataFinal?: Date | null
}

// Simulating fetching lancamento data
const fetchLancamento = async (id: string): Promise<Lancamento> => {
  // This would be replaced with an actual API call
  return {
    id,
    data: new Date(),
    descricao: "Consulta clínica - Paciente X",
    valor: "150.00", // Change this to a string
    formaPagamento: "Cartão",
    status: "Pago",
    isRecorrente: false,
    periodicidade: undefined,
    dataInicial: undefined,
    dataFinal: null
  }
}

export default function EditarLancamento({ params }: { params: { id: string } }) {
  const [lancamento, setLancamento] = useState<Lancamento | null>(null)
  const [datasCobrana, setDatasCobrana] = useState<Date[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadLancamento = async () => {
      const lancamentoData = await fetchLancamento(params.id)
      setLancamento(lancamentoData)
    }
    loadLancamento()
  }, [params.id])

  useEffect(() => {
    if (lancamento?.isRecorrente && lancamento.periodicidade && lancamento.dataInicial) {
      const datas = []
      let dataAtual = new Date(lancamento.dataInicial)
      const dataLimite = lancamento.dataFinal || addYears(dataAtual, 1)

      while (isBefore(dataAtual, dataLimite)) {
        datas.push(new Date(dataAtual))
        switch (lancamento.periodicidade) {
          case 'mensal':
            dataAtual = addMonths(dataAtual, 1)
            break
          case 'bimestral':
            dataAtual = addMonths(dataAtual, 2)
            break
          case 'trimestral':
            dataAtual = addMonths(dataAtual, 3)
            break
          case 'semestral':
            dataAtual = addMonths(dataAtual, 6)
            break
          case 'anual':
            dataAtual = addYears(dataAtual, 1)
            break
        }
      }
      setDatasCobrana(datas)
    } else {
      setDatasCobrana([])
    }
  }, [lancamento])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica real de atualização
    toast({
      title: "Lançamento atualizado com sucesso!",
      description: "As informações do lançamento foram atualizadas.",
    })
    router.push('/financeiro/lancamentos')
  }

  if (!lancamento) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">Editar Lançamento</h1>
      
      <div className="flex gap-6">
        <Card className="p-6 flex-grow max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="data">Data*</Label>
              <Input
                id="data"
                type="date"
                value={format(lancamento.data, 'yyyy-MM-dd')}
                onChange={(e) => setLancamento({ ...lancamento, data: new Date(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição*</Label>
              <Input
                id="descricao"
                value={lancamento.descricao}
                onChange={(e) => setLancamento({ ...lancamento, descricao: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor*</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={lancamento.valor}
                onChange={(e) => setLancamento({ ...lancamento, valor: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formaPagamento">Forma de Pagamento*</Label>
              <Select
                value={lancamento.formaPagamento}
                onValueChange={(value) => setLancamento({ ...lancamento, formaPagamento: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Convênio">Convênio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select
                value={lancamento.status}
                onValueChange={(value) => setLancamento({ ...lancamento, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Parcial">Parcial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isRecorrente"
                checked={lancamento.isRecorrente}
                onCheckedChange={(checked) => 
                  setLancamento({ ...lancamento, isRecorrente: checked })
                }
              />
              <Label htmlFor="isRecorrente">Lançamento Recorrente</Label>
            </div>

            {lancamento.isRecorrente && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="periodicidade">Periodicidade</Label>
                  <Select
                    value={lancamento.periodicidade}
                    onValueChange={(value) => setLancamento({ ...lancamento, periodicidade: value as Lancamento['periodicidade'] })}
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
                    value={lancamento.dataInicial ? format(lancamento.dataInicial, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setLancamento({ ...lancamento, dataInicial: new Date(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFinal">Data Final (opcional)</Label>
                  <Input
                    id="dataFinal"
                    type="date"
                    value={lancamento.dataFinal ? format(lancamento.dataFinal, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setLancamento({ ...lancamento, dataFinal: e.target.value ? new Date(e.target.value) : null })}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => router.push('/financeiro/lancamentos')}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0078FF] hover:bg-blue-600">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card>

        {lancamento.isRecorrente && datasCobrana.length > 0 && (
          <Card className="p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Próximas Cobranças</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {datasCobrana.map((data, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{format(data, 'dd/MM/yyyy', { locale: ptBR })}</span>
                  <span>{parseFloat(lancamento.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

