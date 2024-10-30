"use client";

import clsx from "clsx";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { FileUser, Users, LibraryBig, Settings } from "lucide-react";

const items = [
  { title: "Docentes", url: "#docentes", icon: Users },
  { title: "Trámites", url: "#tramites", icon: FileUser },
  { title: "Registros", url: "#registros", icon: LibraryBig },
];

const accountItem = {
  title: "Mi Cuenta",
  url: "#cuenta",
  icon: Settings,
};

export function DashboardSidebar({
  activePage,
  onPageChange,
}: {
  activePage: string;
  onPageChange: (page: string) => void;
}) {
  return (
    <Sidebar className="bg-secondary">
      <SidebarContent>
        <div className="mx-auto pt-4">
          <Image src="/infologo.png" width={180} height={180} alt="Logo" />
        </div>
        <div className="px-2 text-center">
          <Separator />
          <p className="font-semibold pt-4 text-lg">INGENIERÍA INFORMÁTICA</p>
          <p className="font-ligth text-md pb-4 text-primary">
            Asesorías de Investigación
          </p>
          <Separator />
        </div>

        <SidebarMenu className="p-2 text-lg flex flex-col h-full">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={clsx("p-5 rounded", {
                  "hover:bg-primary bg-primary text-white hover:text-white":
                    activePage === item.url,
                  "hover:bg-gray-200 hover:text-black": activePage !== item.url,
                })}
                onClick={() => onPageChange(item.url)}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5" />
                  <span className="pl-2 text-lg">{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className="mt-auto pb-2">
            <SidebarMenuButton
              className={clsx("p-5 rounded", {
                "hover:bg-primary bg-primary text-white hover:text-white":
                  activePage === accountItem.url,
                "hover:bg-gray-200 hover:text-black":
                  activePage !== accountItem.url,
              })}
              onClick={() => onPageChange(accountItem.url)}
            >
              <div className="flex items-center">
                <accountItem.icon className="w-5 h-5" />
                <span className="pl-2 text-lg">{accountItem.title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
