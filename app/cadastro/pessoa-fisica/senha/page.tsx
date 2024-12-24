"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Stepper } from "@/components/stepper"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Printer } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Senha() {
  const router = useRouter()
  const [showTerms, setShowTerms] = useState(false)
  const [showSignature, setShowSignature] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)

  const handleBack = () => {
    router.push('/cadastro/pessoa-fisica/documentos')
  }

  const handlePrint = () => {
    const printContent = document.getElementById('contract-terms')?.innerHTML
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Termos do Contrato</title>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setIsDrawing(true)
    setLastPoint({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return

    const canvas = e.currentTarget
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.strokeStyle = '#0078FF'
    ctx.lineWidth = 2
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastPoint({ x, y })
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const canvas = e.currentTarget
      const signature = canvas.toDataURL()
      setSignature(signature)
    }
    setIsDrawing(false)
    setLastPoint(null)
  }

  const clearSignature = () => {
    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setSignature(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (signature) {
      router.push('/cadastro/pessoa-fisica/conclusao')
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#0078FF]">Home</Link>
        <span>/</span>
        <Link href="/cadastro" className="hover:text-[#0078FF]">meu cadastro</Link>
        <span>/</span>
        <span className="text-gray-400">prestador de serviço</span>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-[#0078FF]">
        Meu Cadastro
      </h1>
      <h2 className="mb-8 text-lg text-gray-600">
        Cadastro do prestador de serviço
      </h2>

      {/* Progress Steps */}
      <div className="mb-12">
        <Stepper totalSteps={7} currentStep={7} />
      </div>

      <Card className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#0078FF]">
            Crie sua senha
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Digite sua Senha
              </label>
              <Input 
                type="password"
                placeholder="Digite aqui"
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Digite Novamente
              </label>
              <Input 
                type="password"
                placeholder="Digite aqui"
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Ao criar sua conta você está de acordo com os{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-[#0078FF] hover:underline"
            >
              termos do contrato
            </button>
          </div>

          <div className="flex justify-between">
            <Button 
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button 
              type="submit"
              className="bg-[#0078FF] px-8 hover:bg-blue-600"
            >
              Finalizar Cadastro
            </Button>
          </div>
        </form>
      </Card>

      {/* Terms Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-4xl">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold">Termos do Contrato</h2>
          </div>
          <div 
            id="contract-terms"
            className="max-h-[60vh] overflow-y-auto py-4"
          >
            <h3 className="mb-4 text-lg font-semibold">1. Termos e Condições Gerais</h3>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <h3 className="mb-4 text-lg font-semibold">2. Responsabilidades</h3>
            <p className="mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <h3 className="mb-4 text-lg font-semibold">3. Privacidade e Segurança</h3>
            <p className="mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
          <div className="flex justify-end gap-4 border-t pt-4 mt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button
              onClick={() => {
                setShowTerms(false)
                setShowSignature(true)
              }}
            >
              Assinar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signature Modal */}
      <Dialog open={showSignature} onOpenChange={setShowSignature}>
        <DialogContent>
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold">Assinatura Digital</h2>
            <p className="mt-1 text-sm text-gray-600">
              Use o mouse para assinar no campo abaixo
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <canvas
                id="signature-canvas"
                width={400}
                height={200}
                className="border border-gray-200"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={clearSignature}
              >
                Limpar
              </Button>
              <Button
                onClick={() => setShowSignature(false)}
                disabled={!signature}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

