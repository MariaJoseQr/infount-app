"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("#docentes");

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

  return (
    <div className="flex">
      <DashboardSidebar setActivePage={setActivePage} />
      <SidebarTrigger />

      <div className="p-8">
        {activePage === "#docentes" && (
          <div>Renderizando la página de Docentes</div>
        )}
        {activePage === "#tramites" && (
          <div>Renderizando la página de Trámites</div>
        )}
        {activePage === "#registros" && (
          <div>Renderizando la página de Registros</div>
        )}
      </div>
    </div>
  );
}
