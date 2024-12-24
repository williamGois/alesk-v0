import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout.client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alesk - Plataforma de Saúde",
  description: "Transforme sua carreira na área da saúde",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {/* Render a client component, passing children along */}
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
