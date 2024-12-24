"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { format, addMonths, addYears, isBefore } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Despesa {
  id?: string;
  data: Date;
  categoria: string;
  descricao: string;
  valor: number;
  status: string;
  isRecorrente: boolean;
  periodicidade?: 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';
  dataInicial?: Date;
  dataFinal?: Date | null;
}

export default function NovaDespesa() {
  const [despesa, setDespesa] = useState<Despesa>({
    data: new Date(),
    categoria: '',
    descricao: '',
    valor: 0,
    status: '',
    isRecorrente: false,
  })
  const [datasCobrana, setDatasCobrana] = useState<Date[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (despesa.isRecorrente && despesa.periodicidade && despesa.dataInicial) {
      const datas = []
      let dataAtual = new Date(despesa.dataInicial)
      const dataLimite = despesa.dataFinal || addYears(dataAtual, 1)

      while (isBefore(dataAtual, dataLimite)) {
        datas.push(new Date(dataAtual))
        switch (despesa.periodicidade) {
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
  }, [despesa.isRecorrente, despesa.periodicidade, despesa.dataInicial, despesa.dataFinal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(despesa)
    toast({
      title: "Despesa criada com sucesso!",
      description: "A nova despesa foi adicionada.",
    })
    router.push('/financeiro/despesas')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#0078FF]">Nova Despesa</h1>
      
      <div className="flex gap-6">
        <Card className="p-6 flex-grow max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="data">Data*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !despesa.data && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {despesa.data ? format(despesa.data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={despesa.data}
                    onSelect={(date) => date && setDespesa({ ...despesa, data: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

            <div className="flex items-center space-x-2">
              <Switch
                id="isRecorrente"
                checked={despesa.isRecorrente}
                onCheckedChange={(checked) => 
                  setDespesa({ ...despesa, isRecorrente: checked })
                }
              />
              <Label htmlFor="isRecorrente">Despesa Recorrente</Label>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !despesa.dataInicial && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {despesa.dataInicial ? format(despesa.dataInicial, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={despesa.dataInicial}
                        onSelect={(date) => date && setDespesa({ ...despesa, dataInicial: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFinal">Data Final (opcional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !despesa.dataFinal && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {despesa.dataFinal ? format(despesa.dataFinal, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={despesa.dataFinal || undefined}
                        onSelect={(date) => setDespesa({ ...despesa, dataFinal: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => router.push('/financeiro/despesas')}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0078FF] hover:bg-blue-600">
                Salvar Despesa
              </Button>
            </div>
          </form>
        </Card>

        {despesa.isRecorrente && datasCobrana.length > 0 && (
          <Card className="p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Próximas Cobranças</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {datasCobrana.map((data, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{format(data, 'dd/MM/yyyy', { locale: ptBR })}</span>
                  <span>{despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

