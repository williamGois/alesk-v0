"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isCadastroPage = pathname === "/cadastro";
  const showHeaderSidebar = !isLoginPage && !isCadastroPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeaderSidebar && <Header />}
      <div className="flex">
        {showHeaderSidebar && (
          <Sidebar currentPage={pathname?.split("/")[1] || ""} />
        )}
        <main className={showHeaderSidebar ? "flex-1" : "w-full"}>
          {children}
        </main>
      </div>
    </div>
  );
}
