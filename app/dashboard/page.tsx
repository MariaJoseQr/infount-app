"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import RecordPage from "@/components/dashboard/records/RecordPage";
import { CircleUserRound, LogOut, Settings, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const initialPage = window.location.hash || "#docentes";
    setActivePage(initialPage);

    const handleHashChange = () => {
      setActivePage(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (!activePage) return null;

  const handlePageChange = (url: string) => {
    window.location.hash = url;
    setActivePage(url);
  };

  return (
    <>
      <main className="flex flex-1">
        <div className="flex pr-0">
          <DashboardSidebar
            activePage={activePage}
            onPageChange={handlePageChange}
          />
          <SidebarTrigger />
        </div>
        <div className="flex flex-col flex-1 mb-4 mx-4 sm:mx-6 md:mx-8 lg:mr-10 xl:mr-12 mt-16 gap-2">
          {activePage === "#docentes" && <RecordPage />}
          {activePage === "#tramites" && <RecordPage />}
          {activePage === "#registros" && <RecordPage />}
        </div>

        <DropdownMenu open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
          <DropdownMenuTrigger asChild>
            <div className="flex fixed top-5 right-5 bg-foreground shadow-lg z-50 rounded-full py-2 px-5 w-auto items-center cursor-pointer">
              <CircleUserRound className="pr-2 w-8 h-8" />
              <span className="font-semibold hidden md:block">Secretaría</span>
              <Menu className="block md:hidden text-primary" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <Link href="#cuenta" onClick={() => setActivePage("#cuenta")}>
              <DropdownMenuItem className="cursor-pointer">
                <Settings />
                Configuración
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer">
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </main>
    </>
  );
}
