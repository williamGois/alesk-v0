"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  isOnline: boolean;
  lastSeen: Date;
  role: string;
  department: string;
}

interface Rule {
  id: string;
  name: string;
  description: string;
  users: User[];
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 99999-9999",
    avatar: "",
    isOnline: true,
    lastSeen: new Date(),
    role: "Médico",
    department: "Cardiologia",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    phone: "(11) 98888-8888",
    avatar: "",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    role: "Enfermeira",
    department: "Emergência",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@example.com",
    phone: "(11) 97777-7777",
    avatar: "",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    role: "Recepcionista",
    department: "Atendimento",
  },
];

const MOCK_RULES: Rule[] = [
  {
    id: "1",
    name: "Administrador",
    description: "Acesso total ao sistema",
    users: [MOCK_USERS[0], MOCK_USERS[1]],
  },
  {
    id: "2",
    name: "Médico",
    description: "Acesso às funcionalidades médicas",
    users: [MOCK_USERS[1], MOCK_USERS[2]],
  },
  {
    id: "3",
    name: "Recepcionista",
    description: "Acesso às funcionalidades de recepção",
    users: [MOCK_USERS[0]],
  },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

function formatLastSeen(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Agora mesmo";
  if (diffInMinutes < 60) return `Há ${diffInMinutes} minutos`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Há ${diffInHours} horas`;

  return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
}

export default function RegrasPage() {
  const [rules, setRules] = useState<Rule[]>(MOCK_RULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredRules.length / itemsPerPage);
  const paginatedRules = filteredRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0078FF]">
          Regras de Acesso
        </h1>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Buscar regra"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
              <TableHead className="text-white">Nome da Regra</TableHead>
              <TableHead className="text-white">Descrição</TableHead>
              <TableHead className="text-white">Usuários</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.description}</TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    <TooltipProvider delayDuration={100}>
                      {rule.users.map((user, index) => (
                        <Tooltip key={user.id}>
                          <TooltipTrigger asChild>
                            <div
                              className="relative h-8 w-8 cursor-pointer rounded-full border-2 border-white bg-white transition-transform hover:z-10 hover:scale-110"
                              style={{ zIndex: rule.users.length - index }}
                              onClick={() => setSelectedUser(user)}
                            >
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                fill
                                className="rounded-full object-cover"
                              />
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                                  user.isOnline ? "bg-green-500" : "bg-gray-300"
                                }`}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">
                                {user.isOnline
                                  ? "Online"
                                  : `Visto por último ${formatLastSeen(
                                      user.lastSeen
                                    )}`}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
          {Math.min(currentPage * itemsPerPage, filteredRules.length)} de{" "}
          {filteredRules.length} resultados
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((page) => Math.min(pageCount, page + 1))
            }
            disabled={currentPage === pageCount}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0">
              {selectedUser && (
                <>
                  <Image
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                      selectedUser.isOnline ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
              <p className="text-sm text-gray-500">{selectedUser?.role}</p>
              <p className="text-sm text-gray-500">
                {selectedUser?.department}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {selectedUser?.isOnline
                  ? "Online agora"
                  : selectedUser &&
                    `Visto por último ${formatLastSeen(selectedUser.lastSeen)}`}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{selectedUser?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{selectedUser?.phone}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
