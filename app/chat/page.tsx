"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Smile, Paperclip, Send } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  isOnline?: boolean
  avatar: string
  subtitle: string
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Olá como posso ser útil?",
    sender: "Nome do usuário",
    timestamp: "30min",
    isOnline: true,
    avatar: "/placeholder.svg",
    subtitle: "Gostaria de mais informações..."
  },
  {
    id: "2",
    content: "Olá tudo bem!",
    sender: "Você",
    timestamp: "30min",
    avatar: "/placeholder.svg",
    subtitle: "Gostaria de mais informações..."
  }
]

const MOCK_CONTACTS: Message[] = Array.from({ length: 7 }, (_, i) => ({
  id: `contact-${i + 1}`,
  sender: "Paciente",
  content: "",
  timestamp: "30min",
  avatar: "/placeholder.svg",
  subtitle: "Gostaria de mais informações..."
}))

const MOCK_RECENT_MESSAGES: Message[] = [
  {
    id: "recent-1",
    sender: "Dra. Paula Cintra",
    content: "",
    timestamp: "30min",
    avatar: "/placeholder.svg",
    subtitle: "Gostaria de mais informações..."
  },
  {
    id: "recent-2",
    sender: "Dra. Paula Cintra",
    content: "",
    timestamp: "1hora",
    avatar: "/placeholder.svg",
    subtitle: "Gostaria de mais informações..."
  },
  {
    id: "recent-3",
    sender: "Dra. Paula Cintra",
    content: "",
    timestamp: "ontem",
    avatar: "/placeholder.svg",
    subtitle: "Gostaria de mais informações..."
  }
]

export default function ChatPage() {
  const [message, setMessage] = useState("")

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Left Section - Contact List */}
      <div className="w-[300px] border-r bg-white">
        <div className="p-4">
          <h2 className="mb-4 text-lg font-medium">Lista de Contato</h2>
          <div className="relative">
            <Input 
              placeholder="Buscar contato"
              className="pl-4 pr-10"
            />
            <svg
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {MOCK_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 border-b p-4 hover:bg-gray-50"
            >
              <div className="relative">
                <Image
                  src={contact.avatar}
                  alt={contact.sender}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{contact.sender}</h3>
                  <span className="text-sm text-gray-500">{contact.timestamp}</span>
                </div>
                <p className="truncate text-sm text-gray-500">{contact.subtitle}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Middle Section - Chat */}
      <div className="flex flex-1 flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="flex items-center gap-4 border-b bg-white p-4">
          <div className="relative">
            <Image
              src="/placeholder.svg"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div>
            <h2 className="font-medium">Nome do usuário</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {MOCK_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === "Você" ? "flex-row-reverse" : ""
                }`}
              >
                <Image
                  src={msg.avatar}
                  alt={msg.sender}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div
                  className={`rounded-lg p-3 ${
                    msg.sender === "Você"
                      ? "bg-[#0078FF] text-white"
                      : "bg-white"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              placeholder="Escreva sua mensagem aqui"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" className="bg-[#0078FF] hover:bg-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section - Recent Messages */}
      <div className="w-[300px] border-l bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-medium">Mensagens recentes</h2>
          <Button variant="link" className="text-[#0078FF]">
            Ver todas
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {MOCK_RECENT_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center gap-3 border-b p-4 hover:bg-gray-50"
            >
              <Image
                src={msg.avatar}
                alt={msg.sender}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{msg.sender}</h3>
                  <span className="text-sm text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="truncate text-sm text-gray-500">{msg.subtitle}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

