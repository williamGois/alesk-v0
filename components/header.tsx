import { Bell, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b bg-[#0078FF] px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src=""
            alt="Alesk Logo"
            width={100}
            height={40}
            className="text-white"
          />
          <div className="relative w-[480px]">
            <Input
              className="bg-white/90 pl-4 pr-10"
              placeholder="O que você procura?"
              type="search"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="relative text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                5
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="relative text-white">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                5
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Image
              src="/placeholder.svg"
              alt="Foto do perfil"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-medium">Olá Marcelo!</span>
          </div>
        </div>
      </div>
    </header>
  );
}
